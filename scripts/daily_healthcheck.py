#!/usr/bin/env python3
"""Daily healthcheck + light security audit for taka-inside."""
import json
import ssl
import time
import urllib.request
import urllib.error
from pathlib import Path
from datetime import datetime, timezone

# --- load credentials ------------------------------------------------
env = {}
for line in Path('/root/.env').read_text().splitlines():
    line = line.strip()
    if not line or line.startswith('#') or '=' not in line:
        continue
    k, v = line.split('=', 1)
    env[k] = v

VERCEL_TOKEN = env.get('VERCEL_TOKEN', '')
GITHUB_TOKEN = env.get('GITHUB_TOKEN', '')
STRAPI_API_TOKEN = env.get('STRAPI_API_TOKEN', '')
PREVIEW_SECRET = 'taka2026'

# --- helpers ---------------------------------------------------------
ssl_ctx = ssl.create_default_context()

def http_get(url, headers=None, timeout=15):
    t0 = time.time()
    try:
        req = urllib.request.Request(url, headers=headers or {})
        with urllib.request.urlopen(req, timeout=timeout, context=ssl_ctx) as resp:
            body = resp.read()
            return {
                'status': resp.status,
                'latency_ms': round((time.time() - t0) * 1000, 2),
                'size': len(body),
                'headers': dict(resp.headers),
                'body': body,
            }
    except urllib.error.HTTPError as e:
        return {
            'status': e.code,
            'latency_ms': round((time.time() - t0) * 1000, 2),
            'size': len(e.read() or b''),
            'headers': dict(e.headers),
            'body': e.read() if False else b'',
            'error': str(e),
        }
    except Exception as e:
        return {'status': None, 'latency_ms': round((time.time() - t0) * 1000, 2), 'size': 0, 'error': str(e)}


def has_brand(body):
    return b'Taka' in body


# --- state -----------------------------------------------------------
anomalies = []
report = {}

# --- 1) Public URLs --------------------------------------------------
public_urls = [
    '/',
    '/projets',
    '/boutique',
    '/contact',
    '/don',
    '/label-musical',
    '/association',
]
public_results = []
for path in public_urls:
    url = f'https://takainside.org{path}'
    r = http_get(url)
    public_results.append({
        'url': url,
        'status': r['status'],
        'latency_ms': r['latency_ms'],
        'size': r['size'],
        'brand': has_brand(r.get('body', b'')),
    })
    if r['status'] != 200:
        anomalies.append(f"Public {url} returned {r['status']} (expected 200)")
    if not has_brand(r.get('body', b'')):
        anomalies.append(f"Public {url} missing brand 'Taka'")

report['public'] = public_results

# --- 2) Preview bypass URLs -----------------------------------------
preview_urls = [
    '/',
    '/association',
    '/boutique',
    '/label-musical',
]
preview_results = []
for path in preview_urls:
    url = f'https://takainside.org{path}?preview={PREVIEW_SECRET}'
    r = http_get(url)
    body = r.get('body', b'')
    preview_results.append({
        'url': url,
        'status': r['status'],
        'latency_ms': r['latency_ms'],
        'size': r['size'],
        'brand': has_brand(body),
        'large': r['size'] > 30_000,
    })
    if r['status'] != 200:
        anomalies.append(f"Preview {url} returned {r['status']} (expected 200)")
    if r['size'] <= 30_000:
        anomalies.append(f"Preview {url} body size {r['size']} <= 30 KB — possible coming-soon leak")
    if not has_brand(body):
        anomalies.append(f"Preview {url} missing brand 'Taka'")

report['preview'] = preview_results

# --- 3) Vercel deployments -------------------------------------------
vercel_url = (
    'https://api.vercel.com/v6/deployments'
    '?projectId=prj_8h5X7oZAbC02gjW6nIxw6rL5bToc&limit=5'
)
vercel_resp = http_get(
    vercel_url,
    headers={'Authorization': f'Bearer {VERCEL_TOKEN}'},
    timeout=15,
)
vercel_ok = False
vercel_deploys = []
latest_vercel_sha = None
if vercel_resp.get('status') == 200:
    try:
        data = json.loads(vercel_resp.get('body', b''))
        deploys = data.get('deployments', [])
        for d in deploys[:5]:
            vercel_deploys.append({
                'uid': d.get('uid'),
                'state': d.get('state'),
                'target': d.get('target'),
                'url': d.get('url'),
                'git_commit_sha': (d.get('meta', {}) or {}).get('githubCommitSha') or d.get('gitCommitSha'),
                'created': d.get('created'),
            })
        if deploys:
            latest_vercel_sha = (deploys[0].get('meta', {}) or {}).get('githubCommitSha') or deploys[0].get('gitCommitSha')
        not_ready = [d for d in vercel_deploys if d['state'] != 'READY']
        not_prod = [d for d in vercel_deploys if d['target'] != 'production']
        if not_ready:
            anomalies.append(f"Vercel deploys not READY: {[d['uid'] for d in not_ready]}")
        if not_prod:
            anomalies.append(f"Vercel deploys not targeting production: {[d['uid'] for d in not_prod]}")
        vercel_ok = len(vercel_deploys) == 5 and not not_ready and not not_prod
    except Exception as e:
        anomalies.append(f"Vercel response parse error: {e}")
else:
    anomalies.append(f"Vercel API returned {vercel_resp.get('status')}: {vercel_resp.get('error')}")

report['vercel'] = {
    'api_status': vercel_resp.get('status'),
    'deployments': vercel_deploys,
    'latest_sha': latest_vercel_sha,
    'all_ready': vercel_ok,
}

# --- 4) GitHub repo --------------------------------------------------
gh_repo_resp = http_get(
    'https://api.github.com/repos/AssoTakin/taka-inside',
    headers={'Authorization': f'Bearer {GITHUB_TOKEN}'},
    timeout=15,
)
gh_commit_resp = http_get(
    'https://api.github.com/repos/AssoTakin/taka-inside/commits/master',
    headers={'Authorization': f'Bearer {GITHUB_TOKEN}'},
    timeout=15,
)
gh_prs_resp = http_get(
    'https://api.github.com/repos/AssoTakin/taka-inside/pulls?state=open&per_page=1',
    headers={'Authorization': f'Bearer {GITHUB_TOKEN}'},
    timeout=15,
)

repo_state = {}
latest_commit_sha = None
if gh_repo_resp.get('status') == 200:
    repo_data = json.loads(gh_repo_resp.get('body', b''))
    repo_state = {
        'default_branch': repo_data.get('default_branch'),
        'pushed_at': repo_data.get('pushed_at'),
        'open_issues_count': repo_data.get('open_issues_count'),
    }
else:
    anomalies.append(f"GitHub repo API returned {gh_repo_resp.get('status')}")

if gh_commit_resp.get('status') == 200:
    commit_data = json.loads(gh_commit_resp.get('body', b''))
    latest_commit_sha = commit_data.get('sha')
    repo_state['latest_commit_sha'] = latest_commit_sha
else:
    anomalies.append(f"GitHub commits API returned {gh_commit_resp.get('status')}")

open_prs = 0
if gh_prs_resp.get('status') == 200:
    prs_data = json.loads(gh_prs_resp.get('body', b''))
    # If there is at least one open PR, header Link gives count; fallback None
    link = gh_prs_resp.get('headers', {}).get('Link') or gh_prs_resp.get('headers', {}).get('link')
    if link and 'page=' in link:
        # very rough count extraction
        open_prs = len(prs_data) if prs_data else 0
    else:
        open_prs = len(prs_data)
else:
    anomalies.append(f"GitHub PRs API returned {gh_prs_resp.get('status')}")
repo_state['open_prs'] = open_prs

if latest_commit_sha and latest_vercel_sha and latest_commit_sha != latest_vercel_sha:
    anomalies.append(
        f"Vercel latest SHA {latest_vercel_sha} does not match GitHub master {latest_commit_sha}"
    )

report['github'] = repo_state

# --- 5) Strapi admin + custom admin reachability ---------------------
admin_url = 'https://taka-inside-production.up.railway.app/admin'
custom_admin_url = 'https://taka-inside-production.up.railway.app/taka-admin-2026'
admin_r = http_get(admin_url)
custom_admin_r = http_get(custom_admin_url)

if admin_r['status'] != 404:
    anomalies.append(f"Strapi /admin is reachable with status {admin_r['status']} (expected 404)")
if custom_admin_r['status'] != 200:
    anomalies.append(f"Strapi /taka-admin-2026 returned {custom_admin_r['status']} (expected 200)")

report['strapi_admin'] = {
    'admin_status': admin_r['status'],
    'custom_admin_status': custom_admin_r['status'],
}

# --- 6) Strapi content types authenticated ---------------------------
content_types_slug = [
    'artistes', 'benevoles', 'categorie-produits', 'commandes', 'dons',
    'don-configs', 'global-ctas', 'homepage', 'legal-pages', 'menu-items',
    'page-contents', 'payment-methods', 'produits', 'projets', 'site-config',
    'zone-livraisons', 'config-menus',
]
auth_headers = {'Authorization': f'Bearer {STRAPI_API_TOKEN}'}
content_results = {}
for slug in content_types_slug:
    url = f'https://taka-inside-production.up.railway.app/api/{slug}'
    r = http_get(url, headers=auth_headers)
    content_results[slug] = {
        'status': r['status'],
        'size': r['size'],
    }
    if r['status'] not in (200, 204):
        anomalies.append(f"Strapi authenticated /api/{slug} returned {r['status']} (expected 200/204)")

report['strapi_content_types'] = content_results

# --- 7) Public API exposure without token ----------------------------
public_api_slugs = ['artistes', 'produits', 'categorie-produits', 'projets']
public_api_results = {}
for slug in public_api_slugs:
    url = f'https://taka-inside-production.up.railway.app/api/{slug}'
    r = http_get(url)
    public_api_results[slug] = {'status': r['status'], 'size': r['size']}
    if r['status'] not in (401, 403):
        anomalies.append(
            f"Strapi public /api/{slug} returned {r['status']} (expected 401/403 without token)"
        )

report['strapi_public_exposure'] = public_api_results

# --- 8) Security headers ---------------------------------------------
home_r = http_get('https://takainside.org/')
sec_headers = home_r.get('headers', {})
required_headers = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Strict-Transport-Security': None,  # just presence
}
sec_report = {}
for h, expected in required_headers.items():
    val = sec_headers.get(h)
    if val is None:
        anomalies.append(f"Missing security header {h}")
        sec_report[h] = None
    elif expected and val.lower() != expected.lower():
        anomalies.append(f"Security header {h} = {val!r} (expected {expected!r})")
        sec_report[h] = val
    else:
        sec_report[h] = val

report['security_headers'] = sec_report

# --- 9) Verdict ------------------------------------------------------
if not anomalies:
    verdict = 'HEALTHY'
elif all('alias' in a.lower() or '410' in a for a in anomalies):
    verdict = 'DEGRADED'
else:
    # classify: site down / strapi down / admin exposed / security headers missing -> CRITICAL
    critical_keywords = ('returned None', 'returned 5', '/admin is reachable', 'Missing security header',
                         'public /api/', 'Strapi /taka-admin-2026 returned')
    if any(k in a for a in anomalies for k in critical_keywords):
        verdict = 'DOWN'
    else:
        verdict = 'DEGRADED'

# --- print report ----------------------------------------------------
print('=' * 60)
print('RAPPORT HEALTHCHECK + AUDIT SÉCURITÉ — taka-inside')
print('Généré:', datetime.now(timezone.utc).isoformat())
print('=' * 60)
print()
print('📁 REPO GitHub')
print(json.dumps(report['github'], indent=2, ensure_ascii=False))
print()
print('🚀 VERCEL')
print(f"API status: {report['vercel']['api_status']}")
print(f"Latest SHA: {report['vercel']['latest_sha']}")
print(f"All READY production: {report['vercel']['all_ready']}")
for d in report['vercel']['deployments']:
    print(f"  - {d['uid'][:18]}…  state={d['state']}  target={d['target']}  sha={d['git_commit_sha']}")
print()
print('🗄️  STRAPI ADMIN')
print(f"/admin status: {report['strapi_admin']['admin_status']} (expected 404)")
print(f"/taka-admin-2026 status: {report['strapi_admin']['custom_admin_status']} (expected 200)")
print()
print('🌐 LIVE SITE public')
for r in report['public']:
    print(f"  {r['url']}  HTTP {r['status']}  {r['latency_ms']} ms  {r['size']} B  Taka={r['brand']}")
print()
print('🌐 LIVE SITE preview')
for r in report['preview']:
    print(f"  {r['url']}  HTTP {r['status']}  {r['latency_ms']} ms  {r['size']} B  Taka={r['brand']}  >30KB={r['large']}")
print()
print('🛡️  STRAPI API PUBLIQUE (sans token)')
for slug, r in report['strapi_public_exposure'].items():
    print(f"  /api/{slug}  HTTP {r['status']}  {r['size']} B")
print()
print('🔐 HEADERS DE SÉCURITÉ (takainside.org)')
for h, v in report['security_headers'].items():
    print(f"  {h}: {v}")
print()
print('📊 CONTENT-TYPES STRAPI (authentifiés)')
for slug, r in report['strapi_content_types'].items():
    print(f"  /api/{slug}  HTTP {r['status']}  {r['size']} B")
print()
print('⚠️  ANOMALIES')
if anomalies:
    for a in anomalies:
        print(f"  - {a}")
else:
    print('  NONE')
print()
print('✅ VERDICT:', verdict)

# Architecture Multi-Bot Hermes

> Documentation des lecons apprises pendant le setup multi-profils Hermes-Agent sur srv1717288 (30 juin 2026)

## Vue d ensemble

Hermes-Agent peut tourner plusieurs bots Telegram simultanement, chacun avec :
- Son propre token Telegram
- Sa propre base de sessions
- Sa propre memoire (USER.md, MEMORY.md)
- Son propre system prompt (SOUL.md)
- Son propre LLM
- Son propre service systemd

## Isolation des profils (cloisonnement)

| Element | Localisation | Proprietaire |
|---------|--------------|--------------|
| Profil taka-inside | `/home/hermes/.hermes/profiles/taka-inside/` | hermes:hermes (700) |
| Profil solidprojectbot | `/home/hermes/.hermes/profiles/solidprojectbot/` | hermes:hermes (700) |
| Token Telegram taka-inside | `profiles/taka-inside/.env` (chmod 640) | Token A |
| Token Telegram solidprojectbot | `profiles/solidprojectbot/.env` (chmod 640) | Token B (distinct) |
| Sessions DB taka-inside | `profiles/taka-inside/state.db` (chmod 640) | isole |
| Sessions DB solidprojectbot | `profiles/solidprojectbot/state.db` (chmod 640) | isole |
| Service systemd taka-inside | `hermes-taka-inside-gateway.service` (User=root) | actif |
| Service systemd solidprojectbot | `hermes-SolidProjectBot-gateway.service` (User=root) | actif |

## Variables d environnement critiques (systemd units)

```ini
[Service]
Environment=HERMES_HOME=/home/hermes/.hermes/profiles/<profile-name>
ExecStart=/usr/local/bin/hermes --profile <profile-name-lowercase> gateway run --replace
```

> **CRITIQUE** : `HERMES_HOME` DOIT pointer vers le repertoire du profil specifique, sinon Hermes charge le `SOUL.md` depuis `~/.hermes/SOUL.md` (defaut generique) et non depuis le profil.

## Lecons apprises

### 1. Le bug initial "Projets en vedette" homepage
- Homepage `app/page.tsx` utilisait `extractUrl(projet.image_couverture)` seul, qui retourne null si Strapi n a pas d image
- `/projets` et `/projets/[slug]` avaient DEJA un fallback slug-based local + Strapi + logo generique
- Fix : aligner homepage sur ce pattern (commit `46f9fd0`)

### 2. Cert SSL YR2 sur takainside.org
- Vercel provisionne automatiquement un cert Let s Encrypt YR2 (nouvelle chaine 2024)
- Certains WiFi/proxy ne reconnaissent pas YR2 -> `NET::ERR_CERT_AUTHORITY_INVALID`
- Cote serveur tout est OK, cote visiteur : 4G/VPN/Firefox
- Cf `docs/RAPPORT_SSL.md` pour le detail

### 3. Persistance de session Telegram
- La session est sauvegardee dans `state.db` (SQLite) par defaut
- Un `restart` du gateway PRESERVE la session (cf "skipping session suspension" dans les logs)
- Un `/new` ou `/reset` cree une nouvelle session
- Un `Provider authentication failed` peut declencher un auto-reset selon config

### 4. Sudoers sans password pour user hermes
- Necessaire pour les operations administratives (systemctl, pkill)
- Fichier : `/etc/sudoers.d/hermes-no-password` avec permissions 0440
- Contenu : `hermes ALL=(ALL) NOPASSWD: /usr/bin/systemctl, /usr/bin/pkill, /usr/bin/kill, /usr/sbin/service`

## Procedure de creation d un nouveau profil

```bash
# 1. Creer le profil (vide ou clone)
sudo -u hermes hermes profile create <name>

# 2. Setup env (token Telegram + cles API)
sudo -u hermes bash -c "cat > /home/hermes/.hermes/profiles/<name>/.env" << 'EOF'
TELEGRAM_BOT_TOKEN=<token>
TELEGRAM_ALLOWED_USERS=<user_id>
OLLAMA_API_KEY=<key>
EOF
sudo chown hermes:hermes /home/hermes/.hermes/profiles/<name>/.env
sudo chmod 640 /home/hermes/.hermes/profiles/<name>/.env

# 3. Setup config.yaml (modele, terminal cwd, etc.)
sudo -u hermes bash -c "cat > /home/hermes/.hermes/profiles/<name>/config.yaml" << 'EOF'
model:
  default: <model-name>
  provider: <provider-name>
  base_url: <url>
EOF
chmod 640 /home/hermes/.hermes/profiles/<name>/config.yaml

# 4. Creer le service systemd
cat > /etc/systemd/system/hermes-<name>-gateway.service << 'EOF'
[Unit]
Description=Hermes Agent Gateway - Profile <name>
After=network-online.target

[Service]
Type=simple
User=root
Group=root
WorkingDirectory=/home/hermes
Environment=HERMES_HOME=/home/hermes/.hermes/profiles/<name>
ExecStart=/usr/local/bin/hermes --profile <name-lowercase> gateway run --replace
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

# 5. Activer et demarrer
sudo systemctl daemon-reload
sudo systemctl enable --now hermes-<name>-gateway.service
```

## Troubleshooting

| Probleme | Solution |
|----------|----------|
| "Provider authentication failed" | Verifier `.env` (OLLAMA_API_KEY ou autre cle manquante) |
| "Invalid pairing code" | Le user Telegram doit envoyer `/start` puis tu approuves : `hermes --profile X pairing approve telegram <CODE>` |
| "User not authorized" | Ajouter user_id a `TELEGRAM_ALLOWED_USERS` dans `.env` |
| "Gateway shutting down" repete | Process probablement kill par un autre tool (systemd restart loop ou manual kill) |
| Bot repond avec SOUL generique | `HERMES_HOME` mal set dans unit systemd, doit pointer vers profil |

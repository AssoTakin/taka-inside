# 🚀 Déploiement — Taka Inside

> **Architecture :** Vercel (frontend) + Railway (Strapi) + Supabase (PostgreSQL) + Stripe (paiements)

---

## 1. Prérequis

- Compte [Vercel](https://vercel.com) ✅ (Sam)
- Compte [Railway](https://railway.app) ✅ (Sam)
- Compte [Supabase](https://supabase.com) ✅ (Sam)
- Compte [Stripe](https://stripe.com) ✅ (Sam)
- Compte [GitHub](https://github.com) (à créer/connecter)

---

## 2. Setup Supabase (Base de données)

### 2.1 Créer un projet
1. Aller sur [supabase.com](https://supabase.com)
2. "New Project" → nommer `taka-inside-db`
3. Choisir la région la plus proche : `West Europe (Frankfurt)` ou `South Africa (Johannesburg)`
4. Mot de passe sécurisé → **noter dans un password manager**

### 2.2 Récupérer les credentials
Dans le dashboard Supabase → Settings → Database :
- `DATABASE_URL` : copier l'URL de connexion (format `postgresql://postgres:PASSWORD@HOST:6543/postgres`)
- Activer **Connection Pooler** (recommandé pour Strapi)

### 2.3 Créer le bucket Storage (pour les médias)
Supabase → Storage → New bucket :
- Nom : `taka-media`
- Public : ✅ Yes (images publiques)
- Règle CORS : autoriser `*` (ou domaine Vercel futur)

---

## 3. Setup Railway (Strapi Backend)

### 3.1 Créer le service
1. Aller sur [railway.app](https://railway.app)
2. "New Project" → "Deploy from GitHub repo"
3. Connecter le repo GitHub `sam/taka-inside`
4. Sélectionner le dossier `/backend` comme root

### 3.2 Variables d'environnement Railway
Dans Railway → Variables :

```bash
# Database (depuis Supabase)
DATABASE_CLIENT=postgres
DATABASE_URL=postgresql://postgres:PASSWORD@db.xxx.supabase.co:6543/postgres?pgbouncer=true
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false

# Strapi
APP_KEYS=clé1,clé2,clé3,clé4          # Générer : openssl rand -base64 16 (x4)
API_TOKEN_SALT=xxx                      # openssl rand -base64 16
ADMIN_JWT_SECRET=xxx                    # openssl rand -base64 16
TRANSFER_TOKEN_SALT=xxx                 # openssl rand -base64 16
JWT_SECRET=xxx                          # openssl rand -base64 16

# Supabase Storage (optionnel si on utilise Supabase au lieu de local)
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# Email (Resend)
RESEND_API_KEY=re_xxx

# Frontend (CORS)
FRONTEND_URL=https://takainside.vercel.app
```

### 3.3 Domaine Railway
Railway génère un domaine auto : `https://taka-inside-production.up.railway.app`
- Noter cette URL pour le frontend

---

## 4. Setup Vercel (Next.js Frontend)

### 4.1 Créer le projet
1. Aller sur [vercel.com](https://vercel.com)
2. "Add New Project" → importer le repo GitHub
3. Framework preset : Next.js
4. Root directory : `/frontend`

### 4.2 Variables d'environnement Vercel
Dans Vercel → Project → Settings → Environment Variables :

```bash
# API Strapi (depuis Railway)
NEXT_PUBLIC_STRAPI_API_URL=https://taka-inside-production.up.railway.app
STRAPI_API_TOKEN=xxx                    # Créer dans Strapi admin → API Tokens

# Paiements
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx

# WhatsApp
NEXT_PUBLIC_WHATSAPP_NUMBER=2290756987473

# Site
NEXT_PUBLIC_SITE_URL=https://takainside.vercel.app

# Supabase (Storage public)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

### 4.3 Domaine custom (optionnel)
Si Taka Inside a un domaine (ex: `takainside.org`) :
- Vercel → Domains → Add `takainside.org`
- Configurer DNS chez le registrar : CNAME → `cname.vercel-dns.com`

---

## 5. Stripe (Paiements)

### 5.1 Configuration
1. [Stripe Dashboard](https://dashboard.stripe.com)
2. Activer **Test mode** pour le dev
3. Récupérer les clés API → copier dans Vercel env vars

### 5.2 Webhooks Stripe
Stripe → Developers → Webhooks → Add endpoint :
- URL : `https://takainside.vercel.app/api/stripe/webhook`
- Events à écouter :
  - `checkout.session.completed`
  - `payment_intent.succeeded`
  - `invoice.payment_failed`

### 5.3 Produits Stripe
Stripe → Products → Create :
- "Don 5000 FCFA" → Price : 5000 XOF
- "Don 10000 FCFA" → Price : 10000 XOF
- "Album Gbévi" → Price : 3500 XOF
- etc.

---

## 6. PayPal (Optionnel)

1. [PayPal Developer](https://developer.paypal.com)
2. Créer une app → récupérer `Client ID` et `Secret`
3. Ajouter à Vercel env vars :
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=xxx
   PAYPAL_SECRET=xxx
   ```

---

## 7. FedaPay (Mobile Money Bénin)

1. [FedaPay Dashboard](https://fedapay.com)
2. Récupérer clé API
3. Ajouter à Vercel :
   ```
   FEDAPAY_SECRET_KEY=xxx
   FEDAPAY_PUBLIC_KEY=xxx
   ```

---

## 8. CI/CD (Automatique)

### 8.1 GitHub Actions
Les fichiers `.github/workflows/` dans le repo déclenchent :
- **Push sur `main`** → Vercel auto-deploy + Railway auto-deploy
- **Pull Request** → Preview deploy Vercel + tests

### 8.2 Fichiers de workflow

#### `frontend-ci.yml` (déjà créé dans `.github/workflows/`)
#### `backend-ci.yml` (déjà créé dans `.github/workflows/`)

---

## 9. Vérification Post-Déploiement

### Checklist

- [ ] Frontend Vercel accessible → `https://takainside.vercel.app`
- [ ] Backend Strapi accessible → `https://taka-inside-production.up.railway.app/admin`
- [ ] API Strapi répond → `/api/projets` retourne JSON
- [ ] Base de données connectée → Strapi admin fonctionne
- [ ] Images uploadables → Supabase Storage accessible
- [ ] Stripe checkout fonctionne → test payment en mode test
- [ ] Emails envoyés → Resend API OK
- [ ] WhatsApp button → lien correct `wa.me/2290756987473`

---

## 10. Commandes Utiles

```bash
# Démarrer dev local
docker-compose up

# Démarrer Strapi seul
cd backend && npm run develop

# Démarrer Next.js seul
cd frontend && npm run dev

# Créer un admin Strapi
cd backend && npx strapi admin:create-user

# Générer des clés sécurisées
openssl rand -base64 16

# Export schema Strapi (backup)
cd backend && npx strapi export --file backup
```

---

*Déploiement v1.0 — Prêt pour la mise en production*

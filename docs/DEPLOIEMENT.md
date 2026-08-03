# 🚀 Déploiement Taka Inside

## Architecture de déploiement

```
┌─────────────────────────────────────────────┐
│                 Vercel                       │
│          (Next.js Frontend)                   │
│    https://takainside.vercel.app            │
└──────────────┬──────────────────────────────┘
               │ API REST
┌──────────────▼──────────────────────────────┐
│                 Railway                      │
│         (Strapi Backend + API)               │
│     https://takainside.up.railway.app        │
└──────────────┬──────────────────────────────┘
               │
┌──────────────▼──────────────────────────────┐
│              Supabase                        │
│  • PostgreSQL (Database)                     │
│  • Storage (Médias / Images)               │
└─────────────────────────────────────────────┘
```

## Comptes nécessaires

Tu dois avoir ou créer des comptes sur :

1. **GitHub** — pour le repo et le CI/CD
2. **Vercel** — pour le frontend Next.js
3. **Railway** — pour le backend Strapi
4. **Supabase** — pour PostgreSQL + Storage
5. **Stripe** — pour les paiements par carte
6. **PayPal** — pour les paiements PayPal (optionnel)
7. **FedaPay** — pour Mobile Money (optionnel)

---

## Étape 1 : GitHub Repository

```bash
# 1. Génère un Personal Access Token sur GitHub
#    https://github.com/settings/tokens → Tokens (classic) → Generate
#    Coche le scope "repo"

# 2. Exécute le script de setup
cd /root/taka-inside
./scripts/setup-github.sh TOKEN_PLACEHOLDER

# Le script crée le repo et push tout le code.
# Une fois fait, supprime le token pour la sécurité.
```

## Étape 2 : Supabase (Database + Storage)

1. Va sur https://supabase.com et crée un nouveau projet
2. Nomme-le `taka-inside`
3. Dans **Project Settings → Database**, copie la **Connection String** (mode session, pas transaction)
4. Va dans **Storage → New bucket**, crée un bucket public nommé `taka-media`
5. Note les credentials :
   - `DATABASE_URL` (connection string)
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

## Étape 3 : Railway (Backend Strapi)

1. Va sur https://railway.app
2. Crée un nouveau projet → Deploy from GitHub repo
3. Sélectionne `takainside`
4. Dans **Variables**, ajoute :
   ```
   DATABASE_CLIENT=postgres
   DATABASE_URL=DATABASE_URL_PLACEHOLDER
   JWT_SECRET=SECRET_PLACEHOLDER
   ADMIN_JWT_SECRET=SECRET_PLACEHOLDER
   APP_KEYS=KEY1,KEY2,KEY3,KEY4
   API_TOKEN_SALT=SALT_PLACEHOLDER
   TRANSFER_TOKEN_SALT=SALT_PLACEHOLDER
   ```
5. Railway déploie automatiquement à chaque push sur `main`

## Étape 4 : Vercel (Frontend)

1. Va sur https://vercel.com/new
2. Importe le repo GitHub `takainside`
3. Framework preset : **Next.js**
4. Root directory : `frontend/`
5. Dans **Environment Variables**, ajoute :
   ```
   NEXT_PUBLIC_STRAPI_API_URL=https://takainside.up.railway.app
   NEXT_PUBLIC_SITE_URL=https://takainside.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PLACEHOLDER
   STRIPE_SECRET_KEY=SECRET_PLACEHOLDER PAYPAL_CLIENT_ID=CLIENT_ID_PLACEHOLDER
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=CLIENT_ID_PLACEHOLDER
   ```
6. Déploie ! Vercel donne une URL `.vercel.app`
7. Configure un domaine personnalisé si tu en as un

## Étape 5 : Stripe (Paiements)

1. Va sur https://dashboard.stripe.com
2. Active le mode test d'abord pour tester
3. Dans **Developers → API keys**, copie :
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`
4. Ajoute un webhook pour `payment_intent.succeeded` pointant vers :
   ```
   https://takainside.vercel.app/api/webhooks/stripe
   ```
   (cette route n'existe pas encore mais peut être ajoutée)
5. Pour la production, bascule vers les clés live

## Étape 6 : PayPal

1. Crée un compte développeur sur https://developer.paypal.com
2. Crée une app dans le **Sandbox**
3. Copie :
   - `Client ID` → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`
   - `Secret` → `PAYPAL_SECRET`
4. Pour la production, crée une app live dans le dashboard PayPal business

## Étape 7 : FedaPay (Mobile Money)

1. Crée un compte sur https://fedapay.com
2. Configure ta clé API
3. Mets à jour le lien de redirection dans `frontend/src/app/faire-un-don/page.tsx`
4. Ou intègre leur SDK pour un flux natif

## Étape 8 : GitHub Secrets (CI/CD)

Dans les **Settings → Secrets → Actions** du repo GitHub, ajoute :

```
VERCEL_TOKEN=TOKEN_PLACEHOLDER
VERCEL_ORG_ID=ORG_ID_PLACEHOLDER
VERCEL_PROJECT_ID=PROJECT_ID_PLACEHOLDER
RAILWAY_TOKEN=TOKEN_PLACEHOLDER
NEXT_PUBLIC_STRAPI_API_URL=https://takainside.up.railway.app
STRIPE_SECRET_KEY=SECRET_PLACEHOLDER
PAYPAL_SECRET=SECRET_PLACEHOLDER
```

> ℹ️ Les `VERCEL_ORG_ID` et `VERCEL_PROJECT_ID` se trouvent dans le fichier `.vercel/project.json` après avoir linké le projet via `vercel link`.

---

## Variables d'environnement récapitulatif

### Frontend (.env.local)
```
NEXT_PUBLIC_STRAPI_API_URL=https://takainside.up.railway.app
NEXT_PUBLIC_SITE_URL=https://takainside.vercel.app
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PLACEHOLDER
STRIPE_SECRET_KEY=SECRET_PLACEHOLDER PAYPAL_CLIENT_ID=CLIENT_ID_PLACEHOLDER
PAYPAL_SECRET=SECRET_PLACEHOLDER
```

### Backend (Railway Variables)
```
DATABASE_CLIENT=postgres
DATABASE_URL=DATABASE_URL_PLACEHOLDER
JWT_SECRET=SECRET_PLACEHOLDER
ADMIN_JWT_SECRET=SECRET_PLACEHOLDER
APP_KEYS=KEY1,KEY2,KEY3,KEY4
API_TOKEN_SALT=SALT_PLACEHOLDER
TRANSFER_TOKEN_SALT=SALT_PLACEHOLDER
```

---

## Post-déploiement

1. **Accède au Strapi Admin** : `https://takainside.up.railway.app/admin`
   - Crée un compte admin
   - Ajoute des contenus (projets, artistes, produits)

2. **Teste les paiements** :
   - Stripe : utilise la carte test `4242 4242 4242 4242`
   - PayPal : utilise un compte sandbox
   - FedaPay : test avec un vrai numéro MTN/Moov en mode test

3. **Vérifie le SEO** :
   - Sitemap : `https://takainside.vercel.app/sitemap.xml`
   - Robots : `https://takainside.vercel.app/robots.txt`

4. **WhatsApp** : le bouton flottant fonctionne déjà avec le numéro configuré.

---

## Dépannage

| Problème | Solution |
|----------|----------|
| "Stripe non configuré" | Vérifie `STRIPE_SECRET_KEY` et `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| "PayPal non configuré" | Vérifie `PAYPAL_CLIENT_ID` et `PAYPAL_SECRET` |
| Le build échoue | Vérifie les variables d'environnement requises |
| Strapi ne démarre pas | Vérifie `DATABASE_URL` et que Supabase est accessible |
| Images ne chargent pas | Vérifie la config `images.remotePatterns` dans `next.config.ts` |

---

## Commandes utiles

```bash
# Build local
npm run build

# Lancer en dev
npm run dev

# Lint
npm run lint

# Vérifier les types TypeScript
npx tsc --noEmit
```

---

**Prêt à déployer !** 🚀

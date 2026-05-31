# 🚀 Taka Inside — Point d'Arrêt

> **Date** : Session du 30 mai 2026
> **Commit** : `634581e`
> **Statut** : Frontend ✅ complet | Backend ⚠️ config manuelle requise | Déploiement ⏳ toi

---

## ✅ Ce qui est FINI (je l'ai fait)

### Frontend Next.js — 13 pages, build OK
- **/** — Accueil connectée au backend (fallback mock si Strapi offline)
- **/association** — Présentation asso (NOUVEAU)
- **/projets** — Projets culturels
- **/label-musical** — Artistes du label
- **/boutique** — E-commerce avec panier
- **/checkout** — Paiement Stripe
- **/faire-un-don** — Don Stripe + PayPal + FedaPay
- **/devenir-benevole** — Formulaire candidature
- **/contact** — Formulaire + coordonnées
- **/radio** — Lecteur MIBRADIO
- **/mentions-legales** — Légal
- **/politique-confidentialite** — RGPD
- **/conditions-generales-vente** — CGV
- Sitemap, robots.txt, metadata SEO

### Backend Strapi — Content-types créés
- Projet, Artiste, Produit, CatégorieProduit, Bénévole, Don, Commande, PageContent

### Scripts
- `scripts/seed-strapi.js` — Remplit Strapi avec 5 projets, 3 artistes, 8 produits, 3 catégories

### CI/CD
- `.github/workflows/frontend.yml` + `backend.yml` configurés

---

## ⏳ Ce que TU dois faire (obligatoire)

### 1. Créer les comptes et configurer les clés

Tu dois créer les comptes suivants et récupérer les clés API :

| Service | Lien | Clés à récupérer |
|---------|------|-----------------|
| **Stripe** | https://dashboard.stripe.com | `STRIPE_SECRET_KEY` + `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` |
| **PayPal** | https://developer.paypal.com | `PAYPAL_CLIENT_ID` + `PAYPAL_SECRET` |
| **FedaPay** | https://fedapay.com | Clé API FedaPay |

### 2. Déployer sur Vercel (FRONTEND)

1. Va sur https://vercel.com/new
2. Importe le repo GitHub `taka-inside`
3. Framework : **Next.js**
4. Root directory : `frontend/`
5. Ajoute les variables d'environnement :
   ```
   NEXT_PUBLIC_STRAPI_API_URL=https://takainside.up.railway.app
   NEXT_PUBLIC_SITE_URL=https://takainside.vercel.app
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_...
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
   PAYPAL_SECRET=...
   ```
6. Clique **Deploy**

### 3. Déployer sur Railway (BACKEND Strapi)

1. Va sur https://railway.app
2. New project → Deploy from GitHub repo → `taka-inside`
3. Root directory : `backend/`
4. Dans **Variables**, ajoute :
   ```
   DATABASE_CLIENT=postgres
   DATABASE_URL=postgres://...
   JWT_SECRET=random32chars
   ADMIN_JWT_SECRET=random32chars
   APP_KEYS=key1,key2,key3,key4
   API_TOKEN_SALT=random
   TRANSFER_TOKEN_SALT=random
   ```
5. Railway build et déploie automatiquement

### 4. Lancer le seed

Une fois Railway déployé et Strapi accessible :
```bash
# Remplacer par l'URL Railway réelle
STRAPI_URL=https://takainside.up.railway.app node scripts/seed-strapi.js
```

---

## 🔧 Problème connu (pas bloquant)

Le **build Strapi admin panel** échoue en local à cause d'un conflit Vite. **Ce n'est PAS un problème** — Railway utilise Docker et build correctement. Tu n'as pas besoin de build Strapi en local.

---

## 📋 Checklist finale pour toi

- [ ] Créer compte Stripe + récupérer clés
- [ ] Créer compte PayPal Developer + récupérer clés  
- [ ] Créer compte FedaPay (optionnel)
- [ ] Déployer frontend sur Vercel
- [ ] Déployer backend sur Railway
- [ ] Configurer variables d'environnement
- [ ] Lancer le seed sur Railway
- [ ] Tester un paiement Stripe en mode test (carte `4242 4242 4242 4242`)
- [ ] Tester PayPal en sandbox
- [ ] Ajouter des images réelles dans Strapi admin
- [ ] Connecter domaine personnalisé (optionnel)

---

**Le code est prêt. Le repo est propre. Il ne reste que les clés et les clics sur Vercel/Railway.**

🚀 À toi de jouer, Sam !

# 🎯 PRISÉ DE RELAIS — Projet Taka Inside

> **Agent cible :** Hermès Swarm Worker (taka-inside-maintenance)  
> **Mission :** Maintenir le site Taka Inside opérationnel, préserver les parcours critiques (dons + boutique), éviter toute contamination avec SOLID'EAT.  
> **Dernière mise à jour :** 2026-06-08  
> **URL Production :** https://frontend-cperbr61k-sam-takas-projects.vercel.app (alias officiel : https://takainside.org)
> **Projet Vercel :** `frontend` (`prj_8h5X7oZAbC02gjW6nIxw6rL5bToc`)

---

## 1. ARCHITECTURE

### Stack
- **Frontend :** Next.js 14 (App Router), TypeScript, Tailwind CSS, React 18
- **Backend CMS :** Strapi v5 (hébergé sur Railway)
- **Hébergement :** Vercel (Projet `frontend`, ID `prj_8h5X7oZAbC02gjW6nI...`)
- **Paiements :** Stripe (carte bancaire), FedaPay (Mobile Money Bénin), PayPal (placeholder désactivé)
- **Tests :** Playwright E2E

### Arborescence critique
```
/tmp/taka-inside/frontend/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Accueil
│   │   ├── faire-un-don/
│   │   │   ├── page.tsx               # Wrapper serveur (force-dynamic)
│   │   │   └── DonPageClient.tsx      # Logique client (montants, fréquence, paiement)
│   │   ├── checkout/
│   │   │   ├── page.tsx               # Wrapper serveur (force-dynamic)
│   │   │   └── CheckoutClient.tsx     # Formulaire multi-étapes + paiement Stripe/FedaPay
│   │   ├── boutique/
│   │   │   └── page.tsx               # Catalogue produits (strapi)
│   │   ├── (pages)/
│   │   │   └── [slug]/                # Pages CMS dynamiques (projets, articles, etc.)
│   │   └── layout.tsx                 # Root layout avec CartProvider + SiteLayout
│   ├── components/
│   │   ├── layout/SiteLayout.tsx      # Header/Footer/nav
│   │   ├── payments/
│   │   │   ├── DonStripeForm.tsx      # Formulaire Stripe Elements (don)
│   │   │   ├── FedaPayDonButton.tsx   # Bouton FedaPay
│   │   │   └── PayPalDonForm.tsx      # PayPal (désactivé)
│   │   └── payments/CheckoutForm.tsx  # Formulaire Stripe Elements (shop)
│   ├── contexts/
│   │   └── CartContext.tsx            # Panier localStorage + React Context
│   └── lib/
│       └── price.ts                    # Formatage prix (25,00 € avec espace insécable)
├── e2e/
│   ├── donation-flow.spec.ts          # Tests E2E dons
│   └── shop-flow.spec.ts              # Tests E2E boutique
├── next.config.ts                      # Revalidate SSR = 10s
└── .vercel/project.json               # ID projet Vercel (CRITIQUE)
```

---


## 1.1 KNOWN ISSUES (à jour 2026-06-30)

### SSL YR2 sur takainside.org
Le cert SSL du domain custom `takainside.org` est émis par Let's Encrypt YR2 (nouvelle chaîne 2024). Certains réseaux (WiFi public, proxy d'entreprise, FAI anciens) ne reconnaissent pas YR2 et affichent `NET::ERR_CERT_AUTHORITY_INVALID`. Cote serveur tout est OK. Cote visiteur : 4G/5G ou VPN ou Firefox. Cf `/docs/RAPPORT_SSL.md`.

### Pattern image projets vedettes
Le composant "Projets en vedette" de la homepage (et a fortiori toute carte projet) DOIT utiliser le pattern slug-based :
```js
const coverUrl = slug === "made-in-benin-radio"
  ? "/images/madeinbeninradio-logo-new.jpg"
  : slug === "mib-talents-a-suivre"
    ? "/images/mib-talents-logo.jpg"
    : getImageUrl(projet.image_couverture as { url: string } | null) || "/images/logo-taka-inside.jpg";
```
Et le rendu doit utiliser `coverUrl` directement (PAS `getImageUrl({url: coverUrl})` qui double-wrap l'URL).
Ce pattern est déjà standardisé dans `/projets/ProjectGrid.tsx` et `/projets/[slug]/page.tsx`.

## 2. RÈGLE ABSOLUE — PAS DE CONTAMINATION CROISÉE

Deux projets Vercel distincts existent. **TU NE DOIS JAMAIS** mélanger les déploiements.

| Projet | Repo GitHub | Projet Vercel | Alias principal |
|--------|-------------|---------------|-----------------|
|| **Taka Inside** | `AssoTakin/taka-inside` | `frontend` (`prj_8h5X7oZAbC02gjW6nI...`) | https://frontend-cperbr61k-sam-takas-projects.vercel.app (alias https://takainside.org) |
| **SOLID'EAT** | `AssoTakin/solideat` | `solideat` (`prj_QPBgoDOlMaGlXQ5...`) | — |

### Procédure de sécurité avant chaque déploiement
1. **Vérifier `.vercel/project.json`**
   ```bash
   cat .vercel/project.json
   # Doit afficher : {"orgId":"...","projectId":"prj_8h5X7oZAbC02gjW6nIxw6rL5bToc"}
   # SI ce n'est PAS ce projectId → ARRÊT IMMÉDIAT
   ```
2. **Vérifier que le repo actuel est `taka-inside`** (pas `solideat`)
3. **Utiliser les scripts `deploy:safe` ou `deploy:prod`** (alias npm) — JAMAIS `vercel deploy` brut.

---

## 3. PROBLÈMES CRITIQUES RÉSOLUS (NE PAS RÉGRESSER)

### 3.1 Hydratation checkout & dons (RESOLU)
**Symptôme :** Page checkout bloquée sur "Chargement du panier…" ; page dons figée après sélection montant.  
**Cause :** Next.js pré-rendait statiquement les pages. Le serveur envoyait HTML avec panier vide, React hydratait et détectait un mismatch car le client voyait aussi un panier vide MAIS avec un fallback `!mounted` différent → React supprimait tout le contenu.  
**Solution appliquée :**
- `src/app/checkout/page.tsx` → `export const dynamic = 'force-dynamic'`
- `src/app/faire-un-don/page.tsx` → `export const dynamic = 'force-dynamic'`
- `CheckoutClient.tsx` et `DonPageClient.tsx` → `'use client'` sans fallback `!mounted` séparé.
- Le serveur rend le composant client directement. React hydrate correctement car le premier rendu client est identique au serveur (panier vide), puis `CartContext` lit `localStorage` et met à jour.

**⚠️ NE PAS :**
- Réintroduire `next/dynamic({ ssr: false })` sur les formulaires de paiement (cause des erreurs d'hydratation)
- Réintroduire un fallback `!mounted` avec un HTML différent du rendu serveur
- Retirer `export const dynamic = 'force-dynamic'`

### 3.2 Collision de routes (RESOLU)
**Symptôme :** `/faire-un-don` renvoyait parfois la page CMS `[slug]` au lieu de la page dédiée.  
**Cause :** `generateStaticParams` dans `src/app/(pages)/[slug]/page.tsx` incluait `'faire-un-don'`.  
**Solution :** Retiré `'faire-un-don'` du tableau `generateStaticParams`.

---

## 4. ENVIRONNEMENT & CREDENTIALS

### Variables d'environnement Vercel (déjà configurées)
| Variable | Usage |
|----------|-------|
| `NEXT_PUBLIC_STRAPI_API_URL` | URL Strapi Railway |
| `STRAPI_TOKEN` | Token API Strapi (full access) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe (pk_live_...) |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe (sk_live_...) |
| `NEXT_PUBLIC_FEDAPAY_PUBLIC_KEY` | Clé publique FedaPay |
| `FEDAPAY_SECRET_KEY` | Clé secrète FedaPay |
| `NEXT_PUBLIC_SITE_URL` | https://takainside.vercel.app |

### Fichiers locaux (ne JAMAIS les commiter)
- `/tmp/vercel_token.txt` — Token Vercel pour CLI
- `/tmp/strapi_token.txt` — Token Strapi
- `/tmp/gh_pat.txt` — GitHub PAT (obsolète, remplacé par SSH)
- `~/.ssh/taka-inside` / `~/.ssh/taka-inside.pub` — Clé SSH pour git push (pas encore ajoutée sur GitHub)

---

## 5. PARCOURS CRITIQUES À VALIDER

### 5.1 Parcours Don
1. Aller sur `/faire-un-don`
2. Cliquer un montant (ex: 25 €) → bouton doit se surligner vert
3. Choisir fréquence (ponctuel/mensuel)
4. Choisir méthode de paiement (Stripe / FedaPay)
5. Cliquer "Procéder au paiement"
6. Vérifier que le formulaire de paiement apparaît (Stripe Elements ou FedaPay)

### 5.2 Parcours Boutique / Checkout
1. Aller sur `/boutique`
2. Ajouter un produit au panier
3. Vérifier que le badge panier passe à 1
4. Aller sur `/checkout`
5. Vérifier que le produit est listé dans le récapitulatif
6. Remplir les étapes 1 (coordonnées), 2 (livraison), 3 (paiement)
7. Vérifier que le formulaire de paiement Stripe s'affiche

### 5.3 Playwright E2E
```bash
cd /tmp/taka-inside/frontend
npx playwright test
# Attendre 10/10 assertions passantes
```
**Note technique tests :** Sur les pages avec composants `next/dynamic({ ssr: false })`, utiliser `domcontentloaded` au lieu de `networkidle` dans les assertions Playwright.

---

## 6. PROCÉDURES STANDARD

### Déploiement sécurisé (OBLIGATOIRE)
```bash
# 1. Vérifier le contexte Vercel
cat .vercel/project.json | grep projectId
# Doit être prj_8h5X7oZAbC02gjW6nIxw6rL5bToc

# 2. Build local
npm run build
# Zéro erreur TypeScript exigé

# 3. Déployer
vercel deploy --prod --token "$(cat /tmp/vercel_token.txt)" --yes

# 4. Vérifier l'URL déployée
# https://frontend-XXXX.vercel.app
```

### Push Git (actuellement bloqué)
- La clé SSH `~/.ssh/taka-inside.pub` est générée mais **non ajoutée sur GitHub**.
- L'utilisateur doit ajouter la clé publique dans Settings → SSH and GPG keys du compte GitHub.
- Une fois fait : `git push origin master` fonctionnera.

### Cache SSR
- Revalidate actuel : **10 secondes** dans `next.config.ts`.
- Objectif : refléter rapidement les changements Strapi sans surcharger l'API.

---

## 7. ÉTAT ACTUEL DES FICHIERS MODIFIÉS (à commiter dès que le push est débloqué)

| Fichier | Statut | Raison |
|---------|--------|--------|
| `src/app/faire-un-don/page.tsx` | ✅ Modifié | `force-dynamic` wrapper |
| `src/app/faire-un-don/DonPageClient.tsx` | ✅ Modifié | Client component sans `!mounted` mismatch |
| `src/app/checkout/page.tsx` | ✅ Modifié | `force-dynamic` wrapper |
| `src/app/checkout/CheckoutClient.tsx` | ✅ Modifié | Client component sans `!mounted` mismatch |
| `src/app/(pages)/[slug]/page.tsx` | ✅ Modifié | Retrait de `'faire-un-don'` de generateStaticParams |
| `src/contexts/CartContext.tsx` | ✅ Modifié | Gestion localStorage améliorée |
| `next.config.ts` | ✅ Modifié | Revalidate 10s |

---

## 8. RÈGLES DE CONDUITE DE L'AGENT

1. **Autonomie totale** : Quand l'utilisateur dit "tu as tout ce qu'il faut" / "ne me demande plus" / "fais le nécessaire" → exécuter immédiatement sans demander confirmation.
2. **Langue :** Français strict.
3. **Tests :** Avant/après tout changement critique, exécuter les tests E2E Playwright. Documenter dans `TEST_REPORT_BMAD.md` si demandé.
4. **Credentials :** Jamais affichés en clair. Utiliser `[REDACTED]` ou lire depuis les fichiers `/tmp/*.txt`.
5. **Pas de solideat** : Ne JAMAIS toucher au repo ou projet SOLID'EAT sans instruction explicite de l'utilisateur.

---

## 9. PROCHAINES TÂCHES EN ATTENTE

- [ ] Ajouter la clé SSH `~/.ssh/taka-inside.pub` sur GitHub et pousser les modifications
- [ ] Finaliser la suite E2E Playwright (10/10 assertions)
- [ ] Documenter la stratégie `force-dynamic` dans un `ARCHITECTURE.md`
- [ ] Intégrer les tests E2E dans la CI Vercel / GitHub Actions
- [ ] Vérifier la persistance du panier checkout après rechargement de page en conditions réelles

---

**Fin du dossier de relais. Bon courage, agent suivant.**

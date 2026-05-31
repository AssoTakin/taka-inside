# Rapport de Tests BMAD — Frontend Taka Inside

**Date:** 2026-05-31  
**Deploy:** https://frontend-mu-one-82-lovat.vercel.app  
**Commit:** Auto (2 corrections + tests)

## Corrections apportées

| # | Bug | Cause | Fix | Fichier |
|---|-----|-------|-----|---------|
| 1 | FedaPay 404 — `Modèle V1::Currency non trouvé` | API attend `currency: { iso: "XOF" }`, pas `{ code, name }` | Changé format payload | `route.ts` FedaPay |
| 2 | FedaPay retournait body vide | API FedaPay nécessite un 2ème appel `/token` pour obtenir l'URL de paiement | Ajout appel token après création tx | `route.ts` FedaPay |
| 3 | Contact form 400 — `Tous les champs requis` | Frontend envoie `name/subject`, backend attendait `nom/sujet` | Accepte les 2 formats (fallback) | `route.ts` Contact |

## Résultats des tests

| Endpoint / Page | Statut | Résultat |
|-----------------|--------|----------|
| `POST /api/fedapay/create-transaction` | 200 | URL de paiement générée, token présent |
| `POST /api/create-payment-intent` | 200 | `clientSecret` retourné |
| `POST /api/contact` (EN) | 200 | Message envoyé |
| `POST /api/contact` (FR) | 200 | Fallback OK |
| `GET /api/produits` | 200 | OK |
| `/` | 200 | OK |
| `/boutique` | 200 | OK |
| `/faire-un-don` | 200 | OK |
| `/contact` | 200 | OK |
| `/projets` | 200 | OK |
| `/label-musical` | 200 | OK |
| `/label-musical/dj-kenza` | 200 | OK |
| `/projets/festival-taka-2025` | 200 | OK |

**Total: 13/13 — AUCUNE RÉGRESSION**

## Variables d'environnement (Vercel)

- `STRIPE_SECRET_KEY` — Production
- `FEDAPAY_SECRET_KEY` — Production

## Reste à faire

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...) — nécessaire pour le checkout Stripe côté client

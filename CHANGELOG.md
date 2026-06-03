# CHANGELOG

Toutes les modifications notables du projet Taka Inside seront documentées ici.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/spec/v2.0.0.html).

## [Unreleased]

### Added
- `feat(devise)` : Conversion universelle FCFA → EUR via helper `formatPrice()` (taux 655.957)
- `feat(devise)` : API Stripe reçoit montants bruts FCFA, convertit en centimes EUR (`toEURCents`)
- `feat(r2)` : Streaming direct depuis Cloudflare R2 pour téléchargement albums (`/api/telecharger/[token]`)
- `feat(r2)` : Variables d'environnement R2 configurées sur Vercel (production/preview/development)
- `feat(boutique)` : Fiche produit SSG (`/boutique/[slug]`) avec image, description, badge "ALBUM DIGITAL"
- `feat(boutique)` : Liens "En savoir plus →" sur cartes produits vers fiche détaillée
- `feat(boutique)` : Fallback image KIKOKO hébergé localement (`public/images/kikoko-cover.jpg`)
- `feat(boutique)` : Résolution URLs image absolues côté serveur (`/api/produits`)
- `docs` : `STATUS.md` mis à jour avec état complet infrastructure + système de devise
- Tests Jest + React Testing Library pour le fetcher API Strapi
- Tests E2E Playwright (9 scénarios de navigation)
- Configuration CI/CD GitHub Actions supportant `master`, `main`, `develop`
- Fichier `CHANGELOG.md` pour le versionning

### Changed
- `frontend/src/lib/price.ts` : nouveau helper `formatPrice()` avec heuristique FCFA→EUR
- `frontend/src/components/ui/CartDrawer.tsx` : total en EUR via `formatPrice()`
- `frontend/src/app/checkout/page.tsx` : récapitulatifs et bouton paiement en EUR
- `frontend/src/app/commande/[commandeId]/page.tsx` : total et livraison en EUR
- `frontend/src/app/faire-un-don/page.tsx` : montants dons en EUR
- `frontend/src/app/page.tsx` : badges dons accueil en EUR
- `frontend/src/app/conditions-generales-vente/page.tsx` : texte légal "prix en EUR"
- `frontend/src/components/payments/DonStripeForm.tsx` : bouton don en EUR
- `frontend/src/components/payments/PayPalDonForm.tsx` : confirmation don en EUR
- `frontend/src/components/payments/FedaPayDonButton.tsx` : description don en EUR
- `.github/workflows/backend.yml` : trigger sur `master`, `main`, `develop`
- `.github/workflows/frontend.yml` : trigger sur `master`, `main`, `develop`
- `frontend/package.json` : ajout des scripts `test`, `test:watch`, `test:coverage`, `test:e2e`
- `.gitignore` : exclusion des résultats Playwright

### Fixed
- `fix(devise)` : Panier, checkout, commande, dons affichaient FCFA au lieu d'EUR
- `fix(devise)` : Stripe API créait des payment intents en XOF au lieu d'EUR
- `fix(image)` : Images produits retournaient 404 (URLs relatives Strapi sur filesystem éphémère Railway)
- `fix(image)` : Image KIKOKO ne s'affichait pas (bucket R2 privé, 401 sur URLs publiques)
- CI/CD ne se déclenchait jamais car workflows surveillaient uniquement `main`/`develop`, pas `master`

## [0.2.0] - 2026-05-31

### Added
- `feat(tests)` : Jest + Playwright
- `feat(tests)` : Tests unitaires `lib/api.ts`
- `feat(tests)` : 9 scénarios E2E navigation
- `docs` : `STATUS.md` infrastructure réelle

### Fixed
- `fix(ci)` : Workflows CI/CD supportent `master`/`main`/`develop`

## [0.1.1] - 2026-05-30

### Fixed
- `fix(homepage)` : cohérence couleurs CTA et hover
- `fix(homepage)` : couleur CTA En savoir plus en noir comme catalogue
- `fix(homepage)` : CTA Soutenir/Bénévolat sur cartes Projets en vedette

## [0.1.0] - 2026-05-30

### Added
- Next.js 16.2.6 + Tailwind CSS v4
- Strapi v5.47.0 backend
- 17 pages frontend + 6 routes API
- 9 content-types Strapi
- Intégrations Stripe, PayPal, FedaPay
- Seed script pour données initiales

[Unreleased]: https://github.com/AssoTakin/taka-inside/compare/v0.2.0...master
[0.2.0]: https://github.com/AssoTakin/taka-inside/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/AssoTakin/taka-inside/compare/v0.1.0...v0.1.1

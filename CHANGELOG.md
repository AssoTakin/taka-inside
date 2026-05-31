# CHANGELOG

Toutes les modifications notables du projet Taka Inside seront documentées ici.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère à [Semantic Versioning](https://semver.org/lang/fr/spec/v2.0.0.html).

## [Unreleased]

### Added
- Tests Jest + React Testing Library pour le fetcher API Strapi
- Tests E2E Playwright (9 scénarios de navigation)
- Configuration CI/CD GitHub Actions supportant `master`, `main`, `develop`
- Documentation `STATUS.md` avec état complet de l'infrastructure
- Fichier `CHANGELOG.md` pour le versionning

### Changed
- `.github/workflows/backend.yml` : trigger sur `master`, `main`, `develop`
- `.github/workflows/frontend.yml` : trigger sur `master`, `main`, `develop`
- `frontend/package.json` : ajout des scripts `test`, `test:watch`, `test:coverage`, `test:e2e`
- `.gitignore` : exclusion des résultats Playwright

### Fixed
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

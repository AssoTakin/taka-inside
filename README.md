# Taka Inside - Développement Local

Stack : Next.js 14 + Strapi v5 + PostgreSQL 15

## Démarrage rapide

```bash
./scripts/setup-dev.sh
```

Ce script vérifie Docker et Node 20, crée le `.env` et lance le stack.

## Services

| Service      | Port local | Description           |
|--------------|------------|-----------------------|
| Frontend     | 3000       | Next.js (hot reload)  |
| Backend      | 1337       | Strapi v5             |
| PostgreSQL   | 5432       | Base de données       |
| pgAdmin      | 5050       | Administration PG     |

## Commandes utiles

```bash
docker compose up -d --build    # (re)construire et lancer
docker compose logs -f backend  # suivre les logs Strapi
docker compose down             # arrêter
docker compose down -v          # arrêter + supprimer volumes
```

## Variables d'environnement

Copier `.env.example` en `.env` et adapter les secrets Strapi.

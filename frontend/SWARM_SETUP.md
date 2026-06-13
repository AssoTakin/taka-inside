# 🚀 INSTRUCTIONS DE CREATION DU SWARM WORKER

## Objectif
Créer un agent Hermès autonome (cron job ou skill) qui maintient le site Taka Inside en continu.

## Prérequis sur la machine hôte
1. Le repo est cloné dans `/tmp/taka-inside/frontend`
2. Les tokens sont stockés dans :
   - `/tmp/vercel_token.txt`
   - `/tmp/strapi_token.txt`
3. Node.js et npm sont disponibles
4. `vercel` CLI est installé globalement (`npm i -g vercel`)
5. `playwright` est installé dans le projet (`npm install` déjà fait)

## Skill recommandé
Créer un skill nommé `taka-inside-maintenance` dans `~/.hermes/skills/taka-inside-maintenance/SKILL.md`.

Contenu du skill à copier depuis `AGENTS.md` + ajouter :
- Les commandes exactes de build/deploy
- Les patterns de test Playwright
- Les checks de santé (curl sur les URLs critiques)

## Option A : Cron Job de surveillance (watchdog)
```yaml
# À configurer via hermes cronjob create
schedule: "every 6h"
prompt: |
  Tu es le maintainer du site Taka Inside.
  1. Vérifie que les pages /faire-un-don et /checkout chargent correctement
  2. Si "Chargement du panier…" persiste > 5s → c'est une régression, corrige
  3. Exécute npx playwright test
  4. Déploie si les tests passent
  5. Rapporte l'état
workdir: /tmp/taka-inside/frontend
```

## Option B : Webhook-triggered agent (déploiement sur push)
Configurer un webhook Vercel qui notifie l'agent sur chaque déploiement pour exécuter les tests.

## Option C : Kanban worker
Ajouter une colonne "Maintenance Taka Inside" dans le workspace Hermes Kanban avec des tickets automatiques.

---

## Vérification immédiate à faire par le nouvel agent
1. `cd /tmp/taka-inside/frontend && cat .vercel/project.json | grep projectId`
2. `npm run build` (doit passer 0 erreur)
3. `npx playwright test` (doit passer 10/10)
4. `curl -s https://frontend-6qawzrc4n-sam-takas-projects.vercel.app/faire-un-don | grep -o "Procéder au paiement"`
5. `curl -s https://frontend-6qawzrc4n-sam-takas-projects.vercel.app/checkout | grep -o "Votre panier est vide"`

Si l'une de ces étapes échoue → intervention immédiate requise.

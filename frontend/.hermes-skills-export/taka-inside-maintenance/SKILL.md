---
name: taka-inside-maintenance
description: Maintenance autonome du site Taka Inside — healthcheck, diagnostique, réparation, déploiement
category: devops
goal: |
  Maintenir le site Taka Inside en production opérationnel 24/7.
  Dès qu'une anomalie est détectée (page inaccessible, bouton inactif, panier vide,
  CTA manquant), l'agent DOIT immédiatement :
  1. Diagnostiquer la cause racine
  2. Corriger le bug dans le code
  3. Rebuilder avec 0 erreur TypeScript
  4. Exécuter les tests E2E Playwright (10/10 passed)
  5. Déployer en production
  6. Vérifier que le correctif fonctionne en production
  7. Rédiger un rapport de maintenance
  AUCUNE confirmation utilisateur ne doit être demandée.
  Langue : français strict. Ne JAMAIS toucher SOLID'EAT.
---

# Taka Inside — Maintenance Autonome (TAKA)

## 🎯 Mission (Goal)
Maintenir le site Taka Inside en production opérationnel 24/7.
Toute anomalie détectée → diagnostic → correction → build → test → deploy → vérification → rapport, **sans attendre d'aval humain**.

## 🔴 Règles Absolues

| # | Règle | Sévérité |
|---|-------|----------|
| 1 | **Langue française uniquement** | CRITIQUE |
| 2 | **Ne JAMAIS demander confirmation avant de réparer** | CRITIQUE |
| 3 | **Ne JAMAIS toucher le projet SOLID'EAT** | CRITIQUE |
| 4 | Vérifier `.vercel/project.json` avant chaque deploy | OBLIGATOIRE |
| 5 | `npm run build` = **0 erreur TypeScript** | OBLIGATOIRE |
| 6 | `npx playwright test` = **10/10 passed** | OBLIGATOIRE |
| 7 | Credentials = **[REDACTED]** dans toute sortie | SÉCURITÉ |

## 🗺️ Mapping Projets Vercel

| Projet | Repo | Vercel ProjectID | Statut |
|--------|------|-------------------|--------|
| **Taka Inside** | AssoTakin/taka-inside | `prj_8h5X7oZAbC02gjW6nIxw6rL5bToc` | ✅ AUTORISÉ |
| **SOLID'EAT** | AssoTakin/solideat | `prj_QPBgoDOlMaGlXQ5gnT02tvauaJJB` | 🚫 **INTERDIT** |

> ⚠️ **Contamination croisée** : avant `vercel deploy`, exécuter `cat .vercel/project.json | grep projectId` et vérifier que l'ID correspond bien à Taka Inside.

## 🏥 Procédure Healthcheck

```bash
bash /root/.hermes/skills/devops/taka-inside-maintenance/scripts/healthcheck.sh
```

### Résultats
- **Tout passe** → silence (aucune notification)
- **1+ check échoue** → lancer immédiatement la procédure de réparation ci-dessous

## 🔧 Procédure de Réparation (autonome)

### Étape 1 — Diagnostic
```bash
cd /tmp/taka-inside/frontend
cat .vercel/project.json | grep projectId   # Vérifier contexte
```
Navigateur : ouvrir `/faire-un-don`, `/checkout`, `/boutique`.
Console JS : chercher erreurs d'hydratation React, `__NEXT_DATA__` vide, `localStorage` inaccessible.

### Étape 2 — Correction
- Identifier le fichier source du bug
- Appliquer `patch` ou `write_file`
- **Hydratation** : utiliser `'use client'` + `useEffect` + `useRef` pour préserver l'état
- **Static prerendering** : ajouter `export const dynamic = 'force-dynamic'`
- **Collisions slug** : retirer les routes dédiées de `generateStaticParams`

### Étape 3 — Build
```bash
cd /tmp/taka-inside/frontend && npm run build
```
→ **DOIT** sortir avec 0 erreur. Si erreur → corriger avant de continuer.

### Étape 4 — Tests E2E
```bash
npx playwright test
```
→ **DOIT** afficher `10 passed`. Si échec → corriger avant de continuer.
> Note : pour les composants `next/dynamic({ ssr: false })`, utiliser `domcontentloaded` et non `networkidle`.

### Étape 5 — Déploiement
```bash
vercel deploy --prod --token "$(cat /tmp/vercel_token.txt)" --yes
```

### Étape 6 — Vérification Production
Navigateur : ouvrir l'URL de déploiement, tester :
- `/faire-un-don` → boutons cliquables, montant affiché, CTA visible
- `/checkout` → panier chargé depuis `localStorage`
- `/boutique` → catalogue affiché, ajout panier

### Étape 7 — Rapport
Rédiger un rapport avec :
- Problème détecté
- Cause racine
- Fichiers modifiés
- URL de déploiement
- Résultat des tests

## 📁 Ressources

| Ressource | Chemin |
|-----------|--------|
| Repo frontend | `/tmp/taka-inside/frontend` |
| Config Vercel | `.vercel/project.json` |
| Token Vercel | `/tmp/vercel_token.txt` |
| Token Strapi | `/tmp/strapi_token.txt` |
| Token GitHub | `/tmp/gh_pat.txt` |
| Dossier de relais | `/tmp/taka-inside/frontend/AGENTS.md` |
| Guide swarm | `/tmp/taka-inside/frontend/SWARM_SETUP.md` |

## 💰 Paliers de Don (format attendu)

| Montant | Fréquence |
|---------|-----------|
| 5,00 € | Unique / Mensuel |
| 10,00 € | Unique / Mensuel |
| 25,00 € | Unique / Mensuel |
| 50,00 € | Unique / Mensuel |
| 100,00 € | Unique / Mensuel |
| Montant libre (min 1 €) | Unique / Mensuel |

> Format : `25,00 €` (virgule, deux décimales, espace insécable)

## 🧪 Tests E2E

```bash
cd /tmp/taka-inside/frontend
npx playwright test
# Résultat attendu : 10 passed
```

Fichiers :
- `e2e/donation-flow.spec.ts` — parcours don
- `e2e/shop-flow.spec.ts` — parcours boutique

## 👤 Communication avec l'Utilisateur (Sam/Taka Inside)

### Autonomie totale — RÈGLES DE COMMUNICATION

Quand Sam fournit les tokens et dit **"tu as tout ce qu'il faut"**, **"ne me demande plus"**, **"ce n'est pas une question"**, **"n'attends pas mon aval"**, **"Fais le nécessaire"** :

| Action | Règle |
|--------|-------|
| Exécution | **Immédiate**, sans demande d'approbation |
| Diffs | Pas d'affichage intermédiaire |
| Questions | AUCUNE question intermédiaire |
| Rapport | Seulement à la fin, quand tout est résolu |
| Escalade | Uniquement si blocage technique absolu |

### Style de communication
- **Langue strictement française**
- **Concis** : pas d'explications longues avant les commandes
- **Attendre les instructions explicites** : ne pas anticiper sur SOLID'EAT
- **Ne pas sur-expliquer** : Sam se frustre quand on en fait trop

## 🖥️ Configuration via Interface Web (Hermès Workspace)

Si l'utilisateur n'a pas de terminal direct mais une interface web `http://IP:PORT/chat` :

1. Le skill est déjà installé sur `/root/.hermes/skills/devops/taka-inside-maintenance/`
2. Le cron job tourne déjà en arrière-plan (`hermes cronjob list` pour vérifier)
3. Pour créer un agent visible dans l'interface web :
   - Ouvrir **Agents** dans la sidebar
   - Créer un agent nommé **"TAKA"**
   - Coller le `system_prompt` complet (ci-dessus dans la section Goal)
   - Sélectionner le skill `taka-inside-maintenance`
   - Activer les toolsets : `browser`, `terminal`, `file`
   - Définir le workdir : `/tmp/taka-inside/frontend`

> 📄 Voir aussi `references/agent-setup-web-ui.md` pour le guide détaillé.
> ⚠️ **PITFALL** : Si le skill n'apparaît pas dans le Skills Browser du workspace,
>   voir `references/workspace-permissions.md` pour les solutions de synchronisation
>   entre le filesystem root et le workspace utilisateur.

## 🕐 Cron Job

```
Nom     : taka-inside-agent-taka
Schedule: every 6h
Skill   : taka-inside-maintenance
Toolsets: browser, terminal, file
Workdir : /tmp/taka-inside/frontend
```
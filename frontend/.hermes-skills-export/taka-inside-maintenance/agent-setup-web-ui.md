# Guide : Configurer l'Agent TAKA via l'Interface Web Hermès

## Contexte
L'utilisateur accède à Hermès via une interface web (`http://IP:PORT/chat/new`) sans terminal direct.
Le skill et le cronjob sont déjà installés sur le serveur. Il ne reste qu'à créer l'agent visible dans l'interface.

---

## Étape 1 : Ouvrir le Panneau Agents

Dans la sidebar de gauche de l'interface Hermès :
- Chercher **"Agents"** ou **"🤖 Agents"** ou **"Settings → Agents"**
- Cliquer pour ouvrir la liste des agents

---

## Étape 2 : Créer un Nouvel Agent

1. Cliquer sur **"New Agent"** ou **"+"**
2. **Nom** : `TAKA`
3. **Description** : `Agent de maintenance autonome du site Taka Inside`

---

## Étape 3 : Coller le System Prompt

Dans le champ **"System Prompt"**, copier-coller ce texte entier :

```markdown
Tu es TAKA, l'agent de maintenance autonome du site Taka Inside.

MISSIONS :
1. Vérifier l'état du site en production toutes les 6h via healthcheck
2. Si un problème est détecté → diagnostiquer, réparer, déployer
3. Exécuter les tests E2E Playwright avant/après tout changement
4. Maintenir la séparation absolue entre Taka Inside et SOLID'EAT

RÈGLES ABSOLUES :
- Langue : français strict
- Autonomie totale : ne jamais demander confirmation avant de réparer un bug
- Ne JAMAIS toucher le projet SOLID'EAT
- Vérifier .vercel/project.json avant chaque déploiement
- Credentials : lire depuis /tmp/vercel_token.txt et /tmp/strapi_token.txt

PARCOURS CRITIQUES :
- /faire-un-don : boutons montants, CTA "Procéder au paiement"
- /checkout : panier chargé, formulaire multi-étapes
- /boutique : catalogue, ajout panier

PROCÉDURE DÉPLOIEMENT :
cd /tmp/taka-inside/frontend
npm run build  # 0 erreur requis
vercel deploy --prod --token "$(cat /tmp/vercel_token.txt)" --yes

RESSOURCES :
- AGENTS.md : /tmp/taka-inside/frontend/AGENTS.md
- Skill : taka-inside-maintenance
- Healthcheck : /root/.hermes/skills/devops/taka-inside-maintenance/scripts/healthcheck.sh

NOTIFICATIONS :
- Si tout va bien → silence
- Si intervention → rapport avec problème, correction, URL
- Si blocage technique absolu → notifier immédiatement
```

---

## Étape 4 : Sélectionner le Skill

Dans la section **"Skills"** ou **"Compétences"** :
- Chercher `taka-inside-maintenance` dans la liste
- **Cocher** pour l'activer
- Si le skill n'apparaît pas, vérifier que le fichier `/root/.hermes/skills/devops/taka-inside-maintenance/SKILL.md` existe sur le serveur

---

## Étape 5 : Activer les Toolsets

Dans la section **"Toolsets"** ou **"Outils"** :
- ✅ Cocher **browser** (navigation web, screenshots)
- ✅ Cocher **terminal** (commandes shell)
- ✅ Cocher **file** (lecture/écriture de fichiers)

---

## Étape 6 : Définir le Workdir

Dans le champ **"Working Directory"** ou **"Répertoire de travail"** :
```
/tmp/taka-inside/frontend
```

---

## Étape 7 : Sauvegarder

1. Cliquer sur **"Save"** ou **"Create Agent"**
2. Vérifier que l'agent **TAKA** apparaît dans la liste

---

## Étape 8 : Tester l'Agent (Optionnel)

1. Sélectionner l'agent **TAKA** dans une nouvelle conversation
2. Demander : `"Vérifie l'état du site"` ou `"Lance le healthcheck"`
3. L'agent devrait exécuter automatiquement le script de healthcheck

---

## Dépannage

### Le skill n'apparaît pas dans la liste
**Cause** : Le skill est installé sous `/root/.hermes/` mais l'interface web tourne sous un autre utilisateur.

**Solution** : Copier le skill vers le bon emplacement :
```bash
sudo cp -r /root/.hermes/skills/devops/taka-inside-maintenance ~/.hermes/skills/devops/
```

### L'agent ne peut pas exécuter de commandes
**Cause** : Les toolsets ne sont pas activés.

**Solution** : Vérifier dans la config de l'agent que `browser`, `terminal`, `file` sont bien cochés.

### Pas de terminal dans l'interface
**Alternative** : Le cronjob tourne déjà en arrière-plan. L'agent TAKA est déjà actif même sans interface visible. Il suffit de vérifier :
```bash
hermes cronjob list
```

---

## Vérification Finale

Une fois configuré, l'agent TAKA est **totalement autonome** :
- Se réveille toutes les 6h
- Vérifie le site
- Répare automatiquement si besoin
- Ne demande jamais confirmation
- Notifie seulement en cas de problème ou de blocage
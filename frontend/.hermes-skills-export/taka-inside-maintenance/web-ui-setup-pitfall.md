# Guide de configuration de l'agent TAKA via l'interface web Hermès

## ⚠️ PIEGE CRITIQUE : Emplacement des skills

L'interface web Hermès (Skills Browser) cherche les skills dans le **profil actif** :
- Chemin attendu : `~/.hermes/profiles/default/skills/devops/taka-inside-maintenance/`
- **PAS** dans `/root/.hermes/skills/` (utilisé par la CLI `hermes` uniquement)

Si le skill est créé via la CLI par l'utilisateur `root` mais le workspace tourne sous un autre utilisateur (ex: `rkspace`, `ubuntu`), le skill ne sera **pas visible** dans le Skills Browser.

## 🛠️ Solution

### Option A : Terminal du Workspace (recommandé)

Si tu vois un onglet **Terminal** dans la sidebar du workspace, utilise-le :

```bash
# Vérifier l'emplacement du skill
ls ~/.hermes/skills/devops/taka-inside-maintenance/ 2>/dev/null || echo "SKILL NON TROUVE"

# Si non trouvé, le copier dans le profil actif
mkdir -p ~/.hermes/profiles/default/skills/devops
cp -r /root/.hermes/skills/devops/taka-inside-maintenance ~/.hermes/profiles/default/skills/devops/

# Vérifier
ls ~/.hermes/profiles/default/skills/devops/taka-inside-maintenance/
```

### Option B : Pas de terminal dans le workspace

Si l'interface web n'a **pas** de terminal (juste un chat), demande à l'administrateur de copier le skill :

```bash
# Exécuter sur la machine serveur (SSH)
sudo cp -r /root/.hermes/skills/devops/taka-inside-maintenance /home/UTILISATEUR/.hermes/profiles/default/skills/devops/
sudo chown -R UTILISATEUR:UTILISATEUR /home/UTILISATEUR/.hermes/profiles/default/skills/devops/
```

## 🖥️ Quel terminal utiliser ?

| Situation | Terminal à utiliser |
|-----------|-------------------|
| Workspace web avec sidebar + Terminal | **Terminal du workspace** (`>_` dans la sidebar) |
| Interface chat uniquement | **SSH sur le serveur** ou demander à l'admin |
| Mac local | **AUCUN** — le skill doit être sur le serveur distant |

## 📝 Création manuelle de l'agent TAKA dans le web UI

1. Cliquer sur **Agents** dans la sidebar
2. Cliquer **"Créer un agent"**
3. Nom : `TAKA`
4. System Prompt : copier le bloc `goal` du skill `taka-inside-maintenance`
5. Skills : sélectionner `taka-inside-maintenance` (doit apparaître si correctement installé)
6. Toolsets : cocher `browser`, `terminal`, `file`
7. Workdir : `/tmp/taka-inside/frontend`
8. Sauvegarder

## 🔁 Vérification

Après avoir copié le skill, **rafraîchir la page** (F5) puis ouvrir l'onglet **Skills** dans la sidebar. Rechercher "taka" — le skill doit apparaître sous la catégorie `devops`.
# Problème de Permissions Workspace → Root

## Symptôme

Le skill `taka-inside-maintenance` est créé dans `/root/.hermes/skills/devops/` par l'agent root,
mais il n'apparaît pas dans le **Skills Browser** du workspace Hermès webui.

L'utilisateur du workspace (ex: `workspace@1b3249ee97f9`) n'a pas accès au dossier `/root/.hermes/skills/`
car les permissions sont `drwx------` (root uniquement).

```
workspace$ ls ~/.hermes/skills/devops/
# → vide (ou inexistant)

workspace$ ls /root/.hermes/skills/devops/
# → Permission denied
```

## Cause Racine

Le serveur webui et le workspace terminal ne partagent pas forcément le même filesystem,
ou bien les permissions du conteneur Docker empêchent l'accès.

Le backend du webui cherche les skills dans le profil actif (ex: `/root/.hermes/profiles/default/skills/`)
où dans le `HERMES_HOME` du processus, qui peut différer du terminal workspace.

## Solutions

### Solution 1 : Installer via `hermes skills install` (RECOMMANDÉ)

Depuis n'importe quel terminal avec accès au CLI `hermes` :

```bash
# Créer un tarball du skill (déjà créé par l'agent)
tar czf /tmp/taka-skill.tar.gz -C /root/.hermes/skills/devops taka-inside-maintenance

# Copier dans un répertoire accessible par l'utilisateur workspace
mkdir -p /tmp/hermes-export
chmod 777 /tmp/hermes-export
cp /tmp/taka-skill.tar.gz /tmp/hermes-export/

# Depuis le terminal workspace :
mkdir -p ~/.hermes/skills/devops
tar xzf /tmp/hermes-export/taka-skill.tar.gz -C ~/.hermes/skills/devops/
```

Si le terminal workspace ne peut pas lire `/tmp/hermes-export/` :
utiliser `hermes skills install` depuis un terminal qui a accès au CLI :

```bash
hermes skills install /root/.hermes/skills/devops/taka-inside-maintenance
```

Cela copie le skill dans le répertoire actif de l'utilisateur.

### Solution 2 : Copier dans le profil default

```bash
mkdir -p /root/.hermes/profiles/default/skills/devops
cp -r /root/.hermes/skills/devops/taka-inside-maintenance \
  /root/.hermes/profiles/default/skills/devops/
```

### Solution 3 : Définir HERMES_HOME dans le terminal

```bash
export HERMES_HOME=/root/.hermes
hermes skills list  # devrait maintenant afficher taka-inside-maintenance
```

### Solution 4 : Script de synchronisation automatique

Créer un script qui synchronise le skill vers le workspace de l'utilisateur :

```bash
#!/bin/bash
# sync-taka-skill.sh — à exécuter après chaque modification du skill

SOURCE="/root/.hermes/skills/devops/taka-inside-maintenance"
DEST="$HOME/.hermes/skills/devops/taka-inside-maintenance"

mkdir -p "$(dirname "$DEST")"
rsync -av --delete "$SOURCE/" "$DEST/"
echo "Skill synchronisé vers $DEST"
```

## Vérification

Après copie, vérifier que le skill est visible :

```bash
hermes skills list | grep taka-inside-maintenance
```

Si le skill apparaît avec `Source: local` et `Status: enabled`, c'est bon.

## PITFALL : Le webui met en cache `_skillsData`

Le frontend du webui met en cache la liste des skills (`_skillsData = null` au refresh).
Si le skill a été ajouté après l'ouverture du panneau Skills :

1. Cliquer sur un autre onglet (ex: Chat)
2. Revenir sur Skills → la liste sera rechargée depuis l'API

Ou forcer le refresh avec F5 / Ctrl+R.

## Résumé des chemins possibles

| Emplacement | Visibilité CLI | Visibilité WebUI | Permissions |
|-------------|----------------|-------------------|-------------|
| `/root/.hermes/skills/` | ✅ root seul | ❌ workspace bloqué | `drwx------` |
| `~/.hermes/skills/` | ✅ user | ✅ si HERMES_HOME=user | `drwxr-xr-x` |
| `/root/.hermes/profiles/default/skills/` | ✅ root | ✅ si profil actif | `drwx------` |
| `/usr/local/share/hermes-skills/` | ✅ tous | ❌ (pas dans le search path) | `drwxr-xr-x` |

> **Règle** : Toujours vérifier `which hermes`, `echo $HERMES_HOME`, et `hermes skills list`
> avant de conclure qu'un skill est "invisible".

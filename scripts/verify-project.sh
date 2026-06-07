#!/bin/bash
# Garde-fou anti-contamination cross-project
# A exécuter AVANT chaque vercel deploy

set -euo pipefail

# Mapping attendu : repo -> projectId
# taka-inside -> prj_8h5X7oZAbC02gjW6nIxw6rL5bToc (frontend)
# solideat -> prj_QPBgoDOlMaGlXQ5gnT02tvauaJJB (solideat)

REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || echo '')"
if [ -z "$REPO_ROOT" ]; then
  echo "❌ ERROR: Pas un repo git. Annulation."
  exit 1
fi

# Détecter le repo
REMOTE_URL="$(git remote get-url origin 2>/dev/null || echo '')"
if echo "$REMOTE_URL" | grep -q "taka-inside"; then
  EXPECTED_PROJECT="prj_8h5X7oZAbC02gjW6nIxw6rL5bToc"
  PROJECT_NAME="frontend (taka-inside)"
elif echo "$REMOTE_URL" | grep -q "solideat"; then
  EXPECTED_PROJECT="prj_QPBgoDOlMaGlXQ5gnT02tvauaJJB"
  PROJECT_NAME="solideat"
else
  echo "❌ ERROR: Repo inconnu ($REMOTE_URL). Annulation."
  exit 1
fi

# Vérifier .vercel/project.json
VERCEL_JSON="$REPO_ROOT/frontend/.vercel/project.json"
if [ ! -f "$VERCEL_JSON" ]; then
  VERCEL_JSON="$REPO_ROOT/.vercel/project.json"
fi

if [ ! -f "$VERCEL_JSON" ]; then
  echo "❌ ERROR: Pas de .vercel/project.json trouvé. Annulation."
  exit 1
fi

CURRENT_PROJECT="$(grep -o '"projectId" *: *"[^"]*"' "$VERCEL_JSON" | head -1 | sed 's/.*"\([^"]*\)".*/\1/')"

if [ "$CURRENT_PROJECT" != "$EXPECTED_PROJECT" ]; then
  echo "❌❌❌ CROSS-PROJECT CONTAMINATION DETECTEE ❌❌❌"
  echo ""
  echo "Repo actuel:     $REMOTE_URL"
  echo "Project attendu: $EXPECTED_PROJECT ($PROJECT_NAME)"
  echo "Project trouvé:  $CURRENT_PROJECT"
  echo ""
  echo "Fichier: $VERCEL_JSON"
  echo ""
  echo "Action: ANNULE. Corrige .vercel/project.json avant de redéployer."
  exit 1
fi

echo "✅ Garde-fou OK: $PROJECT_NAME (projectId=$CURRENT_PROJECT)"
exit 0

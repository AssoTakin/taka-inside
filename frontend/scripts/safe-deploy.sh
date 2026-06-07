#!/bin/bash
# Garde-fou pour éviter la contamination croisée entre projets Vercel
# À exécuter AVANT chaque vercel deploy

set -euo pipefail

# Mapping repo → project Vercel
declare -A PROJECT_MAP=(
    ["taka-inside"]='prj_8h5X7oZAbC02gjW6nIxw6rL5bToc'
    ["solideat"]='prj_QPBgoDOlMaGlXQ5gnT02tvauaJJB'
)

# Détection du repo courant
REPO_NAME=""
if git rev-parse --is-inside-work-tree &>/dev/null; then
    REMOTE_URL=$(git remote get-url origin 2>/dev/null || true)
    if [[ "$REMOTE_URL" == *"taka-inside"* ]]; then
        REPO_NAME="taka-inside"
    elif [[ "$REMOTE_URL" == *"solideat"* ]]; then
        REPO_NAME="solideat"
    fi
fi

if [[ -z "$REPO_NAME" ]]; then
    echo "❌ ERREUR: Impossible de détecter le repo courant (ni taka-inside ni solideat)"
    exit 1
fi

EXPECTED_PROJECT="${PROJECT_MAP[$REPO_NAME]}"

# Vérification du project.json
PROJECT_FILE=".vercel/project.json"
if [[ ! -f "$PROJECT_FILE" ]]; then
    echo "❌ ERREUR: $PROJECT_FILE introuvable"
    exit 1
fi

CURRENT_PROJECT=$(python3 -c "import json,sys; d=json.load(open('$PROJECT_FILE')); print(d.get('projectId',''))")

if [[ "$CURRENT_PROJECT" != "$EXPECTED_PROJECT" ]]; then
    echo "❌ ERREUR GRAVE — CONTAMINATION RISQUÉE"
    echo "   Repo détecté    : $REPO_NAME"
    echo "   Project attendu : $EXPECTED_PROJECT"
    echo "   Project actuel  : $CURRENT_PROJECT"
    echo ""
    echo "   Correction automatique..."
    
    # Correction
    python3 -c "
import json
d = json.load(open('$PROJECT_FILE'))
d['projectId'] = '$EXPECTED_PROJECT'
json.dump(d, open('$PROJECT_FILE', 'w'), indent=2)
"
    echo "   ✅ Corrigé → $EXPECTED_PROJECT"
    echo "   Relancez la commande de déploiement."
    exit 1
fi

echo "✅ Vérification OK — $REPO_NAME → $EXPECTED_PROJECT"
echo "   Lancement du déploiement Vercel..."

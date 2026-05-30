#!/bin/bash
# Setup GitHub Repository for Taka Inside
# Usage: ./scripts/setup-github.sh YOUR_GITHUB_TOKEN

set -e

TOKEN=$1
REPO_NAME="taka-inside"
OWNER="sam"

if [ -z "$TOKEN" ]; then
  echo "Usage: ./scripts/setup-github.sh YOUR_GITHUB_TOKEN"
  echo ""
  echo "Pour obtenir un token GitHub :"
  echo "1. Aller sur https://github.com/settings/tokens"
  echo "2. Générer un token classique avec scope 'repo'"
  echo "3. Copier le token et relancer ce script"
  exit 1
fi

echo "🚀 Création du repo GitHub $REPO_NAME..."

# Créer le repo via API
curl -s -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d '{
    "name": "'"$REPO_NAME"'",
    "description": "Taka Inside — Site web association culturelle \u0026 label musical (Bénin). Next.js + Strapi.",
    "private": false,
    "has_issues": true,
    "has_projects": true,
    "has_wiki": false,
    "has_downloads": true
  }' | grep -q '"full_name"' && echo "✅ Repo créé !" || echo "⚠️ Repo existe déjà ou erreur"

# Configurer le remote
echo "🔗 Configuration du remote origin..."
git remote remove origin 2>/dev/null || true
git remote add origin "https://$TOKEN@github.com/$OWNER/$REPO_NAME.git"

# Push
echo "📤 Push du code..."
git branch -M main
git push -u origin main --force

echo ""
echo "✅ Repo GitHub configuré : https://github.com/$OWNER/$REPO_NAME"
echo ""
echo "Prochaines étapes :"
echo "1. Connecter Vercel : https://vercel.com/new → importer le repo"
echo "2. Connecter Railway : https://railway.app → deploy from GitHub"
echo "3. Configurer les secrets dans GitHub Settings → Secrets → Actions"
echo ""
echo "Secrets à ajouter :"
echo "  - VERCEL_TOKEN (voir https://vercel.com/account/tokens)"
echo "  - VERCEL_ORG_ID (dans .vercel/project.json après link)"
echo "  - VERCEL_PROJECT_ID (dans .vercel/project.json après link)"
echo "  - RAILWAY_TOKEN (dans Railway → Account Settings → Tokens)"
echo "  - NEXT_PUBLIC_STRAPI_API_URL (URL Railway du backend)"
echo "  - STRAPI_API_TOKEN (depuis Strapi admin → API Tokens)"

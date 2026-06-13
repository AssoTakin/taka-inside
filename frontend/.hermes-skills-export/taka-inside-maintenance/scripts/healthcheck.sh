#!/bin/bash
set -e

FRONTEND_URL="https://frontend-3crfos1sb-sam-takas-projects.vercel.app"
CHECKS_PASSED=0
CHECKS_FAILED=0

check_page() {
  local url=$1
  local pattern=$2
  local name=$3
  if curl -s --max-time 10 "$url" | grep -qi "$pattern"; then
    ((CHECKS_PASSED++))
  else
    ((CHECKS_FAILED++))
    echo "FAIL: $name ($url)"
  fi
}

echo "=== Healthcheck Taka Inside ==="
echo "URL: $FRONTEND_URL"
echo ""

check_page "$FRONTEND_URL" "Taka Inside" "Accueil"
check_page "$FRONTEND_URL/faire-un-don" "faire un don" "Page Don"
check_page "$FRONTEND_URL/faire-un-don" "Procéder au paiement" "CTA Don"
check_page "$FRONTEND_URL/boutique" "boutique" "Page Boutique"
check_page "$FRONTEND_URL/checkout" "panier" "Page Checkout"

echo ""
echo "=== Résultat : $CHECKS_PASSED passed, $CHECKS_FAILED failed ==="

if [ $CHECKS_FAILED -gt 0 ]; then
  echo "⚠️  INTERVENTION REQUISE"
  exit 1
else
  echo "✅ Tout est OK"
  exit 0
fi
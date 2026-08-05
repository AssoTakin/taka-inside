/**
 * Helpers de formatage des prix — TOUT EN EUR
 * Taux fixe : 1 EUR = 655.957 FCFA (taux CFAO)
 * 
 * Règle d'or : tout est EUR dans Strapi, l'UI, Stripe et FedaPay.
 * Seule FedaPay (Mobile Money) reçoit EUR converti en FCFA côté client.
 */

const EUR_FCFA_RATE = 655.957;

/** Conversion EUR → FCFA (pour FedaPay uniquement) */
export function toFCFA(eurAmount: number): number {
  return Math.round(eurAmount * EUR_FCFA_RATE);
}

/** Formatage affichage en EUR */
export function formatPrice(amount: number): string {
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: amount < 1 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} €`;
}

/** Stripe : centimes EUR */
export function toStripeCents(eurAmount: number): number {
  return Math.round(eurAmount * 100);
}

/** FedaPay : montant EUR converti en FCFA */
export function toFedaPayAmount(eurAmount: number): number {
  return toFCFA(eurAmount);
}

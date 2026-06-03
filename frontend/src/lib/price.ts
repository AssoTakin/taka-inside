/**
 * Helpers de formatage des prix — conversion EUR ↔ FCFA
 * Taux fixe : 1 EUR = 655.957 FCFA (taux CFAO)
 * Strapi stocke le prix brut + la devise dans le champ `devise` (EUR | FCFA)
 * Le frontend affiche tel quel : le contrôle total est au niveau CMS
 */

const EUR_FCFA_RATE = 655.957;

/** Conversion EUR → FCFA */
export function toFCFA(eurAmount: number): number {
  return Math.round(eurAmount * EUR_FCFA_RATE);
}

/** Conversion FCFA → EUR */
export function toEUR(fcfaAmount: number): number {
  return Math.round((fcfaAmount / EUR_FCFA_RATE) * 100) / 100;
}

/** Formatage affichage utilisateur : "3,81 €" ou "2 500 FCFA" */
export function formatPrice(
  amount: number,
  currency: "EUR" | "FCFA" = "EUR"
): string {
  if (currency === "FCFA") {
    return `${amount.toLocaleString("fr-FR")} FCFA`;
  }
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: amount < 1 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);
  return `${formatted} €`;
}

/** Stripe : centimes EUR toujours */
export function toStripeCents(
  amount: number,
  currency: "EUR" | "FCFA" = "EUR"
): number {
  const eur = currency === "FCFA" ? toEUR(amount) : amount;
  return Math.round(eur * 100);
}

/** FedaPay : montant FCFA toujours */
export function toFedaPayAmount(
  amount: number,
  currency: "EUR" | "FCFA" = "FCFA"
): number {
  return currency === "EUR" ? toFCFA(amount) : Math.round(amount);
}

/** PayPal : montant EUR (PayPal gère les devises mais EUR est le plus simple) */
export function toPayPalAmount(
  amount: number,
  currency: "EUR" | "FCFA" = "EUR"
): { value: string; currencyCode: string } {
  const eur = currency === "FCFA" ? toEUR(amount) : amount;
  return {
    value: eur.toFixed(2),
    currencyCode: "EUR",
  };
}

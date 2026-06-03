/**
 * Helpers de formatage des prix — conversion FCFA → EUR
 * Taux fixe : 1 EUR = 655.957 FCFA (taux CFAO)
 * Heuristique : prix > 100 = FCFA (convertir), prix ≤ 100 = EUR (afficher tel quel)
 */

const EUR_FCFA_RATE = 655.957;

export function toEUR(amount: number): number {
  if (amount > 100) {
    // Probablement en FCFA → convertir
    return Math.round((amount / EUR_FCFA_RATE) * 100) / 100;
  }
  // Probablement déjà en EUR
  return amount;
}

export function formatPrice(amount: number, options?: { showCurrency?: boolean }): string {
  const eur = toEUR(amount);
  const formatted = new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: eur < 1 ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(eur);
  return options?.showCurrency === false ? formatted : `${formatted} €`;
}

export function toEURCents(amount: number): number {
  return Math.round(toEUR(amount) * 100);
}

export function formatPriceRawFCFA(amount: number): string {
  // Pour les dons / livraisons qui restent en FCFA
  return `${amount.toLocaleString("fr-FR")} FCFA`;
}

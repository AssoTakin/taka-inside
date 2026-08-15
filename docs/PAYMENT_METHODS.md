# Gestion des moyens de paiement via Strapi

## Où ça se configure

1. Ouvrir l'admin Strapi : `https://taka-inside-production.up.railway.app/taka-admin-2026`
2. Aller dans **Content Manager → Méthode de paiement**
3. Cliquer sur une méthode existante
4. Modifier le champ **`isActive`** :
   - `true` → le moyen de paiement est affiché
   - `false` → il est caché sur `/faire-un-don` et `/checkout`
5. Publier

## Méthodes reconnues par le frontend

| Nom dans Strapi | Code interne | Comportement |
|---|---|---|
| `Carte Bancaire` | `stripe` | Redirection Stripe Checkout |
| `Mobile Money` (ou contenant `FedaPay`/`Moov`/`MTN`) | `fedapay` | Redirection FedaPay |
| `PayPal` | `paypal` | Non activé (message d'information) |

## Champs disponibles

- **`name`** : nom technique (utilisé pour identifier la méthode)
- **`displayName`** : texte affiché sur le bouton
- **`description`** : texte explicatif affiché dans la carte de sécurité
- **`isActive`** : active/désactive la méthode
- **`displayOrder`** : ordre d'affichage
- **`icon`** : icône optionnelle

## Comment tester

- Désactiver une méthode dans Strapi
- Ouvrir la page de don : `https://takainside.org/faire-un-don.html?preview=taka2026`
- Le bouton correspondant doit disparaître

## Notes techniques

- Les pages `/faire-un-don.html` et `/checkout` sont des fichiers HTML statiques vanilla JS.
- Elles appellent le proxy Next.js `/api/payment-methods` qui interroge Strapi.
- Aucun redeploiement frontend n'est nécessaire quand on modifie `isActive` dans Strapi.
- Le proxy ne met pas en cache les résultats : le changement est effectif immédiatement (sauf cache navigateur).

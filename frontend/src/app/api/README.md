# API Routes Taka Inside

## `/api/email/send`

Envoie un email via Resend.

### Méthode
`POST`

### Body
```json
{
  "to": "client@example.com",
  "subject": "Confirmation de commande",
  "html": "<h1>Merci pour votre commande !</h1>",
  "text": "Merci pour votre commande !"
}
```

### Réponse
```json
{
  "success": true,
  "id": "email_uuid"
}
```

### Sécurité
- `Authorization: Bearer <token>` requis si `NODE_ENV === production`
- Rate limit: 10 emails/minute par IP

---

## `/api/webhooks/stripe`

Endpoint Stripe pour les événements de paiement.

### Méthode
`POST`

### Événements gérés
- `payment_intent.succeeded` → Création commande + email confirmation
- `payment_intent.payment_failed` → Log d'échec

### Sécurité
- Signature Stripe vérifiée (`stripe-signature`)
- Requête 200 immédiate, traitement async

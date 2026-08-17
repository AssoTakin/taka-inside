# Taka Inside — Formulaire Devenir Bénévole

## Vue d'ensemble

Le formulaire bénévole est hébergé sur `/devenir-benevole`.  
Il est entièrement configurable depuis Strapi et fonctionne maintenant de manière fiable en production.

## Stack

- Frontend : Next.js App Router + React Client Component (`BenevolePageClient.tsx`)
- Backend : Strapi v5 collection type `Benevole`
- Emails : Resend (`benevole@takainside.org` → admin, reply-to `kwabo@takainside.org`)
- API interne : `POST /api/benevole`

## Configuration dans Strapi

Accéder à : **Content Manager → Page Content → `devenir-benevole`**

Modifier le champ JSON **`formConfig`** :

```json
{
  "labels": {
    "lastName": "Nom",
    "firstName": "Prénom",
    "email": "Email",
    "phone": "Téléphone",
    "city": "Ville",
    "country": "Pays",
    "skills": "Compétences",
    "availabilities": "Disponibilité",
    "motivation": "Motivation"
  },
  "placeholders": {
    "lastName": "Votre nom",
    "firstName": "Votre prénom",
    "email": "votre@email.com",
    "phone": "+229 ...",
    "city": "Cotonou, Porto-Novo...",
    "country": "Bénin, France...",
    "motivation": "Pourquoi souhaitez-vous rejoindre Taka Inside ?"
  },
  "requiredFields": ["lastName", "firstName", "email", "city", "skills", "motivation"],
  "skills": ["Communication", "Événementiel", "Technique", "Musique", "Design", "Traduction", "Autre"],
  "availabilities": ["Week-ends", "Soirs en semaine", "Temps plein", "Selon les projets"],
  "submitButton": "Envoyer ma candidature",
  "otherSkillLabel": "Précisez votre compétence *",
  "otherSkillPlaceholder": "Décrivez votre compétence...",
  "successMessage": "Votre candidature a bien été envoyée. Un email de confirmation vous a été envoyé.",
  "errorMessage": "Une erreur est survenue. Veuillez réessayer."
}
```

### Points importants

- `requiredFields` : liste des champs obligatoires. Par défaut : nom, prénom, email, ville, compétences, motivation.
- `skills` : compétences proposées en multi-sélection.
- `availabilities` : disponibilités proposées en multi-sélection.
- `successMessage` et `errorMessage` : messages affichés après soumission.
- Si l'utilisateur choisit **"Autre"**, un champ `otherSkillLabel` apparaît automatiquement et devient obligatoire.

## API `/api/benevole`

La route enregistre la candidature dans Strapi, envoie un email au candidat et un email de notification à `benevole@takainside.org`.

Variables d'environnement Vercel nécessaires :

- `NEXT_PUBLIC_STRAPI_API_URL`
- `STRAPI_API_TOKEN`
- `RESEND_API_KEY`
- `BENEVOLE_ADMIN_EMAIL` = `benevole@takainside.org`
- `BENEVOLE_REPLY_TO_EMAIL` = `kwabo@takainside.org`

## Fichiers clés

- `frontend/src/app/devenir-benevole/page.tsx` — Server Component + metadata
- `frontend/src/app/devenir-benevole/BenevolePageClient.tsx` — Client Component (formulaire)
- `frontend/src/app/api/benevole/route.ts` — API interne + Resend
- `backend/src/api/benevole/content-types/benevole/schema.json` — schéma Strapi
- `backend/src/api/page-content/content-types/page-content/schema.json` — champ `formConfig`

## Vérifications effectuées

- Build frontend local : OK
- `npx tsc --noEmit` : OK
- Déploiement Vercel production (`takainside.org`) : en cours
- Middleware : `/devenir-benevole` autorisé en production malgré l'écran coming-soon
- Formulaire React standard, pas de duplication layout (SiteLayout gère header/footer)

## Note sur les emails

Les emails partent via Resend. Pour éviter qu'ils atterrissent en spam, le domaine `takainside.org` doit être **vérifié dans le dashboard Resend**.

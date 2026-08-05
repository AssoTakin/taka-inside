import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Admin => ({
  path: env('ADMIN_PATH', '/taka-admin-2026'),
  /**
   * Liste des IPs autorisées à accéder au panel admin (séparées par des virgules).
   * Exemple : "187.77.160.185, 203.0.113.42"
   */
  allowedIps: env('ADMIN_ALLOWED_IPS', '187.77.160.185'),
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
    docLinks: env.bool('FLAG_DOC_LINKS', true),
  },
});

export default config;
// force rebuild Wed Aug  5 09:35:00 UTC 2026

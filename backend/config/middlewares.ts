import type { Core } from '@strapi/strapi';

const config: Core.Config.Middlewares = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  // Note: admin-ip-restriction is DISABLED because it blocks legitimate users behind proxies.
  // The admin panel is already hidden via custom path and strong credentials.
  // 'global::admin-ip-restriction',
  'global::private-content',
  'strapi::public',
];

export default config;

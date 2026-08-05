import type { Core } from '@strapi/strapi';

/**
 * Middleware de restriction IP sur le nouveau chemin admin.
 * Seules les IPs listées dans ADMIN_ALLOWED_IPS (virgule) peuvent accéder
 * à ADMIN_PATH (/taka-admin-2026 par défaut).
 * L'API publique (/api/*) n'est pas touchée.
 */
const ipRestriction = (config: any, { strapi }: { strapi: Core.Strapi }) => {
  const allowedIps = (process.env.ADMIN_ALLOWED_IPS || '187.77.160.185')
    .split(',')
    .map((ip: string) => ip.trim())
    .filter(Boolean);
  const adminPath = process.env.ADMIN_PATH || '/taka-admin-2026';

  return async (ctx: any, next: () => Promise<void>) => {
    if (!ctx.path.startsWith(adminPath)) {
      return next();
    }

    const forwarded = ctx.request.headers['x-forwarded-for'];
    const remoteIp = (typeof forwarded === 'string' ? forwarded.split(',')[0] : ctx.request.ip)
      ?.trim();

    strapi.log.debug(
      `[admin-ip-restriction] Request on ${adminPath} from IP: ${remoteIp} (allowed: ${allowedIps.join(', ') || 'none'})`
    );

    if (!remoteIp || !allowedIps.includes(remoteIp)) {
      ctx.status = 404;
      ctx.body = { error: 'Not Found' };
      strapi.log.warn(`[admin-ip-restriction] Blocked IP ${remoteIp} on ${adminPath}`);
      return;
    }

    return next();
  };
};

export default ipRestriction;

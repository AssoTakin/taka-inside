import type { Core } from '@strapi/strapi';

/**
 * Middleware de restriction IP sur le chemin admin Strapi.
 * Seules les IPs listees dans ADMIN_ALLOWED_IPS (virgule) peuvent acceder
 * a ADMIN_PATH (/taka-admin-2026 par defaut). L'API publique (/api/*) n'est pas touchee.
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
    const realIp = ctx.request.headers['x-real-ip'];
    const remoteIp = (
      (typeof forwarded === 'string' ? forwarded.split(',')[0] : undefined) ||
      realIp ||
      ctx.request.ip
    )?.trim();

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

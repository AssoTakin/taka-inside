import type { Core } from '@strapi/strapi';

/**
 * Middleware qui force l'authentification sur les endpoints sensibles du Content API,
 * indépendamment du cache users-permissions.
 */
const privateContent = (config: unknown, { strapi }: { strapi: any }) => {
  return async (ctx, next) => {
    const protectedPrefixes = [
      '/api/homepage',
      '/api/menu-items',
    ];

    const isProtected = protectedPrefixes.some((prefix) =>
      ctx.request.path.startsWith(prefix)
    );

    if (isProtected) {
      const auth = ctx.request.headers.authorization;
      if (!auth || !auth.trim()) {
        ctx.status = 401;
        ctx.body = {
          data: null,
          error: {
            status: 401,
            name: 'UnauthorizedError',
            message: 'Missing or invalid credentials',
            details: {},
          },
        };
        return;
      }
    }

    await next();
  };
};

export default privateContent;

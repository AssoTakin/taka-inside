// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   */
  bootstrap({ strapi }: { strapi: any }) {
    console.log('[Taka Inside] Strapi bootstrap starting...');

    // Auto-configure public permissions for content-types
    const configurePublicPermissions = async () => {
      try {
        const publicRole = await strapi.db.query('plugin::users-permissions.role').findOne({
          where: { type: 'public' },
          populate: { permissions: true }
        });

        if (!publicRole) {
          console.warn('[Taka Inside] Public role not found, skipping permission setup');
          return;
        }

        console.log(`[Taka Inside] Configuring public permissions for role ${publicRole.id}`);

        // Public: accessible without any token (static content, healthcheck, public legal/config data)
        const ctsPublic = [
          'api::page-content.page-content',
          'api::site-config.site-config',
          'api::legal-page.legal-page',
          'api::payment-method.payment-method',
          'api::global-cta.global-cta'
        ];
        // Authenticated: frontend sends API token (server + client); do NOT expose to anonymous users
        const ctsAuthenticated = [
          'api::homepage.homepage',
          'api::menu-item.menu-item'
        ];

        const setPublicPermission = async (ctUid: string, enabled: boolean) => {
          try {
            const ctrlName = ctUid.split('.')[1];
            const ghostAction = `${ctUid}.${ctrlName}`;

            // Disable ghost controller action if rows exist
            const ghostRows = await strapi.db.query('plugin::users-permissions.permission').findMany({
              where: {
                role: { id: publicRole.id },
                action: ghostAction
              }
            });

            if (ghostRows.length > 0) {
              await strapi.db.query('plugin::users-permissions.permission').updateMany({
                where: {
                  role: { id: publicRole.id },
                  action: ghostAction
                },
                data: { enabled: false }
              });
              console.log(`[Taka Inside] Disabled ghost action ${ghostAction}`);
            }

            for (const action of ['find', 'findOne']) {
              const actionName = `${ctUid}.${action}`;
              const existing = await strapi.db.query('plugin::users-permissions.permission').findOne({
                where: {
                  role: { id: publicRole.id },
                  action: actionName
                }
              });

              if (existing) {
                if (existing.enabled !== enabled) {
                  await strapi.db.query('plugin::users-permissions.permission').update({
                    where: { id: existing.id },
                    data: { enabled }
                  });
                  console.log(`[Taka Inside] Updated ${actionName} to enabled=${enabled}`);
                } else {
                  console.log(`[Taka Inside] ${actionName} already enabled=${enabled}`);
                }
              } else if (enabled) {
                await strapi.db.query('plugin::users-permissions.permission').create({
                  data: {
                    action: actionName,
                    enabled: true,
                    role: publicRole.id
                  }
                });
                console.log(`[Taka Inside] Created ${actionName} enabled=true`);
              } else {
                console.log(`[Taka Inside] No public permission row for ${actionName}; nothing to disable`);
              }
            }
          } catch (e) {
            console.warn(`[Taka Inside] Failed to set permissions for ${ctUid}:`, e);
          }
        };

        for (const ctUid of ctsPublic) {
          await setPublicPermission(ctUid, true);
        }
        for (const ctUid of ctsAuthenticated) {
          await setPublicPermission(ctUid, false);
        }

        console.log('[Taka Inside] Public permissions configuration complete');
      } catch (e) {
        console.warn('[Taka Inside] Bootstrap permission error:', e);
      }
    };

    configurePublicPermissions();

    // Seed default radio section links if empty
    const seedRadioLinks = async () => {
      try {
        // Do NOT touch existing sections; only fix missing radio links
        const homepage = await strapi.documents('api::homepage.homepage').findFirst({
          status: 'published',
          populate: {
            sections: {
              on: {
                'homepage.radio-section': {
                  populate: ['links']
                }
              }
            }
          }
        });
        if (!homepage) return;

        const sections = homepage.sections || [];
        const radioIdx = sections.findIndex((s: any) => s.__component === 'homepage.radio-section');
        if (radioIdx === -1) return;

        const radio = sections[radioIdx];
        if (Array.isArray(radio.links) && radio.links.length > 0) {
          console.log('[Taka Inside] Radio links already populated, skipping seed');
          return;
        }

        // If there is only the radio section, do not run automatically to avoid data loss
        if (sections.length < 2) {
          console.log('[Taka Inside] Homepage sections look incomplete; skipping radio links auto-seed to avoid overwriting content.');
          return;
        }

        const defaultLinks = [
          { label: 'Facebook', link: 'https://www.facebook.com/takainside', style: 'primary', icon: 'facebook', isExternal: true },
          { label: 'Instagram', link: 'https://www.instagram.com/takainside_asso', style: 'primary', icon: 'instagram', isExternal: true },
          { label: 'X', link: 'https://x.com/takainsideasso', style: 'primary', icon: 'twitter', isExternal: true },
        ];

        // Rebuild only the radio section, preserve everything else exactly as-is
        const updatedSections = sections.map((s: any) => {
          if (s.__component === 'homepage.radio-section') {
            const { links: _links, ...rest } = s;
            return { ...rest, links: defaultLinks };
          }
          return s;
        });

        await strapi.documents('api::homepage.homepage').update({
          documentId: homepage.documentId,
          data: { sections: updatedSections },
          status: 'published',
        });
        console.log('[Taka Inside] Seeded default radio section links');
      } catch (e) {
        console.warn('[Taka Inside] Failed to seed radio links:', e);
      }
    };

    seedRadioLinks();
  },
};
// force rebuild Sat Jun  6 21:12:13 UTC 2026

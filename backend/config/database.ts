import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
    },
    pool: { min: 2, max: 10 },
    acquireConnectionTimeout: 60000,
  },
});

export default config;

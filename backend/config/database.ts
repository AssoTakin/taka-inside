import { parse } from 'pg-connection-string';
import type { Core } from '@strapi/strapi';

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Database => {
  const { host, port, database, user, password } = parse(env('DATABASE_URL', ''));

  return {
    connection: {
      client: 'postgres',
      connection: {
        host: host ?? 'localhost',
        port: Number(port ?? 5432),
        database: database ?? 'strapi',
        user: user ?? 'strapi',
        password: password ?? '',
        ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
      },
      pool: { min: 2, max: 10 },
      acquireConnectionTimeout: 60000,
    },
  };
};

export default config;

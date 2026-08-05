import { parse, ConnectionOptions } from 'pg-connection-string';

export default ({ env }: any) => {
  const dbUrl = env('DATABASE_URL', '');
  const parsed: ConnectionOptions = dbUrl ? parse(dbUrl) : ({} as any);
  const { host, port, database, user, password } = parsed;

  return {
    connection: {
      client: 'postgres',
      connection: {
        host: host || 'localhost',
        port: Number(port) || 5432,
        database: database || 'strapi',
        user: user || 'strapi',
        password: password || '',
        ssl: env.bool('DATABASE_SSL', false) ? { rejectUnauthorized: false } : false,
      },
      pool: { min: 2, max: 10 },
      acquireConnectionTimeout: 60000,
    },
  };
};

// Update with your config settings.

interface KnexConfig {
  [key: string]: object;
};

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export const config: KnexConfig = {
  main: {
    client: 'pg',
    connection: {
      host : 'postgres',
      port : 5432,
      user : 'user',
      password : 'password',
      database : 'teatr'
    },
    pool: { min: 0, max: 7 },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
    seeds: {
      directory: __dirname + '/knex/seeds'
    }
  }

};

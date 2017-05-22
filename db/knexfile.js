export default {
  development: {
    client: process.env.DB_CLIENT || 'postgresql',
    connection: {
      host: process.env.DB_HOST || '172.17.42.1',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'generics',
      charset: process.env.DB_CHARSET || 'utf8',
    },
    migrations: {
      directory: `${__dirname}/migrations`,
    },
    seeds: {
      directory: `${__dirname}/seeds`,
    },
  },
  test: {
    client: process.env.DB_CLIENT || 'postgresql',
    connection: {
      host: process.env.DB_HOST || '172.17.42.1',
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'generics_tests',
      charset: process.env.DB_CHARSET || 'utf8',
    },
    migrations: {
      directory: `${__dirname}/migrations`,
    },
    seeds: {
      directory: `${__dirname}/seeds`,
    },
  },
};

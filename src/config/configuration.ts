export default () => {
  return {
    database: {
      password: process.env.DATABASE_PASSWORD,
      user: process.env.DATABASE_USERNAME,
      name: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
    redis: {
      port: process.env.REDIS_PORT,
      host: process.env.REDIS_HOST,
      ttl: process.env.CACHE_TTL,
    },
    jwt: {
      secret: process.env.SECRET_KEY,
    },
    market: {
      token: process.env.TOKEN_BRAPI,
    }
  };
};

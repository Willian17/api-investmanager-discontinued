export default () => {
  return {
    database: {
      password: process.env.DATABASE_PASSWORD,
      user: process.env.DATABASE_USERNAME,
      name: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    },
  };
};

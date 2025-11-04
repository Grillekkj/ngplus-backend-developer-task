import 'dotenv/config';

const env = process.env;

export const enviroment = {
  databaseConfigs: {
    type: env.DATABASE_TYPE,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    host: env.DATABASE_HOST,
    port: Number(env.DATABASE_PORT),
    name: env.DATABASE_DB,
  },
};

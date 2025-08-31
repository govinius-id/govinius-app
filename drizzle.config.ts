import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './server/schemas',
  dialect: 'mysql',
  dbCredentials: {
    host: process.env.NUXT_MYSQL_HOST!,
    port: +process.env.NUXT_MYSQL_PORT!,
    user: process.env.NUXT_MYSQL_USER!,
    password: process.env.NUXT_MYSQL_PASSWORD!,
    database: process.env.NUXT_MYSQL_DATABASE!,
  },
});

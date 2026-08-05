import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/config/schema.js',
  out: './src/drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});

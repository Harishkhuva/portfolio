import dotenv from 'dotenv';
import { createClient } from '@libsql/client';

dotenv.config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDatabase() {
  console.log('Connecting to Turso...');

  await db.batch([
    {
      sql: `
        CREATE TABLE IF NOT EXISTS profile (
          id INTEGER PRIMARY KEY DEFAULT 1,
          name TEXT NOT NULL DEFAULT 'Harish Khuva',
          headline TEXT,
          subheadline TEXT,
          bio TEXT,
          email TEXT,
          phone TEXT,
          location TEXT,
          years_exp TEXT,
          projects_count TEXT,
          available BOOLEAN
        )
      `,
      args: [],
    },
    {
      sql: `
        CREATE TABLE IF NOT EXISTS skills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          text TEXT NOT NULL,
          sort_order INTEGER DEFAULT 0
        )
      `,
      args: [],
    },
    {
      sql: `
        CREATE TABLE IF NOT EXISTS platforms (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          count TEXT,
          glyph TEXT,
          color_class TEXT,
          bg_class TEXT,
          sort_order INTEGER DEFAULT 0
        )
      `,
      args: [],
    },
    {
      sql: `
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          platform TEXT,
          category TEXT,
          description TEXT,
          tags TEXT,
          accent TEXT,
          image_url TEXT,
          sort_order INTEGER DEFAULT 0
        )
      `,
      args: [],
    },
    {
      sql: `
        CREATE TABLE IF NOT EXISTS services (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT,
          price TEXT,
          features TEXT,
          icon TEXT,
          sort_order INTEGER DEFAULT 0
        )
      `,
      args: [],
    },
    {
      sql: `
        CREATE TABLE IF NOT EXISTS settings (
          id INTEGER PRIMARY KEY DEFAULT 1,
          theme_color TEXT,
          color_mode TEXT
        )
      `,
      args: [],
    },
  ]);

  console.log('✅ Turso database tables created successfully.');
}

initDatabase().catch((error) => {
  console.error('❌ Database initialization failed:');
  console.error(error);
  process.exit(1);
});
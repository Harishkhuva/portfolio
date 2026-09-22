import { PGlite } from '@electric-sql/pglite';
import { seedData } from './seed';

let dbInstance: PGlite | null = null;

export async function getDB(): Promise<PGlite> {
  if (dbInstance) return dbInstance;

  dbInstance = new PGlite('idb://harish-portfolio-db');
  await initSchema(dbInstance);
  await seedIfEmpty(dbInstance);
  return dbInstance;
}

async function initSchema(db: PGlite) {
  await db.exec(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY DEFAULT 1,
      name TEXT NOT NULL DEFAULT 'Harish Khuva',
      headline TEXT NOT NULL DEFAULT '',
      subheadline TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      years_exp TEXT NOT NULL DEFAULT '3+',
      projects_count TEXT NOT NULL DEFAULT '50+',
      available BOOLEAN NOT NULL DEFAULT true
    );

    CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      text TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS platforms (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      count TEXT NOT NULL,
      glyph TEXT NOT NULL,
      color_class TEXT NOT NULL,
      bg_class TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      platform TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      tags TEXT NOT NULL DEFAULT '',
      accent TEXT NOT NULL DEFAULT 'from-brand-400 to-brand-600',
      image_url TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      price TEXT NOT NULL,
      features TEXT NOT NULL DEFAULT '',
      icon TEXT NOT NULL DEFAULT 'globe',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY DEFAULT 1,
      theme_color TEXT NOT NULL DEFAULT 'teal',
      color_mode TEXT NOT NULL DEFAULT 'light'
    );
  `);

  // Migration: add image_url column if missing (for existing DBs created before this field)
  const cols = await db.query<{ column_name: string }>(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'image_url'`
  );
  if (cols.rows.length === 0) {
    await db.exec(`ALTER TABLE projects ADD COLUMN image_url TEXT NOT NULL DEFAULT ''`);
  }

  // Seed default settings row if missing
  const settingsCheck = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM settings');
  if (Number(settingsCheck.rows[0].count) === 0) {
    await db.query(`INSERT INTO settings (id, theme_color, color_mode) VALUES ($1, $2, $3)`, [1, 'teal', 'light']);
  }
}

async function seedIfEmpty(db: PGlite) {
  const check = await db.query<{ count: string }>('SELECT COUNT(*) as count FROM profile');
  if (Number(check.rows[0].count) > 0) return;

  await db.query(
    `INSERT INTO profile (id, name, headline, subheadline, bio, email, phone, location, years_exp, projects_count, available)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
    [
      1,
      seedData.profile.name,
      seedData.profile.headline,
      seedData.profile.subheadline,
      seedData.profile.bio,
      seedData.profile.email,
      seedData.profile.phone,
      seedData.profile.location,
      seedData.profile.years_exp,
      seedData.profile.projects_count,
      seedData.profile.available,
    ]
  );

  await db.query(
    `INSERT INTO settings (id, theme_color, color_mode) VALUES ($1, $2, $3)`,
    [1, seedData.settings.theme_color, seedData.settings.color_mode]
  );

  for (const s of seedData.skills) {
    await db.query('INSERT INTO skills (text, sort_order) VALUES ($1, $2)', [s.text, s.sort_order]);
  }

  for (const p of seedData.platforms) {
    await db.query(
      'INSERT INTO platforms (name, count, glyph, color_class, bg_class, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
      [p.name, p.count, p.glyph, p.color_class, p.bg_class, p.sort_order]
    );
  }

  for (const p of seedData.projects) {
    await db.query(
      'INSERT INTO projects (title, platform, category, description, tags, accent, image_url, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [p.title, p.platform, p.category, p.description, p.tags, p.accent, p.image_url, p.sort_order]
    );
  }

  for (const s of seedData.services) {
    await db.query(
      'INSERT INTO services (title, description, price, features, icon, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
      [s.title, s.description, s.price, s.features, s.icon, s.sort_order]
    );
  }
}

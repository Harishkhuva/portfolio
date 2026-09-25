import { createClient } from '@libsql/client';
import { seedData } from '../src/db/seed';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function seedDatabase() {
  console.log('Connecting to Turso...');

  // Safety check: don't overwrite existing database data.
  const existing = await db.execute(
    'SELECT COUNT(*) AS count FROM profile'
  );

  const profileCount = Number(existing.rows[0]?.count ?? 0);

  if (profileCount > 0) {
    console.log(
      '⚠️ Turso already contains profile data. Seeding cancelled to prevent overwriting.'
    );
    process.exit(0);
  }

  console.log('Seeding settings...');

  await db.execute({
    sql: `
      INSERT INTO settings (
        id,
        theme_color,
        color_mode
      )
      VALUES (?, ?, ?)
    `,
    args: [
      1,
      seedData.settings.theme_color,
      seedData.settings.color_mode,
    ],
  });

  console.log('Seeding profile...');

  await db.execute({
    sql: `
      INSERT INTO profile (
        id,
        name,
        headline,
        subheadline,
        bio,
        email,
        phone,
        location,
        years_exp,
        projects_count,
        available
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    args: [
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
      seedData.profile.available ? 1 : 0,
    ],
  });

  console.log('Seeding skills...');

  for (const skill of seedData.skills) {
    await db.execute({
      sql: `
        INSERT INTO skills (
          text,
          sort_order
        )
        VALUES (?, ?)
      `,
      args: [
        skill.text,
        skill.sort_order,
      ],
    });
  }

  console.log('Seeding platforms...');

  for (const platform of seedData.platforms) {
    await db.execute({
      sql: `
        INSERT INTO platforms (
          name,
          count,
          glyph,
          color_class,
          bg_class,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        platform.name,
        platform.count,
        platform.glyph,
        platform.color_class,
        platform.bg_class,
        platform.sort_order,
      ],
    });
  }

  console.log('Seeding projects...');

  for (const project of seedData.projects) {
    await db.execute({
      sql: `
        INSERT INTO projects (
          title,
          platform,
          category,
          description,
          tags,
          accent,
          image_url,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
      args: [
        project.title,
        project.platform,
        project.category,
        project.description,
        project.tags,
        project.accent,
        project.image_url,
        project.sort_order,
      ],
    });
  }

  console.log('Seeding services...');

  for (const service of seedData.services) {
    await db.execute({
      sql: `
        INSERT INTO services (
          title,
          description,
          price,
          features,
          icon,
          sort_order
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      args: [
        service.title,
        service.description,
        service.price,
        service.features,
        service.icon,
        service.sort_order,
      ],
    });
  }

  console.log('');
  console.log('========================================');
  console.log('✅ Turso database seeded successfully!');
  console.log('========================================');
}

seedDatabase().catch((error) => {
  console.error('❌ Database seeding failed:');
  console.error(error);
  process.exit(1);
});
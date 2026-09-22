import { createContext, useContext, useCallback, useState, type ReactNode } from 'react';
import { getDB } from './database';
import { applyTheme } from './themes';
import type { Profile, Settings, Skill, PlatformRow, ProjectRow, ServiceRow, PortfolioData } from './types';

interface DBContextValue extends PortfolioData {
  refresh: () => Promise<void>;
  updateProfile: (p: Partial<Profile>) => Promise<void>;
  updateSettings: (s: Partial<Settings>) => Promise<void>;
  addSkill: (text: string) => Promise<void>;
  updateSkill: (id: number, text: string) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;
  addPlatform: (p: Omit<PlatformRow, 'id'>) => Promise<void>;
  updatePlatform: (id: number, p: Partial<PlatformRow>) => Promise<void>;
  deletePlatform: (id: number) => Promise<void>;
  addProject: (p: Omit<ProjectRow, 'id'>) => Promise<void>;
  updateProject: (id: number, p: Partial<ProjectRow>) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;
  addService: (s: Omit<ServiceRow, 'id'>) => Promise<void>;
  updateService: (id: number, s: Partial<ServiceRow>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
}

const DBContext = createContext<DBContextValue | null>(null);

export function useDB() {
  const ctx = useContext(DBContext);
  if (!ctx) throw new Error('useDB must be used within DBProvider');
  return ctx;
}

export function DBProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<PortfolioData>({
    profile: null,
    settings: null,
    skills: [],
    platforms: [],
    projects: [],
    services: [],
    loaded: false,
  });

  const refresh = useCallback(async () => {
    const db = await getDB();
    const [profile, settings, skills, platforms, projects, services] = await Promise.all([
      db.query<Profile>('SELECT * FROM profile WHERE id = 1'),
      db.query<Settings>('SELECT * FROM settings WHERE id = 1'),
      db.query<Skill>('SELECT * FROM skills ORDER BY sort_order'),
      db.query<PlatformRow>('SELECT * FROM platforms ORDER BY sort_order'),
      db.query<ProjectRow>('SELECT * FROM projects ORDER BY sort_order'),
      db.query<ServiceRow>('SELECT * FROM services ORDER BY sort_order'),
    ]);

    const settingsRow = settings.rows[0] ?? null;
    if (settingsRow) {
      applyTheme(settingsRow.theme_color, settingsRow.color_mode);
    }

    setData({
      profile: profile.rows[0] ?? null,
      settings: settingsRow,
      skills: skills.rows,
      platforms: platforms.rows,
      projects: projects.rows,
      services: services.rows,
      loaded: true,
    });
  }, []);

  // Initialize on mount
  if (!data.loaded && !data.profile) {
    refresh();
  }

  const updateProfile = async (p: Partial<Profile>) => {
    const db = await getDB();
    const keys = Object.keys(p);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map((k) => (p as Record<string, unknown>)[k]);
    await db.query(`UPDATE profile SET ${setClause} WHERE id = 1`, values);
    await refresh();
  };

  const updateSettings = async (s: Partial<Settings>) => {
    const db = await getDB();
    const keys = Object.keys(s);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map((k) => (s as Record<string, unknown>)[k]);
    await db.query(`UPDATE settings SET ${setClause} WHERE id = 1`, values);
    await refresh();
  };

  const addSkill = async (text: string) => {
    const db = await getDB();
    const max = await db.query<{ m: number }>('SELECT COALESCE(MAX(sort_order), -1) as m FROM skills');
    await db.query('INSERT INTO skills (text, sort_order) VALUES ($1, $2)', [text, max.rows[0].m + 1]);
    await refresh();
  };

  const updateSkill = async (id: number, text: string) => {
    const db = await getDB();
    await db.query('UPDATE skills SET text = $1 WHERE id = $2', [text, id]);
    await refresh();
  };

  const deleteSkill = async (id: number) => {
    const db = await getDB();
    await db.query('DELETE FROM skills WHERE id = $1', [id]);
    await refresh();
  };

  const addPlatform = async (p: Omit<PlatformRow, 'id'>) => {
    const db = await getDB();
    const max = await db.query<{ m: number }>('SELECT COALESCE(MAX(sort_order), -1) as m FROM platforms');
    await db.query(
      'INSERT INTO platforms (name, count, glyph, color_class, bg_class, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
      [p.name, p.count, p.glyph, p.color_class, p.bg_class, max.rows[0].m + 1]
    );
    await refresh();
  };

  const updatePlatform = async (id: number, p: Partial<PlatformRow>) => {
    const db = await getDB();
    const keys = Object.keys(p);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map((k) => (p as Record<string, unknown>)[k]);
    await db.query(`UPDATE platforms SET ${setClause} WHERE id = $${keys.length + 1}`, [...values, id]);
    await refresh();
  };

  const deletePlatform = async (id: number) => {
    const db = await getDB();
    await db.query('DELETE FROM platforms WHERE id = $1', [id]);
    await refresh();
  };

  const addProject = async (p: Omit<ProjectRow, 'id'>) => {
    const db = await getDB();
    const max = await db.query<{ m: number }>('SELECT COALESCE(MAX(sort_order), -1) as m FROM projects');
    await db.query(
      'INSERT INTO projects (title, platform, category, description, tags, accent, image_url, sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',
      [p.title, p.platform, p.category, p.description, p.tags, p.accent, p.image_url, max.rows[0].m + 1]
    );
    await refresh();
  };

  const updateProject = async (id: number, p: Partial<ProjectRow>) => {
    const db = await getDB();
    const keys = Object.keys(p);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map((k) => (p as Record<string, unknown>)[k]);
    await db.query(`UPDATE projects SET ${setClause} WHERE id = $${keys.length + 1}`, [...values, id]);
    await refresh();
  };

  const deleteProject = async (id: number) => {
    const db = await getDB();
    await db.query('DELETE FROM projects WHERE id = $1', [id]);
    await refresh();
  };

  const addService = async (s: Omit<ServiceRow, 'id'>) => {
    const db = await getDB();
    const max = await db.query<{ m: number }>('SELECT COALESCE(MAX(sort_order), -1) as m FROM services');
    await db.query(
      'INSERT INTO services (title, description, price, features, icon, sort_order) VALUES ($1,$2,$3,$4,$5,$6)',
      [s.title, s.description, s.price, s.features, s.icon, max.rows[0].m + 1]
    );
    await refresh();
  };

  const updateService = async (id: number, s: Partial<ServiceRow>) => {
    const db = await getDB();
    const keys = Object.keys(s);
    if (keys.length === 0) return;
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
    const values = keys.map((k) => (s as Record<string, unknown>)[k]);
    await db.query(`UPDATE services SET ${setClause} WHERE id = $${keys.length + 1}`, [...values, id]);
    await refresh();
  };

  const deleteService = async (id: number) => {
    const db = await getDB();
    await db.query('DELETE FROM services WHERE id = $1', [id]);
    await refresh();
  };

  const value: DBContextValue = {
    ...data,
    refresh,
    updateProfile,
    updateSettings,
    addSkill,
    updateSkill,
    deleteSkill,
    addPlatform,
    updatePlatform,
    deletePlatform,
    addProject,
    updateProject,
    deleteProject,
    addService,
    updateService,
    deleteService,
  };

  return <DBContext.Provider value={value}>{children}</DBContext.Provider>;
}

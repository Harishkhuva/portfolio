import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { applyTheme } from './themes';

import type {
  Profile,
  Settings,
  Skill,
  PlatformRow,
  ProjectRow,
  ServiceRow,
  PortfolioData,
} from './types';

interface DBContextValue extends PortfolioData {
  refresh: () => Promise<void>;

  updateProfile: (p: Partial<Profile>) => Promise<void>;
  updateSettings: (s: Partial<Settings>) => Promise<void>;

  addSkill: (text: string) => Promise<void>;
  updateSkill: (id: number, text: string) => Promise<void>;
  deleteSkill: (id: number) => Promise<void>;

  addPlatform: (p: Omit<PlatformRow, 'id'>) => Promise<void>;
  updatePlatform: (
    id: number,
    p: Partial<PlatformRow>
  ) => Promise<void>;
  deletePlatform: (id: number) => Promise<void>;

  addProject: (p: Omit<ProjectRow, 'id'>) => Promise<void>;
  updateProject: (
    id: number,
    p: Partial<ProjectRow>
  ) => Promise<void>;
  deleteProject: (id: number) => Promise<void>;

  addService: (s: Omit<ServiceRow, 'id'>) => Promise<void>;
  updateService: (
    id: number,
    s: Partial<ServiceRow>
  ) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
}

const DBContext = createContext<DBContextValue | null>(null);

export function useDB() {
  const ctx = useContext(DBContext);

  if (!ctx) {
    throw new Error('useDB must be used within DBProvider');
  }

  return ctx;
}

async function apiRequest(
  url: string,
  options: RequestInit = {}
) {
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data?.error || `API request failed: ${response.status}`
    );
  }

  return data;
}

export function DBProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState<PortfolioData>({
    profile: null,
    settings: null,
    skills: [],
    platforms: [],
    projects: [],
    services: [],
    loaded: false,
  });

  /*
   * Load portfolio data from Turso through the API.
   */
  const refresh = useCallback(async () => {
    const result = await apiRequest('/api/portfolio', {
      method: 'GET',
    });

    const settings = result.settings as Settings | null;

    if (settings) {
      applyTheme(
        settings.theme_color,
        settings.color_mode
      );
    }

    setData({
      profile: result.profile ?? null,
      settings: result.settings ?? null,
      skills: result.skills ?? [],
      platforms: result.platforms ?? [],
      projects: result.projects ?? [],
      services: result.services ?? [],
      loaded: true,
    });
  }, []);

  /*
   * Initial load.
   */
  useEffect(() => {
    refresh().catch((error) => {
      console.error('Failed to load portfolio data:', error);

      setData((current) => ({
        ...current,
        loaded: true,
      }));
    });
  }, [refresh]);

  /*
   * Profile
   */
  const updateProfile = async (
    p: Partial<Profile>
  ) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        table: 'profile',
        id: 1,
        data: p,
      }),
    });

    await refresh();
  };

  /*
   * Settings
   */
  const updateSettings = async (
    s: Partial<Settings>
  ) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        table: 'settings',
        id: 1,
        data: s,
      }),
    });

    await refresh();
  };

  /*
   * Skills
   */
  const addSkill = async (text: string) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'addSkill',
        data: {
          text,
        },
      }),
    });

    await refresh();
  };

  const updateSkill = async (
    id: number,
    text: string
  ) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        table: 'skills',
        id,
        data: {
          text,
        },
      }),
    });

    await refresh();
  };

  const deleteSkill = async (id: number) => {
    await apiRequest('/api/portfolio', {
      method: 'DELETE',
      body: JSON.stringify({
        table: 'skills',
        id,
      }),
    });

    await refresh();
  };

  /*
   * Platforms
   */
  const addPlatform = async (
    p: Omit<PlatformRow, 'id'>
  ) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'addPlatform',
        data: p,
      }),
    });

    await refresh();
  };

  const updatePlatform = async (
    id: number,
    p: Partial<PlatformRow>
  ) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        table: 'platforms',
        id,
        data: p,
      }),
    });

    await refresh();
  };

  const deletePlatform = async (id: number) => {
    await apiRequest('/api/portfolio', {
      method: 'DELETE',
      body: JSON.stringify({
        table: 'platforms',
        id,
      }),
    });

    await refresh();
  };

  /*
   * Projects
   */
  const addProject = async (
    p: Omit<ProjectRow, 'id'>
  ) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'addProject',
        data: p,
      }),
    });

    await refresh();
  };

  const updateProject = async (
    id: number,
    p: Partial<ProjectRow>
  ) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        table: 'projects',
        id,
        data: p,
      }),
    });

    await refresh();
  };

  const deleteProject = async (id: number) => {
    await apiRequest('/api/portfolio', {
      method: 'DELETE',
      body: JSON.stringify({
        table: 'projects',
        id,
      }),
    });

    await refresh();
  };

  /*
   * Services
   */
  const addService = async (
    s: Omit<ServiceRow, 'id'>
  ) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'addService',
        data: s,
      }),
    });

    await refresh();
  };

  const updateService = async (
    id: number,
    s: Partial<ServiceRow>
  ) => {
    await apiRequest('/api/portfolio', {
      method: 'POST',
      body: JSON.stringify({
        action: 'update',
        table: 'services',
        id,
        data: s,
      }),
    });

    await refresh();
  };

  const deleteService = async (id: number) => {
    await apiRequest('/api/portfolio', {
      method: 'DELETE',
      body: JSON.stringify({
        table: 'services',
        id,
      }),
    });

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

  return (
    <DBContext.Provider value={value}>
      {children}
    </DBContext.Provider>
  );
}
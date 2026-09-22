import type { ThemeColor, ColorMode } from './themes';

export interface Settings {
  id: number;
  theme_color: ThemeColor;
  color_mode: ColorMode;
}

export interface Profile {
  id: number;
  name: string;
  headline: string;
  subheadline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  years_exp: string;
  projects_count: string;
  available: boolean;
}

export interface Skill {
  id: number;
  text: string;
  sort_order: number;
}

export interface PlatformRow {
  id: number;
  name: string;
  count: string;
  glyph: string;
  color_class: string;
  bg_class: string;
  sort_order: number;
}

export interface ProjectRow {
  id: number;
  title: string;
  platform: string;
  category: string;
  description: string;
  tags: string;
  accent: string;
  image_url: string;
  sort_order: number;
}

export interface ServiceRow {
  id: number;
  title: string;
  description: string;
  price: string;
  features: string;
  icon: string;
  sort_order: number;
}

export interface PortfolioData {
  profile: Profile | null;
  settings: Settings | null;
  skills: Skill[];
  platforms: PlatformRow[];
  projects: ProjectRow[];
  services: ServiceRow[];
  loaded: boolean;
}

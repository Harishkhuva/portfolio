export type ThemeColor = 'teal' | 'blue' | 'red' | 'green' | 'amber' | 'pink';
export type ColorMode = 'light' | 'dark';

export interface ThemeShades {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export type Themes = Record<ThemeColor, ThemeShades>;

export const themes: Themes = {
  teal: {
    50: '#effcfb', 100: '#cbf7f3', 200: '#97eee8', 300: '#5cdcd4', 400: '#2bbfb8',
    500: '#179e98', 600: '#0f7d79', 700: '#106361', 800: '#114f4e', 900: '#124140', 
  },
  blue: {
    50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 300: '#93c5fd', 400: '#60a5fa',
    500: '#3b82f6', 600: '#2563eb', 700: '#1d4ed8', 800: '#1e40af', 900: '#1e3a8a',
  },
  red: {
    50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 300: '#fca5a5', 400: '#f87171',
    500: '#ef4444', 600: '#dc2626', 700: '#b91c1c', 800: '#991b1b', 900: '#7f1d1d',
  },
  green: {
    50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 300: '#86efac', 400: '#4ade80',
    500: '#22c55e', 600: '#16a34a', 700: '#15803d', 800: '#166534', 900: '#14532d',
  },
  amber: {
    50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 300: '#fcd34d', 400: '#fbbf24',
    500: '#f59e0b', 600: '#d97706', 700: '#b45309', 800: '#92400e', 900: '#78350f',
  },
  pink: {
    50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 300: '#f9a8d4', 400: '#f472b6',
    500: '#ec4899', 600: '#db2777', 700: '#be185d', 800: '#9d174d', 900: '#831843',
  },
};

export const themeNames: Record<ThemeColor, string> = {
  teal: 'Teal',
  blue: 'Blue',
  red: 'Red',
  green: 'Green',
  amber: 'Amber',
  pink: 'Pink',
};

export function applyTheme(color: ThemeColor, mode: ColorMode) {
  const root = document.documentElement;
  const shades = themes[color];

  for (const key of Object.keys(shades) as unknown as (keyof ThemeShades)[]) {
    root.style.setProperty(`--brand-${key}`, shades[key]);
  }

  if (mode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

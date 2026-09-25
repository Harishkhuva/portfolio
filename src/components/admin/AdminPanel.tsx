import { useState, useEffect, type ReactNode } from 'react';
import {
  Lock,
  LayoutDashboard,
  User,
  ListChecks,
  Layers,
  Briefcase,
  Globe,
  Palette,
  LogOut,
  Menu,
  X,
  Eye,
} from 'lucide-react';
import { useDB } from '@/db/DBContext';
import ProfileEditor from './editors/ProfileEditor';
import SkillsEditor from './editors/SkillsEditor';
import ProjectsEditor from './editors/ProjectsEditor';
import ServicesEditor from './editors/ServicesEditor';
import PlatformsEditor from './editors/PlatformsEditor';
import ThemeEditor from './editors/ThemeEditor';


type Tab = 'dashboard' | 'profile' | 'skills' | 'projects' | 'services' | 'platforms' | 'theme';

const navItems: { id: Tab; label: string; icon: ReactNode }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
  { id: 'profile', label: 'Profile', icon: <User className="h-4 w-4" /> },
  { id: 'skills', label: 'Skills', icon: <ListChecks className="h-4 w-4" /> },
  { id: 'projects', label: 'Projects', icon: <Briefcase className="h-4 w-4" /> },
  { id: 'services', label: 'Services', icon: <Globe className="h-4 w-4" /> },
  { id: 'platforms', label: 'Platforms', icon: <Layers className="h-4 w-4" /> },
  { id: 'theme', label: 'Theme', icon: <Palette className="h-4 w-4" /> },
];

export default function AdminPanel() {
  const [authed, setAuthed] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    fetch('/api/auth', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        setAuthed(data.authenticated === true);
      })
      .catch(() => {
        setAuthed(false);
      })
      .finally(() => {
        setCheckingAuth(false);
      });
  }, []);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [tab]);

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-subtle)]">
        <div className="text-sm text-ink-500">
          Checking admin access...
        </div>
      </div>
    );
  }

  if (!authed) {
    return <PasswordGate onSuccess={() => setAuthed(true)} />;
  }
  return (
    <div className="min-h-screen bg-[var(--bg-subtle)]">
      {/* Top bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-ink-200 bg-[var(--bg-card)] px-5 py-3.5 lg:px-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-ink-200 text-ink-700 lg:hidden"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
            <LayoutDashboard className="h-4 w-4" />
          </span>
          <div>
            <h1 className="font-display text-sm font-bold text-ink-900">Admin Panel</h1>
            <p className="text-xs text-ink-400">Harish Khuva Portfolio</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/"
            className="rounded-full bg-[var(--bg-subtle)] px-4 py-2 text-sm font-semibold text-ink-600 ring-1 ring-ink-200 transition-colors hover:bg-ink-100 sm:flex"
          >
            <Eye className="h-4 w-4" />
            View Site
          </a>
          <button
            onClick={() => {
              const handleLogout = async () => {
                await fetch('/api/auth', {
                  method: 'DELETE',
                  credentials: 'include',
                });

                setAuthed(false);
              };
              setAuthed(false);
            }}
            className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 ring-1 ring-red-200 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'fixed inset-y-0 left-0 z-40 mt-14 w-64' : 'hidden'
          } w-64 shrink-0 border-r border-ink-200 bg-[var(--bg-card)] p-4 lg:sticky lg:top-14 lg:block lg:h-[calc(100vh-3.5rem)]`}
        >
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                  tab === item.id
                    ? 'bg-brand-600 text-white shadow-soft'
                    : 'text-ink-600 hover:bg-ink-50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-ink-950/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content */}
        <main className="flex-1 p-5 lg:p-8">
          {tab === 'dashboard' && <Dashboard onNavigate={setTab} />}
          {tab === 'profile' && <ProfileEditor />}
          {tab === 'skills' && <SkillsEditor />}
          {tab === 'projects' && <ProjectsEditor />}
          {tab === 'services' && <ServicesEditor />}
          {tab === 'platforms' && <PlatformsEditor />}
          {tab === 'theme' && <ThemeEditor />}
        </main>
      </div>
    </div>
  );
}

function PasswordGate({ onSuccess }: { onSuccess: () => void }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  setError(false);

  try {
    const response = await fetch('/api/auth', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: pw,
          }),
        });

        const data = await response.json();

        if (response.ok && data.authenticated === true) {
          setPw('');
          onSuccess();
        } else {
          setError(true);
          setPw('');
        }
      } catch {
        setError(true);
      }
    };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-950 px-5">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #2bbfb8 1px, transparent 1px), linear-gradient(to bottom, #2bbfb8 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lift">
            <Lock className="h-7 w-7" />
          </span>
          <h1 className="mt-4 font-display text-2xl font-extrabold text-white">Admin Access</h1>
          <p className="mt-1 text-sm text-ink-400">Enter your password to manage portfolio content</p>
        </div>
        <form onSubmit={handleSubmit} className="rounded-3xl bg-white p-6 shadow-lift">
          <label className="mb-1.5 block text-xs font-semibold text-ink-600">Password</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => {
              setPw(e.target.value);
              setError(false);
            }}
            autoFocus
            className={`w-full rounded-xl border-0 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-800 ring-1 transition-all focus:bg-white focus:ring-2 focus:outline-none ${
              error ? 'ring-red-400 focus:ring-red-500' : 'ring-ink-200 focus:ring-brand-500'
            }`}
            placeholder="Enter password"
          />
          {error && <p className="mt-2 text-xs font-semibold text-red-600">Incorrect password. Try again.</p>}
          <button type="submit" className="btn-primary mt-5 w-full">
            Unlock Admin Panel
          </button>
          <a href="/" className="mt-3 block text-center text-xs font-semibold text-ink-400 hover:text-brand-600">
            ← Back to site
          </a>
        </form>
      </div>
    </div>
  );
}

function Dashboard({ onNavigate }: { onNavigate: (t: Tab) => void }) {
  const { profile, skills, projects, services, platforms } = useDB();

  const stats = [
    { label: 'Projects', count: projects.length, icon: <Briefcase className="h-5 w-5" />, tab: 'projects' as Tab, color: 'bg-brand-50 text-brand-600' },
    { label: 'Services', count: services.length, icon: <Globe className="h-5 w-5" />, tab: 'services' as Tab, color: 'bg-blue-50 text-blue-600' },
    { label: 'Platforms', count: platforms.length, icon: <Layers className="h-5 w-5" />, tab: 'platforms' as Tab, color: 'bg-violet-50 text-violet-600' },
    { label: 'Skills', count: skills.length, icon: <ListChecks className="h-5 w-5" />, tab: 'skills' as Tab, color: 'bg-emerald-50 text-emerald-600' },
  ];

  return (
    <div>
      <h2 className="font-display text-2xl font-extrabold text-ink-900">Welcome back{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''}</h2>
      <p className="mt-1 text-sm text-ink-500">Manage your portfolio content from the panels below.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onNavigate(s.tab)}
            className="group rounded-2xl bg-[var(--bg-card)] p-5 text-left ring-1 ring-ink-100 shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>{s.icon}</span>
            <div className="mt-3 font-display text-3xl font-extrabold text-ink-900">{s.count}</div>
            <div className="text-sm font-semibold text-ink-400">{s.label}</div>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-2xl bg-[var(--bg-card)] p-6 ring-1 ring-ink-100 shadow-card">
        <h3 className="font-display text-lg font-bold text-ink-900">Quick Actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={() => onNavigate('profile')} className="btn-secondary text-xs">Edit Profile</button>
          <button onClick={() => onNavigate('projects')} className="btn-secondary text-xs">Add Project</button>
          <button onClick={() => onNavigate('services')} className="btn-secondary text-xs">Manage Services</button>
          <button onClick={() => onNavigate('theme')} className="btn-secondary text-xs">Change Theme</button>
          <button onClick={() => onNavigate('skills')} className="btn-secondary text-xs">Update Skills</button>
        </div>
      </div>
    </div>
  );
}

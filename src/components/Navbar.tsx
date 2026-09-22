import { useEffect, useState } from 'react';
import { Menu, X, Code2, Sun, Moon } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import { applyTheme, type ColorMode } from '@/db/themes';

const links = [
  { label: 'Portfolio', href: '#portfolio' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const { settings, updateSettings } = useDB();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const mode: ColorMode = settings?.color_mode ?? 'light';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMode = () => {
    const newMode: ColorMode = mode === 'light' ? 'dark' : 'light';
    applyTheme(settings?.theme_color ?? 'teal', newMode);
    updateSettings({ color_mode: newMode });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[var(--bg-base)]/90 backdrop-blur-md shadow-soft' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <a href="#home" className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white shadow-soft">
            <Code2 className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight text-ink-900">
            Harish<span className="text-brand-600">Khuva</span>
          </span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-ink-600 transition-colors duration-200 hover:bg-ink-50 hover:text-brand-700"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={toggleMode}
            className="flex h-10 w-10 items-center justify-center rounded-full text-ink-600 ring-1 ring-ink-200 transition-colors hover:bg-ink-50 hover:text-brand-700"
            aria-label="Toggle dark mode"
          >
            {mode === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <a href="#contact" className="btn-primary ml-2">
            Hire Me
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={toggleMode}
            className="flex h-10 w-10 items-center justify-center rounded-xl text-ink-600 ring-1 ring-ink-200"
            aria-label="Toggle dark mode"
          >
            {mode === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-ink-200 text-ink-800"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden transition-all duration-300 md:hidden ${
          open ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="mx-4 mb-4 rounded-2xl bg-[var(--bg-card)] p-4 shadow-lift ring-1 ring-ink-100">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-semibold text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn-primary mt-2 w-full"
          >
            Hire Me
          </a>
        </div>
      </div>
    </header>
  );
}

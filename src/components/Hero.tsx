import { ArrowRight, Sparkles, Zap, Code2, Layers, GitBranch } from 'lucide-react';
import { useDB } from '@/db/DBContext';

export default function Hero() {
  const { profile, platforms } = useDB();

  const name = profile?.name ?? 'Harish Khuva';
  const headline = profile?.headline ?? 'Multi-Platform Web Developer';
  const subheadline = profile?.subheadline ?? '3+ years building high-performing websites and stores — 40+ WordPress sites, 10+ Shopify stores, and custom GHL API integrations.';
  const yearsExp = profile?.years_exp ?? '3+';
  const projectsCount = profile?.projects_count ?? '50+';
  const available = profile?.available ?? true;
  const platformCount = platforms.length || 5;

  return (
    <section id="home" className="relative overflow-hidden bg-gradient-to-b from-brand-50/60 via-[var(--bg-base)] to-[var(--bg-base)] pt-28 pb-20 lg:pt-36 lg:pb-28">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #0f7d79 1px, transparent 1px), linear-gradient(to bottom, #0f7d79 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-40 h-80 w-80 rounded-full bg-brand-300/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:px-8">
        <div className="animate-fade-up">
          {available && (
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200">
              <Sparkles className="h-3.5 w-3.5" />
              Available for freelance projects
            </div>
          )}

          <h1 className="mt-6 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-900 sm:text-5xl lg:text-6xl">
            {name}
            <span className="block bg-gradient-to-r from-brand-600 via-brand-500 to-brand-700 bg-clip-text text-transparent">
              {headline}
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-500">{subheadline}</p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#portfolio" className="btn-primary">
              View Portfolio
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href="#contact" className="btn-secondary">
              Hire Me
            </a>
          </div>

          <div className="mt-10 flex items-center gap-6">
            <div>
              <div className="font-display text-3xl font-extrabold text-brand-600">{yearsExp}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">Years Exp.</div>
            </div>
            <div className="h-10 w-px bg-ink-200" />
            <div>
              <div className="font-display text-3xl font-extrabold text-brand-600">{projectsCount}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">Projects Done</div>
            </div>
            <div className="h-10 w-px bg-ink-200" />
            <div>
              <div className="font-display text-3xl font-extrabold text-brand-600">{platformCount}</div>
              <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">Platforms</div>
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <HeroGraphic />
        </div>
      </div>
    </section>
  );
}

function HeroGraphic() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-full border-2 border-dashed border-brand-200 animate-spin-slow" />
      <div className="absolute inset-8 rounded-full border border-brand-100" />
      <div className="absolute inset-16 rounded-full bg-brand-100/40 animate-pulse-ring" />

      <div className="absolute inset-20 flex flex-col items-center justify-center rounded-3xl bg-[var(--bg-card)] shadow-lift ring-1 ring-ink-100">
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-soft">
          <Code2 className="h-8 w-8" />
        </span>
        <span className="mt-4 font-display text-sm font-bold text-ink-900">Full-Stack Web Dev</span>
        <span className="mt-1 text-xs text-ink-400">WordPress · Shopify · GHL</span>
      </div>

      <FloatBadge className="left-0 top-12" delay="0s" icon={<Layers className="h-4 w-4 text-brand-600" />} label="WordPress" sub="40+ sites" />
      <FloatBadge className="right-0 top-8" delay="1s" icon={<Zap className="h-4 w-4 text-emerald-600" />} label="Shopify" sub="10+ stores" />
      <FloatBadge className="left-4 bottom-10" delay="2s" icon={<GitBranch className="h-4 w-4 text-violet-600" />} label="GHL API" sub="Integrations" />
      <FloatBadge className="right-6 bottom-16" delay="0.5s" icon={<Code2 className="h-4 w-4 text-blue-600" />} label="Webflow" sub="5+ builds" />
    </div>
  );
}

function FloatBadge({
  className,
  delay,
  icon,
  label,
  sub,
}: {
  className: string;
  delay: string;
  icon: React.ReactNode;
  label: string;
  sub: string;
}) {
  return (
    <div
      className={`absolute ${className} flex items-center gap-2.5 rounded-2xl bg-[var(--bg-card)] px-3.5 py-2.5 shadow-lift ring-1 ring-ink-100 animate-float-slow`}
      style={{ animationDelay: delay }}
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink-50">{icon}</span>
      <div>
        <div className="text-xs font-bold text-ink-900">{label}</div>
        <div className="text-[10px] text-ink-400">{sub}</div>
      </div>
    </div>
  );
}

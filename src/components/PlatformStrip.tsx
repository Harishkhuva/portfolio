import { useDB } from '@/db/DBContext';
import { useReveal } from '@/hooks/useReveal';

export default function PlatformStrip() {
  const { platforms } = useDB();
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section className="border-y border-ink-100 bg-[var(--bg-subtle)] py-10">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} mx-auto max-w-7xl px-5 lg:px-8`}>
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-ink-400">
          Platforms I Build On
        </p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {platforms.map((p, i) => (
            <div
              key={p.id}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-[var(--bg-card)] px-4 py-6 ring-1 ring-ink-100 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
              style={{ transitionDelay: `${i * 60}ms` }}
            >
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${p.bg_class} ${p.color_class} font-display text-2xl font-extrabold transition-transform duration-300 group-hover:scale-110`}>
                {p.glyph}
              </div>
              <div className="text-center">
                <div className="text-sm font-bold text-ink-900">{p.name}</div>
                <span className={`mt-1 inline-block rounded-full ${p.bg_class} ${p.color_class} px-2.5 py-0.5 text-xs font-bold`}>
                  {p.count} projects
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

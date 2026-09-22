import { useState, useMemo } from 'react';
import { ArrowUpRight, Filter } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import { useReveal } from '@/hooks/useReveal';

export default function Portfolio() {
  const { projects } = useDB();
  const [filter, setFilter] = useState<string>('All');
  const { ref, visible } = useReveal<HTMLDivElement>();

  const filterOptions = useMemo(() => {
    const set = new Set(projects.map((p) => p.platform));
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filtered = filter === 'All' ? projects : projects.filter((p) => p.platform === filter);

  return (
    <section id="portfolio" className="bg-[var(--bg-base)] py-20 lg:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} mx-auto max-w-7xl px-5 lg:px-8`}>
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">
            <Filter className="h-3.5 w-3.5" />
            Selected Work
          </span>
          <h2 className="section-title mt-3">Portfolio Highlights</h2>
          <p className="mt-4 text-lg text-ink-500">
            A selection of projects across WordPress, Shopify, Webflow, and GoHighLevel — filter by platform to explore.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`filter-chip ${
                filter === opt
                  ? 'bg-brand-600 text-white shadow-soft'
                  : 'bg-ink-50 text-ink-600 hover:bg-ink-100'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((project, i) => {
            const tags = project.tags.split(',').map((t) => t.trim()).filter(Boolean);
            return (
              <article
                key={project.id}
                className="group overflow-hidden rounded-2xl bg-[var(--bg-card)] ring-1 ring-ink-100 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <div className={`relative h-44 overflow-hidden bg-gradient-to-br ${project.accent}`}>
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div
                      className="absolute inset-0 opacity-20"
                      style={{
                        backgroundImage:
                          'linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                      }}
                    />
                  )}
                  <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-ink-800 backdrop-blur-sm">
                    {project.platform}
                  </div>
                  <div className="absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-ink-700 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-0 rotate-45">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-display text-3xl font-extrabold text-white/30">{project.category}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-display text-base font-bold text-ink-900 transition-colors group-hover:text-brand-700">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500">{project.description}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {tags.map((tag) => (
                      <span key={tag} className="rounded-md bg-ink-50 px-2.5 py-1 text-xs font-semibold text-ink-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

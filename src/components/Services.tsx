import { Globe, ShoppingBag, Workflow, Layout, Check, ArrowRight } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import { useReveal } from '@/hooks/useReveal';

const iconMap: Record<string, React.ReactNode> = {
  globe: <Globe className="h-6 w-6" />,
  'shopping-bag': <ShoppingBag className="h-6 w-6" />,
  workflow: <Workflow className="h-6 w-6" />,
  layout: <Layout className="h-6 w-6" />,
};

export default function Services() {
  const { services } = useDB();
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="services" className="bg-[var(--bg-subtle)] py-20 lg:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} mx-auto max-w-7xl px-5 lg:px-8`}>
        <div className="mx-auto max-w-2xl text-center">
          <span className="section-eyebrow">
            <Layout className="h-3.5 w-3.5" />
            What I Offer
          </span>
          <h2 className="section-title mt-3">Services & Pricing</h2>
          <p className="mt-4 text-lg text-ink-500">
            From WordPress builds to GHL API integrations — every project is built clean, fast, and conversion-ready.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const features = s.features.split(',').map((f) => f.trim()).filter(Boolean);
            return (
              <div
                key={s.id}
                className="group relative flex flex-col rounded-2xl bg-[var(--bg-card)] p-6 ring-1 ring-ink-100 shadow-card transition-all duration-300 hover:-translate-y-2 hover:shadow-lift"
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-600 group-hover:text-white">
                  {iconMap[s.icon] ?? <Globe className="h-6 w-6" />}
                </span>
                <h3 className="mt-5 font-display text-lg font-bold text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-500">{s.description}</p>
                <ul className="mt-5 space-y-2.5">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-600">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between border-t border-ink-100 pt-5">
                  <span className="font-display text-lg font-extrabold text-brand-600">{s.price}</span>
                  <a
                    href="#contact"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-50 text-ink-600 transition-all duration-300 group-hover:bg-brand-600 group-hover:text-white"
                    aria-label={`Enquire about ${s.title}`}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

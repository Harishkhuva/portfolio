import { Mail, Phone, Send, MapPin, ArrowUpRight } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import { useReveal } from '@/hooks/useReveal';

export default function Contact() {
  const { profile, services } = useDB();
  const { ref, visible } = useReveal<HTMLDivElement>();

  const email = profile?.email ?? 'harishkhuva958@gmail.com';
  const phone = profile?.phone ?? '+91 8866390382';
  const location = profile?.location ?? 'India · Available Worldwide';

  return (
    <section id="contact" className="bg-ink-950 py-20 lg:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} mx-auto max-w-7xl px-5 lg:px-8`}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-400">
              <Send className="h-3.5 w-3.5" />
              Let's Work Together
            </span>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
              Ready to build something that converts?
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-ink-300">
              Whether it's a WordPress site, Shopify store, Webflow build, or a custom GHL API integration — let's talk about your project.
            </p>

            <div className="mt-8 space-y-4">
              <a
                href={`mailto:${email}`}
                className="group flex items-center gap-4 rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10 hover:ring-brand-400/30"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/20 text-brand-300">
                  <Mail className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">Email</div>
                  <div className="text-sm font-bold text-white">{email}</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-ink-500 transition-all duration-300 group-hover:text-brand-400 group-hover:rotate-0 rotate-45" />
              </a>

              <a
                href={`tel:${phone.replace(/\s/g, '')}`}
                className="group flex items-center gap-4 rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10 transition-all duration-300 hover:bg-white/10 hover:ring-brand-400/30"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/20 text-brand-300">
                  <Phone className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">Phone</div>
                  <div className="text-sm font-bold text-white">{phone}</div>
                </div>
                <ArrowUpRight className="h-5 w-5 text-ink-500 transition-all duration-300 group-hover:text-brand-400 group-hover:rotate-0 rotate-45" />
              </a>

              <div className="flex items-center gap-4 rounded-2xl bg-white/5 px-5 py-4 ring-1 ring-white/10">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600/20 text-brand-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">Location</div>
                  <div className="text-sm font-bold text-white">{location}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl bg-[var(--bg-card)] p-6 shadow-lift sm:p-8">
            <h3 className="font-display text-xl font-bold text-ink-900">Send a Message</h3>
            <p className="mt-1 text-sm text-ink-500">Fill in your details and I'll get back to you within 24 hours.</p>
            <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" placeholder="Your name" />
                <Field label="Email" placeholder="you@email.com" type="email" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-600">Platform</label>
                <select className="w-full rounded-xl border-0 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-800 ring-1 ring-ink-200 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none">
                  {services.map((s) => (
                    <option key={s.id}>{s.title}</option>
                  ))}
                  <option>Other / Not sure yet</option>
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-600">Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell me about your project..."
                  className="w-full resize-none rounded-xl border-0 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-800 ring-1 ring-ink-200 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                />
              </div>
              <a href={`mailto:${email}`} className="btn-primary w-full">
                Send Message
                <Send className="h-4 w-4" />
              </a>
            </form>
          </div>
        </div>
      </div>

      <footer className="mx-auto mt-16 max-w-7xl border-t border-white/10 px-5 pt-8 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white text-sm font-extrabold font-display">
              H
            </span>
            <span className="font-display text-sm font-bold text-white">
              Harish<span className="text-brand-400">Khuva</span>
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a href={`mailto:${email}`} className="text-sm font-semibold text-ink-400 transition-colors hover:text-brand-400">Email</a>
            <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-sm font-semibold text-ink-400 transition-colors hover:text-brand-400">Phone</a>
          </div>
          <p className="text-xs text-ink-500">© {new Date().getFullYear()} Harish Khuva. All rights reserved.</p>
        </div>
      </footer>
    </section>
  );
}

function Field({ label, placeholder, type = 'text' }: { label: string; placeholder: string; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border-0 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-800 ring-1 ring-ink-200 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
      />
    </div>
  );
}

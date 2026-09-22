import { Award, CheckCircle2, Briefcase } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import { useReveal } from '@/hooks/useReveal';

export default function About() {
  const { profile, skills } = useDB();
  const { ref, visible } = useReveal<HTMLDivElement>();

  const bio = profile?.bio ?? '';
  const yearsExp = profile?.years_exp ?? '3+';
  const projectsCount = profile?.projects_count ?? '50+';

  return (
    <section id="about" className="bg-[var(--bg-base)] py-20 lg:py-28">
      <div ref={ref} className={`reveal ${visible ? 'is-visible' : ''} mx-auto max-w-7xl px-5 lg:px-8`}>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="section-eyebrow">
              <Briefcase className="h-3.5 w-3.5" />
              About Me
            </span>
            <h2 className="section-title mt-3">Building digital platforms that perform</h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-500">{bio}</p>

            <div className="mt-8 flex gap-4">
              <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-50 px-6 py-5 ring-1 ring-brand-100">
                <Award className="h-7 w-7 text-brand-600" />
                <span className="mt-2 font-display text-2xl font-extrabold text-brand-700">{yearsExp}</span>
                <span className="text-xs font-semibold text-brand-600">Experience</span>
              </div>
              <div className="flex flex-col items-center justify-center rounded-2xl bg-ink-50 px-6 py-5 ring-1 ring-ink-100">
                <Briefcase className="h-7 w-7 text-ink-700" />
                <span className="mt-2 font-display text-2xl font-extrabold text-ink-800">{projectsCount}</span>
                <span className="text-xs font-semibold text-ink-500">Projects Delivered</span>
              </div>
            </div>
          </div>

          <div className="lg:pl-8">
            <h3 className="font-display text-xl font-bold text-ink-900">Core Skills</h3>
            <ul className="mt-6 space-y-4">
              {skills.map((skill) => (
                <li
                  key={skill.id}
                  className="flex items-start gap-3 rounded-xl bg-ink-50/60 px-4 py-3.5 ring-1 ring-ink-100 transition-all duration-300 hover:bg-brand-50 hover:ring-brand-200"
                >
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" />
                  <span className="text-sm font-semibold text-ink-700">{skill.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

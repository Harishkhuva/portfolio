import { useState, useEffect } from 'react';
import { Save, Check, User } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import type { Profile } from '@/db/types';

export default function ProfileEditor() {
  const { profile, updateProfile } = useDB();
  const [form, setForm] = useState<Profile | null>(profile);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  if (!form) return <div className="text-sm text-ink-400">Loading...</div>;

  const handleChange = (key: keyof Profile, value: string | boolean) => {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = async () => {
    if (!form) return;
    await updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <User className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900">Profile Settings</h2>
          <p className="text-sm text-ink-400">Update your name, headline, bio, and contact info</p>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl bg-[var(--bg-card)] p-6 ring-1 ring-ink-100 shadow-card">
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Name" value={form.name} onChange={(v) => handleChange('name', v)} />
          <FormField label="Headline" value={form.headline} onChange={(v) => handleChange('headline', v)} />
        </div>

        <FormField label="Subheadline" value={form.subheadline} onChange={(v) => handleChange('subheadline', v)} textarea />

        <FormField label="Bio" value={form.bio} onChange={(v) => handleChange('bio', v)} textarea rows={5} />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Email" value={form.email} onChange={(v) => handleChange('email', v)} />
          <FormField label="Phone" value={form.phone} onChange={(v) => handleChange('phone', v)} />
        </div>

        <div className="grid gap-5 sm:grid-cols-3">
          <FormField label="Location" value={form.location} onChange={(v) => handleChange('location', v)} />
          <FormField label="Years Experience" value={form.years_exp} onChange={(v) => handleChange('years_exp', v)} />
          <FormField label="Projects Count" value={form.projects_count} onChange={(v) => handleChange('projects_count', v)} />
        </div>

        <label className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleChange('available', !form.available)}
            className={`relative h-6 w-11 rounded-full transition-colors ${form.available ? 'bg-brand-600' : 'bg-ink-200'}`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${form.available ? 'translate-x-5' : 'translate-x-0.5'}`}
            />
          </button>
          <span className="text-sm font-semibold text-ink-700">Available for freelance projects</span>
        </label>

        <div className="flex items-center gap-3 border-t border-ink-100 pt-5">
          <button onClick={handleSave} className="btn-primary">
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  textarea,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</label>
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-none rounded-xl border-0 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-800 ring-1 ring-ink-200 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl border-0 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-800 ring-1 ring-ink-200 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
      )}
    </div>
  );
}

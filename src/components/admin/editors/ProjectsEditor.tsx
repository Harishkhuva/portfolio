import { useState } from 'react';
import { Plus, Trash2, Briefcase, X, Pencil } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import type { ProjectRow } from '@/db/types';

const platformOptions = ['WordPress', 'Shopify', 'Webflow', 'GHL', 'Wix Studio'];
const accentOptions = [
  { label: 'Teal', value: 'from-brand-400 to-brand-600' },
  { label: 'Emerald', value: 'from-emerald-400 to-teal-500' },
  { label: 'Violet', value: 'from-violet-400 to-purple-500' },
  { label: 'Blue', value: 'from-blue-400 to-indigo-500' },
  { label: 'Amber', value: 'from-amber-400 to-orange-500' },
  { label: 'Cyan', value: 'from-brand-400 to-cyan-600' },
  { label: 'Green', value: 'from-emerald-400 to-green-600' },
  { label: 'Fuchsia', value: 'from-violet-400 to-fuchsia-500' },
];

const empty: Omit<ProjectRow, 'id'> = {
  title: '',
  platform: 'WordPress',
  category: '',
  description: '',
  tags: '',
  accent: 'from-brand-400 to-brand-600',
  image_url: '',
  sort_order: 0,
};

export default function ProjectsEditor() {
  const { projects, addProject, updateProject, deleteProject } = useDB();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<ProjectRow, 'id'>>(empty);

  const openAdd = () => {
    setEditId(null);
    setForm(empty);
    setModalOpen(true);
  };

  const openEdit = (p: ProjectRow) => {
    setEditId(p.id);
    setForm({ ...p });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (editId) {
      await updateProject(editId, form);
    } else {
      await addProject(form);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Briefcase className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">Projects</h2>
            <p className="text-sm text-ink-400">{projects.length} projects in your portfolio</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {projects.map((p) => (
          <div key={p.id} className="rounded-2xl bg-[var(--bg-card)] p-4 ring-1 ring-ink-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="inline-block rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-bold text-brand-600">
                  {p.platform}
                </span>
                <h3 className="mt-2 font-display text-sm font-bold text-ink-900">{p.title}</h3>
                <p className="mt-1 text-xs text-ink-400">{p.category}</p>
              </div>
              {p.image_url ? (
                <img src={p.image_url} alt={p.title} className="h-12 w-12 shrink-0 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className={`h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br ${p.accent}`} />
              )}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-ink-500 line-clamp-2">{p.description}</p>
            <div className="mt-3 flex items-center gap-2 border-t border-ink-100 pt-3">
              <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 rounded-lg bg-ink-50 px-3 py-1.5 text-xs font-bold text-ink-600 hover:bg-ink-100">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button onClick={() => deleteProject(p.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal title={editId ? 'Edit Project' : 'Add Project'} onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Platform" value={form.platform} options={platformOptions} onChange={(v) => setForm({ ...form, platform: v })} />
              <Input label="Category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} />
            </div>
            <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
            <Input label="Image URL" value={form.image_url} onChange={(v) => setForm({ ...form, image_url: v })} />
            {form.image_url && (
              <div className="overflow-hidden rounded-xl ring-1 ring-ink-200">
                <img src={form.image_url} alt="Preview" className="h-32 w-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              </div>
            )}
            <Input label="Tags (comma separated)" value={form.tags} onChange={(v) => setForm({ ...form, tags: v })} />
            <SelectField
              label="Accent Color"
              value={form.accent}
              options={accentOptions.map((a) => a.value)}
              optionLabels={accentOptions.map((a) => a.label)}
              onChange={(v) => setForm({ ...form, accent: v })}
            />
            <div className="flex gap-3 border-t border-ink-100 pt-4">
              <button onClick={handleSave} className="btn-primary flex-1">
                {editId ? 'Save Changes' : 'Add Project'}
              </button>
              <button onClick={() => setModalOpen(false)} className="btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function Modal({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/40 p-5 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-[var(--bg-card)] p-6 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-ink-900">{title}</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-xl text-ink-500 hover:bg-ink-50">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Input({
  label,
  value,
  onChange,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
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

export function SelectField({
  label,
  value,
  options,
  optionLabels,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  optionLabels?: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink-600">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border-0 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-800 ring-1 ring-ink-200 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
      >
        {options.map((opt, i) => (
          <option key={opt} value={opt}>
            {optionLabels?.[i] ?? opt}
          </option>
        ))}
      </select>
    </div>
  );
}

import type { ReactNode } from 'react';

import { useState } from 'react';
import { Plus, Trash2, Layers, Pencil } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import type { PlatformRow } from '@/db/types';
import { Modal, Input } from './ProjectsEditor';

const colorOptions = [
  { label: 'Teal', color: 'text-brand-700', bg: 'bg-brand-50' },
  { label: 'Emerald', color: 'text-emerald-700', bg: 'bg-emerald-50' },
  { label: 'Blue', color: 'text-blue-700', bg: 'bg-blue-50' },
  { label: 'Violet', color: 'text-violet-700', bg: 'bg-violet-50' },
  { label: 'Amber', color: 'text-amber-700', bg: 'bg-amber-50' },
  { label: 'Rose', color: 'text-rose-700', bg: 'bg-rose-50' },
  { label: 'Cyan', color: 'text-cyan-700', bg: 'bg-cyan-50' },
];

const empty: Omit<PlatformRow, 'id'> = {
  name: '',
  count: '0+',
  glyph: '',
  color_class: 'text-brand-700',
  bg_class: 'bg-brand-50',
  sort_order: 0,
};

export default function PlatformsEditor() {
  const { platforms, addPlatform, updatePlatform, deletePlatform } = useDB();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<PlatformRow, 'id'>>(empty);

  const openAdd = () => {
    setEditId(null);
    setForm(empty);
    setModalOpen(true);
  };

  const openEdit = (p: PlatformRow) => {
    setEditId(p.id);
    setForm({ ...p });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim()) return;
    if (editId) {
      await updatePlatform(editId, form);
    } else {
      await addPlatform(form);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Layers className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">Platforms</h2>
            <p className="text-sm text-ink-400">{platforms.length} platforms displayed</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Platform
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {platforms.map((p) => (
          <div key={p.id} className="rounded-2xl bg-[var(--bg-card)] p-5 ring-1 ring-ink-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex items-center gap-3">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${p.bg_class} ${p.color_class} font-display text-xl font-extrabold`}>
                {p.glyph}
              </span>
              <div>
                <h3 className="font-display text-sm font-bold text-ink-900">{p.name}</h3>
                <span className={`inline-block rounded-full ${p.bg_class} ${p.color_class} px-2 py-0.5 text-xs font-bold`}>
                  {p.count} projects
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-ink-100 pt-3">
              <button onClick={() => openEdit(p)} className="flex items-center gap-1.5 rounded-lg bg-ink-50 px-3 py-1.5 text-xs font-bold text-ink-600 hover:bg-ink-100">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button onClick={() => deletePlatform(p.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal title={editId ? 'Edit Platform' : 'Add Platform'} onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            <Input label="Platform Name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Count (e.g. 40+)" value={form.count} onChange={(v) => setForm({ ...form, count: v })} />
              <Input label="Glyph (single letter)" value={form.glyph} onChange={(v) => setForm({ ...form, glyph: v })} />
            </div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-600">Color Theme</label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.label}
                    onClick={() => setForm({ ...form, color_class: c.color, bg_class: c.bg })}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold ring-2 transition-all ${
                      form.color_class === c.color ? 'ring-brand-500' : 'ring-transparent'
                    } ${c.bg} ${c.color}`}
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/60 text-sm font-extrabold">
                      {form.glyph || 'A'}
                    </span>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 border-t border-ink-100 pt-4">
              <button onClick={handleSave} className="btn-primary flex-1">
                {editId ? 'Save Changes' : 'Add Platform'}
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

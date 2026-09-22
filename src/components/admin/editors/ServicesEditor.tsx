import { useState } from 'react';
import { Plus, Trash2, Globe, Pencil, X } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import type { ServiceRow } from '@/db/types';
import { Modal, Input } from './ProjectsEditor';

const iconOptions = ['globe', 'shopping-bag', 'workflow', 'layout'];

const empty: Omit<ServiceRow, 'id'> = {
  title: '',
  description: '',
  price: 'From $',
  features: '',
  icon: 'globe',
  sort_order: 0,
};

export default function ServicesEditor() {
  const { services, addService, updateService, deleteService } = useDB();
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<ServiceRow, 'id'>>(empty);

  const openAdd = () => {
    setEditId(null);
    setForm(empty);
    setModalOpen(true);
  };

  const openEdit = (s: ServiceRow) => {
    setEditId(s.id);
    setForm({ ...s });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.title.trim()) return;
    if (editId) {
      await updateService(editId, form);
    } else {
      await addService(form);
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Globe className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-ink-900">Services</h2>
            <p className="text-sm text-ink-400">{services.length} services offered</p>
          </div>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {services.map((s) => (
          <div key={s.id} className="rounded-2xl bg-[var(--bg-card)] p-5 ring-1 ring-ink-100 shadow-soft transition-all hover:shadow-card">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-sm font-bold text-ink-900">{s.title}</h3>
              <span className="font-display text-sm font-extrabold text-brand-600">{s.price}</span>
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-ink-500 line-clamp-2">{s.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {s.features.split(',').map((f, i) => (
                <span key={i} className="rounded-md bg-ink-50 px-2 py-0.5 text-[10px] font-semibold text-ink-500">
                  {f.trim()}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 border-t border-ink-100 pt-3">
              <button onClick={() => openEdit(s)} className="flex items-center gap-1.5 rounded-lg bg-ink-50 px-3 py-1.5 text-xs font-bold text-ink-600 hover:bg-ink-100">
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </button>
              <button onClick={() => deleteService(s.id)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50">
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal title={editId ? 'Edit Service' : 'Add Service'} onClose={() => setModalOpen(false)}>
          <div className="space-y-4">
            <Input label="Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
            <Input label="Description" value={form.description} onChange={(v) => setForm({ ...form, description: v })} textarea />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input label="Price" value={form.price} onChange={(v) => setForm({ ...form, price: v })} />
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-ink-600">Icon</label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full rounded-xl border-0 bg-ink-50 px-4 py-3 text-sm font-medium text-ink-800 ring-1 ring-ink-200 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  {iconOptions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
            <Input label="Features (comma separated)" value={form.features} onChange={(v) => setForm({ ...form, features: v })} textarea />
            <div className="flex gap-3 border-t border-ink-100 pt-4">
              <button onClick={handleSave} className="btn-primary flex-1">
                {editId ? 'Save Changes' : 'Add Service'}
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

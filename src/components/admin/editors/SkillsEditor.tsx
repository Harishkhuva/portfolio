import { useState } from 'react';
import { Plus, Trash2, ListChecks, GripVertical } from 'lucide-react';
import { useDB } from '@/db/DBContext';

export default function SkillsEditor() {
  const { skills, addSkill, updateSkill, deleteSkill } = useDB();
  const [newText, setNewText] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const handleAdd = async () => {
    if (!newText.trim()) return;
    await addSkill(newText.trim());
    setNewText('');
  };

  const handleSave = async (id: number) => {
    if (!editText.trim()) return;
    await updateSkill(id, editText.trim());
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <ListChecks className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900">Skills</h2>
          <p className="text-sm text-ink-400">Add, edit, or remove skills shown in the About section</p>
        </div>
      </div>

      {/* Add new */}
      <div className="mb-5 flex gap-2 rounded-2xl bg-[var(--bg-card)] p-4 ring-1 ring-ink-100 shadow-card">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Add a new skill..."
          className="flex-1 rounded-xl border-0 bg-ink-50 px-4 py-2.5 text-sm font-medium text-ink-800 ring-1 ring-ink-200 transition-all focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
        />
        <button onClick={handleAdd} className="btn-primary">
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      {/* List */}
      <div className="space-y-2">
        {skills.map((skill, i) => (
          <div
            key={skill.id}
            className="flex items-center gap-3 rounded-xl bg-[var(--bg-card)] px-4 py-3.5 ring-1 ring-ink-100 shadow-soft transition-all hover:shadow-card"
          >
            <GripVertical className="h-4 w-4 shrink-0 text-ink-300" />
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-xs font-bold text-brand-600">
              {i + 1}
            </span>
            {editingId === skill.id ? (
              <input
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave(skill.id);
                  if (e.key === 'Escape') setEditingId(null);
                }}
                autoFocus
                className="flex-1 rounded-lg border-0 bg-ink-50 px-3 py-2 text-sm font-medium text-ink-800 ring-1 ring-brand-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            ) : (
              <span className="flex-1 text-sm font-semibold text-ink-700">{skill.text}</span>
            )}
            {editingId === skill.id ? (
              <button onClick={() => handleSave(skill.id)} className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white">
                Save
              </button>
            ) : (
              <button
                onClick={() => {
                  setEditingId(skill.id);
                  setEditText(skill.text);
                }}
                className="rounded-lg bg-ink-50 px-3 py-1.5 text-xs font-bold text-ink-600 transition-colors hover:bg-ink-100"
              >
                Edit
              </button>
            )}
            <button
              onClick={() => deleteSkill(skill.id)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {skills.length === 0 && (
          <p className="rounded-xl bg-[var(--bg-card)] px-4 py-8 text-center text-sm text-ink-400 ring-1 ring-ink-100">
            No skills yet. Add one above.
          </p>
        )}
      </div>
    </div>
  );
}

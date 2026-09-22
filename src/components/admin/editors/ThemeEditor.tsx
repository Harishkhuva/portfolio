import { useState } from 'react';
import { Palette, Sun, Moon, Check } from 'lucide-react';
import { useDB } from '@/db/DBContext';
import { themes, themeNames, applyTheme, type ThemeColor, type ColorMode } from '@/db/themes';

const colorOptions: ThemeColor[] = ['teal', 'blue', 'red', 'green', 'amber', 'pink'];

export default function ThemeEditor() {
  const { settings, updateSettings } = useDB();
  const [selectedColor, setSelectedColor] = useState<ThemeColor>(settings?.theme_color ?? 'teal');
  const [selectedMode, setSelectedMode] = useState<ColorMode>(settings?.color_mode ?? 'light');
  const [saved, setSaved] = useState(false);

  const handlePreview = (color: ThemeColor) => {
    setSelectedColor(color);
    applyTheme(color, selectedMode);
  };

  const handlePreviewMode = (mode: ColorMode) => {
    setSelectedMode(mode);
    applyTheme(selectedColor, mode);
  };

  const handleSave = async () => {
    await updateSettings({ theme_color: selectedColor, color_mode: selectedMode });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
          <Palette className="h-5 w-5" />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-ink-900">Theme Settings</h2>
          <p className="text-sm text-ink-400">Choose a color theme and light/dark mode for your portfolio</p>
        </div>
      </div>

      {/* Color theme picker */}
      <div className="rounded-2xl bg-[var(--bg-card)] p-6 ring-1 ring-ink-100 shadow-card">
        <h3 className="font-display text-sm font-bold text-ink-900">Color Theme</h3>
        <p className="mt-1 text-xs text-ink-400">Pick a primary accent color — all shades update automatically</p>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {colorOptions.map((color) => {
            const shades = themes[color];
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                onClick={() => handlePreview(color)}
                className={`group relative overflow-hidden rounded-2xl p-4 text-left ring-2 transition-all duration-300 ${
                  isSelected ? 'ring-brand-500 shadow-lift' : 'ring-ink-100 hover:ring-ink-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-ink-800">{themeNames[color]}</span>
                  {isSelected && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="h-3 w-3" />
                    </span>
                  )}
                </div>
                <div className="mt-3 flex h-8 overflow-hidden rounded-lg">
                  {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => (
                    <div
                      key={s}
                      className="flex-1"
                      style={{ backgroundColor: shades[s as keyof typeof shades] }}
                    />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color mode picker */}
      <div className="mt-5 rounded-2xl bg-[var(--bg-card)] p-6 ring-1 ring-ink-100 shadow-card">
        <h3 className="font-display text-sm font-bold text-ink-900">Color Mode</h3>
        <p className="mt-1 text-xs text-ink-400">Switch between light and dark appearance</p>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            onClick={() => handlePreviewMode('light')}
            className={`flex items-center gap-3 rounded-2xl p-4 ring-2 transition-all duration-300 ${
              selectedMode === 'light' ? 'ring-brand-500 shadow-lift' : 'ring-ink-100 hover:ring-ink-200'
            }`}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${selectedMode === 'light' ? 'bg-amber-100 text-amber-600' : 'bg-ink-50 text-ink-400'}`}>
              <Sun className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-ink-800">Light</div>
              <div className="text-xs text-ink-400">Bright, clean background</div>
            </div>
            {selectedMode === 'light' && (
              <Check className="ml-auto h-5 w-5 text-brand-600" />
            )}
          </button>

          <button
            onClick={() => handlePreviewMode('dark')}
            className={`flex items-center gap-3 rounded-2xl p-4 ring-2 transition-all duration-300 ${
              selectedMode === 'dark' ? 'ring-brand-500 shadow-lift' : 'ring-ink-100 hover:ring-ink-200'
            }`}
          >
            <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${selectedMode === 'dark' ? 'bg-indigo-100 text-indigo-600' : 'bg-ink-50 text-ink-400'}`}>
              <Moon className="h-5 w-5" />
            </span>
            <div>
              <div className="text-sm font-bold text-ink-800">Dark</div>
              <div className="text-xs text-ink-400">Easy on the eyes</div>
            </div>
            {selectedMode === 'dark' && (
              <Check className="ml-auto h-5 w-5 text-brand-600" />
            )}
          </button>
        </div>
      </div>

      {/* Save button */}
      <div className="mt-5 flex items-center gap-3">
        <button onClick={handleSave} className="btn-primary">
          {saved ? <Check className="h-4 w-4" /> : <Palette className="h-4 w-4" />}
          {saved ? 'Saved!' : 'Save Theme'}
        </button>
        <p className="text-xs text-ink-400">Changes preview instantly — save to persist across sessions</p>
      </div>
    </div>
  );
}

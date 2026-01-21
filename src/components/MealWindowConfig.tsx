'use client';

import { useState, useEffect } from 'react';

interface MealWindow {
  mealKey: string;
  label: string;
  start: string; // ISO string
  end: string;   // ISO string
  enabled: boolean;
}

interface MealWindowConfigProps {
  initialWindows: MealWindow[];
  onSave: (windows: MealWindow[]) => void;
}

const DEFAULT_MEALS = [
  { key: 'lunch1', label: 'Lunch 1' },
  { key: 'dinner1', label: 'Dinner 1' },
  { key: 'midnight', label: 'Midnight Snacks' },
  { key: 'breakfast2', label: 'Breakfast 2' },
  { key: 'lunch2', label: 'Lunch 2' },
];

export default function MealWindowConfig({ initialWindows, onSave }: MealWindowConfigProps) {
  const [windows, setWindows] = useState<MealWindow[]>([]);

  useEffect(() => {
    // Merge defaults with saved config
    const merged = DEFAULT_MEALS.map(dm => {
      const existing = initialWindows?.find(w => w.mealKey === dm.key);
      return existing || {
        mealKey: dm.key,
        label: dm.label,
        start: '',
        end: '',
        enabled: false
      };
    });
    setWindows(merged);
  }, [initialWindows]);

  const handleChange = (index: number, field: keyof MealWindow, value: any) => {
    const newWindows = [...windows];
    (newWindows[index] as any)[field] = value;
    setWindows(newWindows);
  };

  const handleSave = () => {
    onSave(windows);
  };

  return (
    <div className="card">
      <h3 className="text-xl font-bold mb-6 border-b border-primary pb-2">Meal Window Configuration</h3>
      
      <div className="space-y-4">
        {windows.map((w, idx) => (
          <div key={w.mealKey} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center border-b border-gray-800 pb-4">
            <div className="md:col-span-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={w.enabled} 
                  onChange={(e) => handleChange(idx, 'enabled', e.target.checked)}
                  className="w-5 h-5 accent-primary"
                />
                <span className={`font-bold ${w.enabled ? 'text-white' : 'text-gray-500'}`}>{w.label}</span>
              </label>
            </div>
            
            <div className="md:col-span-4">
              <label className="block text-xs text-gray-500 mb-1">Start Time</label>
              <input 
                type="datetime-local" 
                value={w.start ? new Date(w.start).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleChange(idx, 'start', new Date(e.target.value).toISOString())}
                disabled={!w.enabled}
                className="input-field disabled:opacity-50"
              />
            </div>
            
            <div className="md:col-span-4">
              <label className="block text-xs text-gray-500 mb-1">End Time</label>
              <input 
                type="datetime-local" 
                value={w.end ? new Date(w.end).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleChange(idx, 'end', new Date(e.target.value).toISOString())}
                disabled={!w.enabled}
                className="input-field disabled:opacity-50"
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button onClick={handleSave} className="btn-primary">
          SAVE CONFIGURATION
        </button>
      </div>
    </div>
  );
}

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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// ... interfaces ...

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
    <Card>
      <CardHeader>
        <CardTitle>Meal Window Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {windows.map((w, idx) => (
          <div key={w.mealKey} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end border-b border-border pb-4 last:border-0">
            <div className="md:col-span-3 flex items-center space-x-2 h-10">
               <input 
                  type="checkbox" 
                  checked={w.enabled} 
                  onChange={(e) => handleChange(idx, 'enabled', e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                  id={`enable-${w.mealKey}`}
                />
                <Label htmlFor={`enable-${w.mealKey}`} className={`cursor-pointer ${w.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {w.label}
                </Label>
            </div>
            
            <div className="md:col-span-4 space-y-2">
              <Label className="text-xs text-muted-foreground">Start Time</Label>
              <Input 
                type="datetime-local" 
                value={w.start ? new Date(w.start).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleChange(idx, 'start', new Date(e.target.value).toISOString())}
                disabled={!w.enabled}
              />
            </div>
            
            <div className="md:col-span-4 space-y-2">
              <Label className="text-xs text-muted-foreground">End Time</Label>
              <Input 
                type="datetime-local" 
                value={w.end ? new Date(w.end).toISOString().slice(0, 16) : ''}
                onChange={(e) => handleChange(idx, 'end', new Date(e.target.value).toISOString())}
                disabled={!w.enabled}
              />
            </div>
          </div>
        ))}

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="lg">
            SAVE CONFIGURATION
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

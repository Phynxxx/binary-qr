'use client';

import { useState } from 'react';
import AdminStats from '@/components/AdminStats';
import AdminCharts from '@/components/AdminCharts';
import MealWindowConfig from '@/components/MealWindowConfig';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) => fetch(url, {
    headers: { 'Authorization': 'Basic ' + btoa('admin:hackathon2026') }
}).then(res => res.json());

export default function AdminDashboard() {
  const { data: config } = useSWR('/api/admin/config', fetcher);
  const { data: statsData } = useSWR('/api/admin/stats', fetcher, { refreshInterval: 5000 });
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'config' | 'logs'>('overview');

  const phases = ['none', 'lunch1', 'dinner1', 'midnight', 'breakfast2', 'lunch2', 'swag'];

  const setPhase = async (phase: string) => {
    setUpdating(true);
    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin:hackathon2026')
        },
        body: JSON.stringify({ activePhase: phase }),
      });
      mutate('/api/admin/config');
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleSaveWindows = async (windows: any[]) => {
    try {
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Basic ' + btoa('admin:hackathon2026')
        },
        body: JSON.stringify({ mealWindows: windows }),
      });
      mutate('/api/admin/config');
      alert('Configuration saved!');
    } catch (e) {
      alert('Failed to save configuration');
    }
  };

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <h1 className="text-3xl font-bold text-white">ADMIN DASHBOARD</h1>
        <div className="text-right">
            <p className="text-sm text-gray-500">Active Phase</p>
            <p className="text-xl text-primary font-mono">{config?.activePhase || 'LOADING...'}</p>
        </div>
      </header>

      <div className="flex space-x-4 mb-8 border-b border-gray-800">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`pb-2 px-4 ${activeTab === 'overview' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-400'}`}
        >
          OVERVIEW
        </button>
        <button 
          onClick={() => setActiveTab('config')}
          className={`pb-2 px-4 ${activeTab === 'config' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-400'}`}
        >
          CONFIGURATION
        </button>
        <button 
          onClick={() => setActiveTab('logs')}
          className={`pb-2 px-4 ${activeTab === 'logs' ? 'border-b-2 border-primary text-primary font-bold' : 'text-gray-400'}`}
        >
          LOGS
        </button>
      </div>

      {activeTab === 'overview' && (
        <>
          <section className="mb-12">
            <h2 className="text-xl font-bold text-white mb-4">Phase Control</h2>
            <div className="flex flex-wrap gap-2">
              {phases.map(p => (
                <button
                  key={p}
                  onClick={() => setPhase(p)}
                  disabled={updating}
                  className={`px-4 py-2 rounded font-mono uppercase transition-all ${
                    config?.activePhase === p 
                      ? 'bg-primary text-black font-bold ring-2 ring-white' 
                      : 'bg-gray-900 text-gray-400 hover:bg-gray-800'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4">Live Statistics</h2>
            {statsData && <AdminCharts stats={statsData.stats} />}
            <AdminStats />
          </section>
        </>
      )}

      {activeTab === 'config' && (
        <section>
           <MealWindowConfig 
             initialWindows={config?.mealWindows || []} 
             onSave={handleSaveWindows} 
           />
        </section>
      )}

      {activeTab === 'logs' && (
        <section>
           <h2 className="text-xl font-bold text-white mb-4">Detailed Logs</h2>
           {/* Reusing AdminStats log table for now, could be expanded */}
           <AdminStats />
        </section>
      )}
    </div>
  );
}

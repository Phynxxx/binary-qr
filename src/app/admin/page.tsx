'use client';

import { useState } from 'react';
import AdminStats from '@/components/AdminStats';
import AdminCharts from '@/components/AdminCharts';
import MealWindowConfig from '@/components/MealWindowConfig';
import useSWR, { mutate } from 'swr';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const fetcher = (url: string) => fetch(url, {
    headers: { 'Authorization': 'Basic ' + btoa('admin:hackathon2026') }
}).then(res => res.json());

export default function AdminDashboard() {
  const { data: config } = useSWR('/api/admin/config', fetcher);
  const { data: statsData } = useSWR('/api/admin/stats', fetcher, { refreshInterval: 5000 });
  const [updating, setUpdating] = useState(false);

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
    <div className="min-h-screen p-8 bg-background text-foreground">
      <header className="flex justify-between items-center mb-8 border-b border-border pb-4">
        <h1 className="text-3xl font-bold tracking-tight">ADMIN DASHBOARD</h1>
        <div className="text-right">
            <p className="text-sm text-muted-foreground">Active Phase</p>
            <p className="text-xl text-primary font-mono font-bold">{config?.activePhase || 'LOADING...'}</p>
        </div>
      </header>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Phase Control</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {phases.map(p => (
                  <Button
                    key={p}
                    variant={config?.activePhase === p ? "default" : "secondary"}
                    onClick={() => setPhase(p)}
                    disabled={updating}
                    className="uppercase font-mono"
                  >
                    {p}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Live Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              {statsData && <AdminCharts stats={statsData.stats} />}
              <div className="mt-8">
                <AdminStats />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config">
           <MealWindowConfig 
             initialWindows={config?.mealWindows || []} 
             onSave={handleSaveWindows} 
           />
        </TabsContent>

        <TabsContent value="logs">
           <Card>
            <CardHeader>
              <CardTitle>Detailed Logs</CardTitle>
            </CardHeader>
            <CardContent>
               <AdminStats />
            </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

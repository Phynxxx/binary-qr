'use client';

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, {
    headers: { 'Authorization': 'Basic ' + btoa('admin:hackathon2026') } // Hardcoded for demo/MVP as per PRD
}).then(res => res.json());

export default function AdminStats() {
  const { data, error, isLoading } = useSWR('/api/admin/stats', fetcher, { refreshInterval: 5000 });

  if (error) return <div className="text-error">Failed to load stats</div>;
  if (isLoading) return <div className="text-primary animate-pulse">Loading stats...</div>;

  const { stats, recentLogs } = data;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} />
        <StatCard label="Lunch 1" value={stats.lunch1} />
        <StatCard label="Dinner 1" value={stats.dinner1} />
        <StatCard label="Midnight" value={stats.midnight} />
        <StatCard label="Breakfast 2" value={stats.breakfast2} />
        <StatCard label="Lunch 2" value={stats.lunch2} />
        <StatCard label="Swag" value={stats.swag} />
      </div>

      <div className="card">
        <h3 className="text-xl font-bold mb-4 border-b border-primary pb-2">Recent Scans</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 border-b border-gray-800">
                <th className="p-2">Time</th>
                <th className="p-2">User</th>
                <th className="p-2">Type</th>
                <th className="p-2">Status</th>
                <th className="p-2">Vol</th>
              </tr>
            </thead>
            <tbody>
              {recentLogs.map((log: any) => (
                <tr key={log._id} className="border-b border-gray-900 hover:bg-gray-900 font-mono text-sm">
                  <td className="p-2">{new Date(log.scannedAt).toLocaleTimeString()}</td>
                  <td className="p-2">{log.username}</td>
                  <td className="p-2">{log.type} {log.mealKey ? `(${log.mealKey})` : ''}</td>
                  <td className={
                    log.status === 'SUCCESS' ? 'text-primary p-2' : 
                    log.status === 'DUPLICATE' ? 'text-red-500 p-2' : 'text-yellow-500 p-2'
                  }>{log.status}</td>
                  <td className="p-2 text-gray-500">{log.volunteerId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <div className="card text-center">
      <p className="text-gray-400 text-sm uppercase tracking-wider">{label}</p>
      <p className="text-4xl font-bold text-primary mt-2">{value}</p>
    </div>
  );
}

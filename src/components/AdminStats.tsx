import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url, {
    headers: { 'Authorization': 'Basic ' + btoa('admin:hackathon2026') } // Hardcoded for demo/MVP as per PRD
}).then(res => res.json());

export default function AdminStats() {
  const { data, error, isLoading } = useSWR('/api/admin/stats', fetcher, { refreshInterval: 5000 });

  if (error) return <div className="text-destructive">Failed to load stats</div>;
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Scans</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Vol</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentLogs.map((log: any) => (
                <TableRow key={log._id}>
                  <TableCell className="font-mono">{new Date(log.scannedAt).toLocaleTimeString()}</TableCell>
                  <TableCell className="font-mono">{log.username}</TableCell>
                  <TableCell>{log.type} {log.mealKey ? `(${log.mealKey})` : ''}</TableCell>
                  <TableCell className={
                    log.status === 'SUCCESS' ? 'text-primary' : 
                    log.status === 'DUPLICATE' ? 'text-destructive' : 'text-yellow-500'
                  }>{log.status}</TableCell>
                  <TableCell className="text-muted-foreground">{log.volunteerId}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: number }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center justify-center p-6">
        <p className="text-muted-foreground text-xs uppercase tracking-wider mb-2">{label}</p>
        <p className="text-4xl font-bold text-primary">{value}</p>
      </CardContent>
    </Card>
  );
}

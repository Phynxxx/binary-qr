'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminChartsProps {
  stats: any;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658'];

export default function AdminCharts({ stats }: AdminChartsProps) {
  if (!stats) return null;

  const barData = [
    { name: 'Lunch 1', count: stats.lunch1 },
    { name: 'Dinner 1', count: stats.dinner1 },
    { name: 'Midnight', count: stats.midnight },
    { name: 'Breakfast 2', count: stats.breakfast2 },
    { name: 'Lunch 2', count: stats.lunch2 },
    { name: 'Swag', count: stats.swag },
  ];

  const pieData = [
    { name: 'Claimed Lunch 1', value: stats.lunch1 },
    { name: 'Unclaimed Lunch 1', value: Math.max(0, stats.totalUsers - stats.lunch1) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
      <div className="card h-80">
        <h3 className="text-xl font-bold mb-4 text-center">Distribution Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="name" stroke="#00ff00" />
            <YAxis stroke="#00ff00" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#000', borderColor: '#00ff00', color: '#00ff00' }}
              itemStyle={{ color: '#00ff00' }}
            />
            <Legend />
            <Bar dataKey="count" fill="#00ff00" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card h-80">
        <h3 className="text-xl font-bold mb-4 text-center">Lunch 1 Progress</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              fill="#8884d8"
              paddingAngle={5}
              dataKey="value"
            >
              <Cell key="cell-0" fill="#00ff00" />
              <Cell key="cell-1" fill="#333333" />
            </Pie>
            <Tooltip 
               contentStyle={{ backgroundColor: '#000', borderColor: '#00ff00', color: '#00ff00' }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

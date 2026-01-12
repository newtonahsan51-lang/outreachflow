
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import { TrendingUp, Users, Target, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const timeData = [
  { time: '08:00', sent: 120, open: 45 },
  { time: '10:00', sent: 250, open: 180 },
  { time: '12:00', sent: 400, open: 310 },
  { time: '14:00', sent: 350, open: 280 },
  { time: '16:00', sent: 300, open: 210 },
  { time: '18:00', sent: 150, open: 90 },
];

const campaignData = [
  { name: 'SaaS Agency', open: 68, reply: 24, bounce: 2 },
  { name: 'Cold Outreach', open: 52, reply: 12, bounce: 5 },
  { name: 'Follow-ups', open: 84, reply: 31, bounce: 1 },
];

const COLORS = ['#2563eb', '#8b5cf6', '#ec4899', '#f97316'];

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Advanced Analytics</h1>
          <p className="text-slate-500 dark:text-slate-400">Granular insights into your outreach performance.</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-semibold">Export PDF</button>
          <select className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold border-none outline-none">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Quarter</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Revenue Generated', value: '$24,500', trend: 12.5, icon: DollarSign, color: 'blue' },
          { label: 'Conversion Rate', value: '4.2%', trend: 2.1, icon: Target, color: 'emerald' },
          { label: 'Active Leads', value: '8,432', trend: -0.8, icon: Users, color: 'indigo' },
          { label: 'ROI Multiple', value: '8.4x', trend: 5.2, icon: TrendingUp, color: 'purple' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg bg-${stat.color}-50 dark:bg-${stat.color}-900/20 text-${stat.color}-600`}>
                <stat.icon size={20} />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(stat.trend)}%
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Engagement by Time of Day</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} tick={{fill: '#94a3b8'}} />
                <Tooltip 
                  contentStyle={{backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff'}}
                  itemStyle={{color: '#fff'}}
                />
                <Area type="monotone" dataKey="sent" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="open" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Campaign Performance Comparison</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={campaignData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                <YAxis axisLine={false} tickLine={false} fontSize={10} tick={{fill: '#94a3b8'}} />
                <Tooltip />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '10px'}} />
                <Bar dataKey="open" fill="#2563eb" radius={[4, 4, 0, 0]} />
                <Bar dataKey="reply" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

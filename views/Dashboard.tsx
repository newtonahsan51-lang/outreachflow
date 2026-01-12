
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar
} from 'recharts';
import { Send, MousePointerClick, MessageSquare, Calendar, Zap, Activity } from 'lucide-react';

const data = [
  { name: 'Mon', sent: 450, replies: 12 },
  { name: 'Tue', sent: 380, replies: 25 },
  { name: 'Wed', sent: 520, replies: 18 },
  { name: 'Thu', sent: 610, replies: 32 },
  { name: 'Fri', sent: 490, replies: 28 },
  { name: 'Sat', sent: 120, replies: 5 },
  { name: 'Sun', sent: 90, replies: 2 },
];

const conversionData = [
  { stage: 'Sent', value: 2500 },
  { stage: 'Opened', value: 1800 },
  { stage: 'Clicked', value: 850 },
  { stage: 'Replied', value: 320 },
  { stage: 'Booked', value: 45 },
];

const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600 dark:text-${color}-400`}>
        <Icon size={22} />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-full ${change >= 0 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700'}`}>
        {change >= 0 ? '+' : ''}{change}%
      </span>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</p>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workspace Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-3">
          <select className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors outline-none">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Today</option>
          </select>
          <button 
            onClick={() => navigate('/campaigns')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm shadow-blue-500/20 active:scale-95"
          >
            + New Campaign
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <MetricCard title="Emails Sent" value="1,284" change={12.5} icon={Send} color="blue" />
        <MetricCard title="Open Rate" value="64.2%" change={2.1} icon={MousePointerClick} color="indigo" />
        <MetricCard title="Reply Rate" value="18.5%" change={-0.4} icon={MessageSquare} color="purple" />
        <MetricCard title="Meetings" value="42" change={8.2} icon={Calendar} color="amber" />
        <MetricCard title="Active Campaigns" value="12" change={0} icon={Zap} color="emerald" />
        <MetricCard title="Health Score" value="98/100" change={1.2} icon={Activity} color="rose" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900 dark:text-white">Outreach Performance</h3>
            <select className="bg-slate-100 dark:bg-slate-800 border-none text-xs rounded-md px-2 py-1 outline-none">
              <option>Emails Sent</option>
              <option>Replies</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="sent" stroke="#2563eb" fillOpacity={1} fill="url(#colorSent)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="font-bold text-slate-900 dark:text-white mb-6">Conversion Funnel</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={conversionData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="stage" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: 'transparent'}}
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">
               <Activity size={20} />
             </div>
             <div>
               <h4 className="font-semibold text-slate-900 dark:text-white">Recent Activity</h4>
               <p className="text-xs text-slate-500">Last updated 5m ago</p>
             </div>
           </div>
           <div className="space-y-4">
             {[1,2,3].map(i => (
               <div key={i} className="flex gap-3 text-sm">
                 <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></div>
                 <div>
                   <p className="text-slate-700 dark:text-slate-300"><b>John Doe</b> replied to <b>ScaleUp Q4</b> campaign.</p>
                   <p className="text-xs text-slate-500 mt-0.5">2 minutes ago</p>
                 </div>
               </div>
             ))}
           </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 md:col-span-2">
          <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Best Performing Campaigns</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="text-left py-2 font-medium">Campaign</th>
                  <th className="text-center py-2 font-medium">Sent</th>
                  <th className="text-center py-2 font-medium">Open %</th>
                  <th className="text-center py-2 font-medium">Reply %</th>
                  <th className="text-right py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                {[
                  { name: 'SaaS Outbound 2024', sent: 1200, open: 68, reply: 22, status: 'Active' },
                  { name: 'Agency Outreach Alpha', sent: 850, open: 54, reply: 14, status: 'Active' },
                  { name: 'Enterprise Connect', sent: 430, open: 82, reply: 31, status: 'Paused' },
                ].map((c, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 font-medium text-slate-900 dark:text-white">{c.name}</td>
                    <td className="py-3 text-center text-slate-600 dark:text-slate-400">{c.sent}</td>
                    <td className="py-3 text-center text-slate-600 dark:text-slate-400">{c.open}%</td>
                    <td className="py-3 text-center text-slate-600 dark:text-slate-400">{c.reply}%</td>
                    <td className="py-3 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-slate-100 text-slate-600'}`}>
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

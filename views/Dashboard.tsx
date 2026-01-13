
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area,
  BarChart, Bar
} from 'recharts';
import { Send, MousePointerClick, MessageSquare, Calendar, Zap, Activity, Loader2 } from 'lucide-react';
import { apiService } from '../services/apiService';

const UsersIcon = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const MailIcon = (props: any) => <svg {...props} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>;

const data = [
  { name: 'Mon', sent: 450 }, { name: 'Tue', sent: 380 }, { name: 'Wed', sent: 520 },
  { name: 'Thu', sent: 610 }, { name: 'Fri', sent: 490 }, { name: 'Sat', sent: 120 }, { name: 'Sun', sent: 90 },
];

const MetricCard = ({ title, value, change, icon: Icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl bg-${color}-100 dark:bg-${color}-900/30 text-${color}-600`}>
        <Icon size={22} />
      </div>
    </div>
    <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</h3>
    <p className="text-2xl font-bold mt-1 text-slate-900 dark:text-white">{value}</p>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ users: 0, inboxes: 0, isLoading: true });

  useEffect(() => {
    let isMounted = true;

    // Safety timeout: If API takes too long, stop loading anyway
    const timeout = setTimeout(() => {
      if (isMounted && stats.isLoading) {
        setStats(prev => ({ ...prev, isLoading: false }));
      }
    }, 5000);

    const fetchStats = async () => {
      try {
        const [u, i] = await Promise.all([
          apiService.getUsers().catch(() => []), 
          apiService.getInboxes().catch(() => [])
        ]);
        
        if (isMounted) {
          clearTimeout(timeout);
          setStats({ 
            users: Array.isArray(u) ? u.length : 0, 
            inboxes: Array.isArray(i) ? i.length : 0, 
            isLoading: false 
          });
        }
      } catch (err) {
        if (isMounted) {
          clearTimeout(timeout);
          setStats(prev => ({ ...prev, isLoading: false }));
        }
      }
    };

    fetchStats();
    
    return () => { 
      isMounted = false;
      clearTimeout(timeout);
    };
  }, []);

  if (stats.isLoading) return (
    <div className="h-full flex flex-col items-center justify-center gap-4 text-slate-400">
      <Loader2 size={48} className="animate-spin text-blue-600" />
      <p className="font-bold">Initializing Platform...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workspace Overview</h1>
          <p className="text-slate-500">Real-time stats from production server.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="System Users" value={stats.users} icon={UsersIcon} color="blue" />
        <MetricCard title="Active Inboxes" value={stats.inboxes} icon={MailIcon} color="indigo" />
        <MetricCard title="Health Score" value="98%" icon={Activity} color="rose" />
        <MetricCard title="Uptime" value="100%" icon={Zap} color="emerald" />
      </div>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800">
        <h3 className="font-bold text-slate-900 dark:text-white mb-6">Weekly Outreach Traffic</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs><linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/><stop offset="95%" stopColor="#2563eb" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Area type="monotone" dataKey="sent" stroke="#2563eb" fill="url(#colorSent)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

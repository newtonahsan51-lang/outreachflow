
import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, Settings, Users, CreditCard, Activity, 
  TrendingUp, DollarSign, Package, Save, Plus, 
  Trash2, CheckCircle2, RefreshCw,
  Search, MoreVertical, Database, Zap, ShieldCheck, 
  UserCheck, Loader2, Shield, Globe, X as XClose
} from 'lucide-react';
import { apiService } from '../services/apiService';

const LayoutGridIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
  </svg>
);

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('Overview');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const [plans, setPlans] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [systemConfig, setSystemConfig] = useState<any>({
    platformName: 'OutreachFlow',
    supportEmail: '',
    maintenanceMode: 0,
    publicSignup: 1,
    enforce2FA: 0,
    globalEmailLimit: 50,
    retryLogic: 'Exponential',
    backupFrequency: 'Daily'
  });

  const [systemHealth] = useState({
    api: 'Healthy', database: 'Optimal', sendingQueue: 'Clear', uptime: '99.99%'
  });

  const [ipRanges, setIpRanges] = useState<string[]>([]);
  const [showIpModal, setShowIpModal] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const initData = async () => {
    setIsLoading(true);
    
    // Safety timeout
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    try {
      const [u, p, c, l, w] = await Promise.all([
        apiService.getUsers().catch(() => []),
        apiService.getPlans().catch(() => []),
        apiService.getConfig().catch(() => ({})),
        apiService.getLogs().catch(() => []),
        apiService.getWhitelist().catch(() => [])
      ]);
      clearTimeout(timeout);
      setUsers(Array.isArray(u) ? u : []);
      setPlans(Array.isArray(p) ? p : []);
      if (c && typeof c === 'object') setSystemConfig(prev => ({...prev, ...c}));
      setAuditLogs(Array.isArray(l) ? l : []);
      setIpRanges(Array.isArray(w) ? w : []);
    } catch (err) {
      clearTimeout(timeout);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    initData();
  }, []);

  const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setIsActionLoading(`status-${userId}`);
    try {
      await apiService.updateUserStatus(userId, nextStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
    } finally {
      setIsActionLoading(null);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total MRR', value: '$142,500', trend: 14.2, icon: DollarSign, color: 'emerald' },
          { label: 'Active Users', value: (users?.length || 0).toString(), trend: 5.8, icon: Users, color: 'blue' },
          { label: 'Total Emails Sent', value: '4.2M', trend: 22.1, icon: Zap, color: 'amber' },
          { label: 'Churn Rate', value: '1.2%', trend: -0.4, icon: TrendingUp, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800`}>
                <stat.icon size={20} />
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Platform Health</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(systemHealth).map(([key, value]) => (
            <div key={key} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{key}</p>
                <p className="text-sm font-bold mt-1 text-slate-700 dark:text-slate-300">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldAlert className="text-red-500" /> Control Center
          </h1>
          <p className="text-slate-500">Master settings for the platform.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-1 shrink-0">
          {['Overview', 'User Management', 'Audit Logs'].map((id) => (
            <button 
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeSection === id ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {id}
            </button>
          ))}
        </aside>

        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
               <Loader2 size={40} className="animate-spin text-blue-600" />
               <p className="font-bold">Loading Control Center...</p>
            </div>
          ) : (
            <>
              {activeSection === 'Overview' && renderOverview()}
              {activeSection === 'User Management' && (
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border p-8">
                  <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Active Users</h3>
                  <div className="space-y-4">
                    {users.map(u => (
                      <div key={u.id} className="flex items-center justify-between p-4 border rounded-2xl dark:border-slate-800">
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${u.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{u.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeSection === 'Audit Logs' && (
                <div className="bg-white dark:bg-slate-900 rounded-[32px] border p-8">
                  <h3 className="text-lg font-bold mb-6 text-slate-900 dark:text-white">Recent Activity</h3>
                  <div className="space-y-3">
                    {auditLogs.map(log => (
                      <div key={log.id} className="text-xs p-3 border rounded-xl dark:border-slate-800 text-slate-600 dark:text-slate-400">
                        <span className="font-bold text-slate-900 dark:text-white">{log.action}</span> - {log.resource} ({log.timestamp})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;


import React, { useState, useMemo, useEffect } from 'react';
import { 
  ShieldAlert, Settings, Users, CreditCard, Activity, 
  TrendingUp, DollarSign, Package, Save, Plus, 
  Trash2, Edit2, CheckCircle2, AlertCircle, RefreshCw,
  Search, Filter, MoreVertical, ExternalLink, ArrowUpRight,
  Database, Zap, Lock, Eye, Check, UserCheck, UserX, 
  ShieldCheck, MoreHorizontal, Mail, Calendar, User,
  Loader2, LogIn, FilePlus, Shield, XCircle, Clock,
  Globe, Server, Cpu, Bell, Power, X as XClose
} from 'lucide-react';
import { apiService } from '../services/apiService';

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
    maintenanceMode: false,
    publicSignup: true,
    enforce2FA: false,
    globalEmailLimit: 50,
    retryLogic: 'Exponential',
    backupFrequency: 'Daily'
  });

  const [systemHealth, setSystemHealth] = useState({
    api: 'Healthy',
    database: 'Optimal',
    sendingQueue: 'Clear',
    uptime: '99.99%'
  });

  const [ipRanges, setIpRanges] = useState<string[]>([]);
  const [showIpModal, setShowIpModal] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [isEditingPlan, setIsEditingPlan] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  // Load Initial Data from Server
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const [u, p, c, l, w] = await Promise.all([
          apiService.getUsers(),
          apiService.getPlans(),
          apiService.getConfig(),
          apiService.getLogs(),
          apiService.getWhitelist()
        ]);
        setUsers(u || []);
        setPlans(p || []);
        if (c) setSystemConfig(c);
        setAuditLogs(l || []);
        setIpRanges(w || []);
      } catch (err) {
        console.error("Server sync failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleToggleUserStatus = async (userId: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'Active' ? 'Suspended' : 'Active';
    setIsActionLoading(`status-${userId}`);
    try {
      await apiService.updateUserStatus(userId, nextStatus);
      setUsers(users.map(u => u.id === userId ? { ...u, status: nextStatus } : u));
      await apiService.addLog({
        user: 'Admin',
        action: 'Update Status',
        resource: `User ID: ${userId}`,
        status: 'Success'
      });
    } finally {
      setIsActionLoading(null);
    }
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await apiService.saveConfig(systemConfig);
      await apiService.addLog({
        user: 'Admin',
        action: 'System Config Update',
        resource: 'Main Config',
        status: 'Success'
      });
      alert('System configuration updated successfully!');
    } catch (err) {
      alert('Error saving configuration');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWhitelist = async () => {
    try {
      await apiService.saveWhitelist(ipRanges);
      setShowIpModal(false);
    } catch (err) {
      alert('Error saving IP whitelist');
    }
  };

  const handleDeleteUser = async (userId: number, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      setIsActionLoading(`delete-${userId}`);
      try {
        await apiService.deleteUser(userId);
        setUsers(users.filter(u => u.id !== userId));
        await apiService.addLog({
          user: 'Admin',
          action: 'Delete User',
          resource: name,
          status: 'Warning'
        });
      } finally {
        setIsActionLoading(null);
      }
    }
  };

  const filteredLogs = useMemo(() => {
    return auditLogs.filter(log => 
      log.user?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [auditLogs, searchQuery]);

  const renderOverview = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total MRR', value: '$142,500', trend: 14.2, icon: DollarSign, color: 'emerald' },
          { label: 'Active Users', value: users.length.toString(), trend: 5.8, icon: Users, color: 'blue' },
          { label: 'Total Emails Sent', value: '4.2M', trend: 22.1, icon: Zap, color: 'amber' },
          { label: 'Churn Rate', value: '1.2%', trend: -0.4, icon: TrendingUp, color: 'rose' },
        ].map((stat, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${stat.trend >= 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {stat.trend > 0 ? '+' : ''}{stat.trend}%
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">System Infrastructure</h3>
            <button onClick={() => window.location.reload()} className="text-xs font-bold text-blue-600 flex items-center gap-1">
              <RefreshCw size={14} /> Refresh Logs
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(systemHealth).map(([key, value]) => (
              <div key={key} className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1')}</p>
                  <p className="text-sm font-bold mt-1">{value}</p>
                </div>
                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <ShieldAlert className="text-amber-400" /> Admin Alerts
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-white/10 rounded-2xl border border-white/10">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <p className="text-[10px] leading-relaxed">Platform is currently running from production PHP server.</p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px]"></div>
        </div>
      </div>
    </div>
  );

  const renderPlanSettings = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold">Subscription Plan Management</h3>
            <p className="text-sm text-slate-500">Modify software pricing and feature limits.</p>
          </div>
          <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <Plus size={18} /> Create New Plan
          </button>
        </div>

        <div className="space-y-4">
          {plans.map(plan => (
            <div key={plan.id} className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-between group hover:border-blue-500 transition-all">
              <div className="flex items-center gap-5">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 dark:border-slate-800">
                  <Package size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{plan.name}</h4>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-sm font-black text-blue-600">${plan.price}/mo</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {plan.limit_val?.toLocaleString()} Emails</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">• {plan.accounts} Accounts</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Platform Users</h3>
            <p className="text-sm text-slate-500">Oversee all customer accounts and their current status.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search users..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Current Plan</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-center">Volume</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.filter(u => u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase())).map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500 shadow-sm">
                        {user.name?.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <Package size={14} className="text-blue-600" />
                      <span className="text-sm font-semibold">{user.plan}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      user.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-4 text-center text-sm font-bold text-slate-600 dark:text-slate-400">
                    {user.volume}
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleToggleUserStatus(user.id, user.status)}
                        disabled={isActionLoading === `status-${user.id}`}
                        className={`p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all ${
                          user.status === 'Active' ? 'text-slate-400 hover:text-amber-500' : 'text-amber-500 hover:text-emerald-500'
                        }`}
                      >
                        {isActionLoading === `status-${user.id}` ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        disabled={isActionLoading === `delete-${user.id}`}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-600 transition-all shadow-sm" 
                      >
                        {isActionLoading === `delete-${user.id}` ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2"><Globe className="text-blue-500" /> Platform Branding</h3>
            <p className="text-sm text-slate-500">Custom server settings.</p>
          </div>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform Name</label>
              <input type="text" value={systemConfig.platformName} onChange={(e) => setSystemConfig({...systemConfig, platformName: e.target.value})} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
           <h3 className="text-lg font-bold mb-6 flex items-center gap-2"><ShieldCheck className="text-emerald-500" /> Security Control</h3>
           <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl"><Shield size={20} /></div>
                <div>
                  <p className="text-sm font-bold">IP Whitelisting</p>
                  <p className="text-xs text-slate-500">{ipRanges.length} IPs authorized.</p>
                </div>
              </div>
              <button onClick={() => setShowIpModal(true)} className="text-xs font-bold text-blue-600 hover:underline">Configure</button>
            </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={handleSaveConfig} disabled={isSaving} className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-bold flex items-center gap-3 shadow-2xl transition-all">
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {isSaving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 flex items-center justify-between">
           <h3 className="text-lg font-bold">Server Audit Logs</h3>
           <button onClick={() => window.location.reload()} className="p-2 hover:bg-white rounded-xl text-slate-400"><RefreshCw size={16} /></button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Event</th>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${log.status === 'Success' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}><Activity size={16} /></div>
                      <div><p className="text-sm font-bold text-slate-900 dark:text-white">{log.action}</p></div>
                    </div>
                  </td>
                  <td className="px-8 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{log.user}</td>
                  <td className="px-8 py-4"><span className={`px-2 py-0.5 rounded text-[10px] font-bold ${log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>{log.status}</span></td>
                  <td className="px-8 py-4 text-right text-xs text-slate-400">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <ShieldAlert className="text-red-500" /> Control Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Master settings for the OutreachFlow enterprise platform.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-64 space-y-1">
          {[
            { id: 'Overview', icon: LayoutGridIcon },
            { id: 'Plans & Pricing', icon: CreditCard },
            { id: 'User Management', icon: Users },
            { id: 'System Settings', icon: Settings },
            { id: 'Audit Logs', icon: Database },
          ].map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeSection === item.id 
                ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95'
              }`}
            >
              <item.icon size={18} /> {item.id}
            </button>
          ))}
        </aside>

        <div className="flex-1">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-4 text-slate-400">
               <Loader2 size={40} className="animate-spin text-blue-600" />
               <p className="font-bold">Syncing with Server Database...</p>
            </div>
          ) : (
            <>
              {activeSection === 'Overview' && renderOverview()}
              {activeSection === 'Plans & Pricing' && renderPlanSettings()}
              {activeSection === 'User Management' && renderUserManagement()}
              {activeSection === 'Audit Logs' && renderAuditLogs()}
              {activeSection === 'System Settings' && renderSystemSettings()}
            </>
          )}
        </div>
      </div>

      {showIpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold">IP Whitelisting</h2>
              <button onClick={() => setShowIpModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><XClose size={20} /></button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-2">
                <input type="text" placeholder="e.g. 192.168.1.1" value={newIp} onChange={(e) => setNewIp(e.target.value)} className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none" />
                <button onClick={() => { if(newIp) setIpRanges([...ipRanges, newIp]); setNewIp(''); }} className="px-6 bg-blue-600 text-white rounded-2xl font-bold"><Plus size={20} /></button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {ipRanges.map(ip => (
                  <div key={ip} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm font-mono">{ip}</span>
                    <button onClick={() => setIpRanges(ipRanges.filter(i => i !== ip))} className="p-1.5 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              <button onClick={handleSaveWhitelist} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-bold">Apply & Sync with Server</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const XIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
);

const LayoutGridIcon = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
  </svg>
);

export default AdminPanel;

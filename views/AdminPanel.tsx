
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

  // Load Initial Data
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
        setUsers(u);
        setPlans(p);
        if (c) setSystemConfig(c);
        setAuditLogs(l);
        setIpRanges(w || []);
      } catch (err) {
        console.error("Initialization failed", err);
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
        resource: `User ID: ${userId} to ${nextStatus}`,
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
    } finally {
      setIsSaving(false);
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

  const handleImpersonate = (userName: string) => {
    alert(`Initializing impersonation mode for ${userName}. You will be redirected to their dashboard.`);
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
            <button className="text-xs font-bold text-blue-600 flex items-center gap-1">
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
                <AlertCircle size={16} className="text-amber-400 shrink-0" />
                <p className="text-[10px] leading-relaxed">3 domains pending verification for over 48 hours. Follow up required.</p>
              </div>
              <div className="flex gap-3 p-3 bg-white/10 rounded-2xl border border-white/10">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <p className="text-[10px] leading-relaxed">Weekly security audit completed. No anomalies detected.</p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 bg-blue-600 rounded-xl font-bold text-xs hover:bg-blue-700 transition-all">
              Manage All Incidents
            </button>
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
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsEditingPlan(plan)}
                  className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-blue-600 transition-all shadow-sm"
                >
                  <Edit2 size={18} />
                </button>
                <button className="p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm">
                  <Trash2 size={18} />
                </button>
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
            <button className="p-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-blue-600 transition-all">
              <Filter size={18} />
            </button>
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
                        onClick={() => handleImpersonate(user.name)}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-600 shadow-sm transition-all active:scale-90" 
                        title="Impersonate User"
                      >
                        <Eye size={16} />
                      </button>
                      <button 
                        onClick={() => handleToggleUserStatus(user.id, user.status)}
                        disabled={isActionLoading === `status-${user.id}`}
                        className={`p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl shadow-sm transition-all active:scale-90 ${
                          user.status === 'Active' ? 'text-slate-400 hover:text-amber-500' : 'text-amber-500 hover:text-emerald-500'
                        }`}
                        title={user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
                      >
                        {isActionLoading === `status-${user.id}` ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : user.status === 'Active' ? (
                          <UserX size={16} />
                        ) : (
                          <UserCheck size={16} />
                        )}
                      </button>
                      <button 
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        disabled={isActionLoading === `delete-${user.id}`}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-600 shadow-sm transition-all active:scale-90" 
                        title="Delete User"
                      >
                        {isActionLoading === `delete-${user.id}` ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-slate-50/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Showing {users.length} total users</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50">Previous</button>
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold shadow-sm active:scale-95 transition-all disabled:opacity-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuditLogs = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold">Audit Logs</h3>
            <p className="text-sm text-slate-500">Historical record of all system-wide actions and events.</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search logs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64 transition-all"
              />
            </div>
            <button className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-2 text-slate-600">
              <Filter size={14} /> All Levels
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-8 py-4">Event</th>
                <th className="px-8 py-4">User</th>
                <th className="px-8 py-4">Resource</th>
                <th className="px-8 py-4">IP Address</th>
                <th className="px-8 py-4 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        log.status === 'Success' ? 'bg-emerald-100 text-emerald-600' :
                        log.status === 'Warning' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
                      }`}>
                        {log.action?.includes('Login') ? <LogIn size={16} /> : 
                         log.action?.includes('Create') ? <FilePlus size={16} /> :
                         log.action?.includes('Delete') ? <Trash2 size={16} /> : <Activity size={16} />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{log.action}</p>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                          log.status === 'Success' ? 'bg-emerald-50 text-emerald-600' :
                          log.status === 'Warning' ? 'bg-amber-50 text-amber-600' : 'bg-rose-100 text-rose-600'
                        }`}>
                          {log.status}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-slate-400" />
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-8 py-4">
                    <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">
                      {log.resource}
                    </span>
                  </td>
                  <td className="px-8 py-4">
                    <p className="text-xs text-slate-500 font-medium">{log.ip}</p>
                  </td>
                  <td className="px-8 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400">
                      <Clock size={12} />
                      {log.timestamp}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-slate-50/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Logged {auditLogs.length} events</p>
          <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
            Download Full History <ExternalLink size={12} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              < Globe className="text-blue-500" /> Platform Branding
            </h3>
            <p className="text-sm text-slate-500">Customize the site name and default contact details.</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Platform Name</label>
              <input 
                type="text" 
                value={systemConfig.platformName}
                onChange={(e) => setSystemConfig({...systemConfig, platformName: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Support Contact Email</label>
              <input 
                type="email" 
                value={systemConfig.supportEmail || ''}
                onChange={(e) => setSystemConfig({...systemConfig, supportEmail: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold" 
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div>
                <p className="text-sm font-bold">Public Signups</p>
                <p className="text-xs text-slate-500">Allow new users to create accounts without invites.</p>
              </div>
              <button 
                onClick={() => setSystemConfig({...systemConfig, publicSignup: !systemConfig.publicSignup})}
                className={`w-11 h-6 rounded-full relative transition-colors ${systemConfig.publicSignup ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${systemConfig.publicSignup ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Zap className="text-amber-500" /> Global Outreach Engine
            </h3>
            <p className="text-sm text-slate-500">Configure engine-wide limits and behavior logic.</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Max Daily Emails Per Account</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="10" 
                  max="200" 
                  value={systemConfig.globalEmailLimit}
                  onChange={(e) => setSystemConfig({...systemConfig, globalEmailLimit: parseInt(e.target.value)})}
                  className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                />
                <span className="w-12 text-center font-bold text-blue-600">{systemConfig.globalEmailLimit}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Retry Strategy</label>
                <select 
                  value={systemConfig.retryLogic}
                  onChange={(e) => setSystemConfig({...systemConfig, retryLogic: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                >
                  <option>Exponential</option>
                  <option>Linear</option>
                  <option>Immediate</option>
                  <option>No Retry</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Database Backups</label>
                <select 
                  value={systemConfig.backupFrequency}
                  onChange={(e) => setSystemConfig({...systemConfig, backupFrequency: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-sm"
                >
                  <option>Hourly</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <ShieldCheck className="text-emerald-500" /> Security & Access Control
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl">
                  <Lock size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">Enforce 2FA</p>
                  <p className="text-xs text-slate-500">Require all users to enable Two-Factor Authentication.</p>
                </div>
              </div>
              <button 
                onClick={() => setSystemConfig({...systemConfig, enforce2FA: !systemConfig.enforce2FA})}
                className={`w-11 h-6 rounded-full relative transition-colors ${systemConfig.enforce2FA ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-700'}`}
              >
                <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${systemConfig.enforce2FA ? 'right-1' : 'left-1'}`} />
              </button>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl">
                  <Shield size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold">IP Whitelisting</p>
                  <p className="text-xs text-slate-500">Restricted admin access to specific IP ranges.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowIpModal(true)}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Configure Ranges
              </button>
            </div>
          </div>
        </div>

        <div className="bg-rose-50 dark:bg-rose-950/20 rounded-[32px] border border-rose-100 dark:border-rose-900/30 p-8 shadow-sm">
          <h3 className="text-lg font-bold text-rose-600 mb-4 flex items-center gap-2">
            <Power className="text-rose-500" /> Maintenance Zone
          </h3>
          <p className="text-sm text-rose-800 dark:text-rose-400 mb-6 leading-relaxed">
            Maintenance mode will block access to the platform for all non-admin users.
          </p>
          <button 
            onClick={() => setSystemConfig({...systemConfig, maintenanceMode: !systemConfig.maintenanceMode})}
            className={`w-full py-4 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
              systemConfig.maintenanceMode 
              ? 'bg-emerald-600 text-white shadow-emerald-500/20' 
              : 'bg-rose-600 text-white shadow-rose-500/20'
            }`}
          >
            {systemConfig.maintenanceMode ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {systemConfig.maintenanceMode ? 'Disable Maintenance Mode' : 'Enable Maintenance Mode'}
          </button>
          
          <div className="mt-4 flex gap-2">
            <button className="flex-1 py-2 text-[10px] font-bold border border-rose-200 dark:border-rose-800 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors">Clear Cache</button>
            <button className="flex-1 py-2 text-[10px] font-bold border border-rose-200 dark:border-rose-800 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors">Flush Queues</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 border-t border-slate-100 dark:border-slate-800">
        <button 
          onClick={handleSaveConfig}
          disabled={isSaving}
          className="px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-bold flex items-center gap-3 shadow-2xl active:scale-95 transition-all disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          {isSaving ? 'Saving Changes...' : 'Save System Configuration'}
        </button>
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
               <p className="font-bold">Syncing with Backend Database...</p>
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

      {/* IP Whitelisting Modal */}
      {showIpModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">IP Whitelisting</h2>
                <p className="text-sm text-slate-500">Only authorized IP addresses can access the admin panel.</p>
              </div>
              <button onClick={() => setShowIpModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                <XClose size={20} />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="e.g. 192.168.1.1" 
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold" 
                />
                <button 
                  onClick={() => { if(newIp) setIpRanges([...ipRanges, newIp]); setNewIp(''); }}
                  className="px-6 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {ipRanges.map(ip => (
                  <div key={ip} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-xl">
                    <span className="text-sm font-mono font-medium">{ip}</span>
                    <button onClick={() => setIpRanges(ipRanges.filter(i => i !== ip))} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowIpModal(false)}
                className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[24px] font-bold shadow-xl active:scale-95 transition-all"
              >
                Apply Whitelist
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {isEditingPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Plan: {isEditingPlan.name}</h2>
              <button onClick={() => setIsEditingPlan(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                <XIcon size={20} />
              </button>
            </div>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Price ($)</label>
                  <input type="number" defaultValue={isEditingPlan.price} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sending Accounts</label>
                  <input type="number" defaultValue={isEditingPlan.accounts} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Monthly Email Limit</label>
                <input type="number" defaultValue={isEditingPlan.limit_val} className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none" />
              </div>
              <button className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95">Update Plan Configuration</button>
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

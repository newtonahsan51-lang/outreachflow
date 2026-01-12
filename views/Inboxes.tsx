
import React, { useState, useEffect } from 'react';
import { 
  Mail, Shield, Zap, TrendingUp, Plus, Activity, 
  Settings, CheckCircle2, AlertTriangle, AlertCircle, X, Loader2, Globe, Server,
  Lock, Key, Info, ExternalLink, Trash2, Smartphone
} from 'lucide-react';
import { apiService } from '../services/apiService';

const Inboxes = () => {
  const [inboxes, setInboxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: '',
    password: '',
    provider: 'Gmail',
    smtp_host: 'smtp.gmail.com',
    smtp_port: 587,
    imap_host: 'imap.gmail.com',
    imap_port: 993,
    limit_val: 50
  });

  const fetchInboxes = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getInboxes();
      setInboxes(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInboxes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiService.addInbox(form);
      if (res.success) {
        setShowAddModal(false);
        setForm({
          email: '', password: '', provider: 'Gmail',
          smtp_host: 'smtp.gmail.com', smtp_port: 587,
          imap_host: 'imap.gmail.com', imap_port: 993, limit_val: 50
        });
        fetchInboxes();
        await apiService.addLog({
          user: 'Admin',
          action: 'Connected Inbox',
          resource: form.email,
          status: 'Success'
        });
      } else {
        alert("Error adding inbox: " + res.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, email: string) => {
    if (confirm(`Remove ${email}?`)) {
      await apiService.deleteInbox(id);
      fetchInboxes();
      await apiService.addLog({
        user: 'Admin',
        action: 'Removed Inbox',
        resource: email,
        status: 'Warning'
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Inboxes</h1>
          <p className="text-slate-500">Manage your high-deliverability sending accounts.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> Add Account
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center gap-4 text-slate-400">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="font-bold">Syncing inboxes from database...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Account</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Warmup</th>
                  <th className="px-8 py-4">Sent Today</th>
                  <th className="px-8 py-4">Health</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {inboxes.length === 0 ? (
                  <tr><td colSpan={6} className="p-20 text-center text-slate-400 font-medium">No sending accounts connected. Click "Add Account" to begin.</td></tr>
                ) : (
                  inboxes.map((inbox) => (
                    <tr key={inbox.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 group transition-all">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                            <Mail size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{inbox.email}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{inbox.provider}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                          <CheckCircle2 size={12} /> VERIFIED
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${inbox.warmup ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${inbox.warmup ? 'right-1' : 'left-1'}`} />
                        </div>
                      </td>
                      <td className="px-8 py-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                        {inbox.sentToday} / {inbox.limit_val}
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                           <div className="flex-1 h-1.5 w-16 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-500" style={{width: `${inbox.health}%`}} />
                           </div>
                           <span className="text-xs font-bold text-emerald-600">{inbox.health}%</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-all"><Settings size={16} /></button>
                          <button 
                            onClick={() => handleDelete(inbox.id, inbox.email)}
                            className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Inbox Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Connect Email Account</h2>
                  <p className="text-sm text-slate-500 font-medium">Add SMTP/IMAP account for outreach.</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                  <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="alex@company.com" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">App Password</label>
                  <div className="relative">
                    <input required value={form.password} onChange={e => setForm({...form, password: e.target.value})} type="password" placeholder="••••••••" className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
                    <Key className="absolute right-3 top-2.5 text-slate-300" size={16} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SMTP Host</label>
                  <input value={form.smtp_host} onChange={e => setForm({...form, smtp_host: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">SMTP Port</label>
                  <input value={form.smtp_port} onChange={e => setForm({...form, smtp_port: parseInt(e.target.value)})} type="number" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IMAP Host</label>
                  <input value={form.imap_host} onChange={e => setForm({...form, imap_host: e.target.value})} type="text" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">IMAP Port</label>
                  <input value={form.imap_port} onChange={e => setForm({...form, imap_port: parseInt(e.target.value)})} type="number" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                  Gmail ব্যবহার করলে অবশ্যই "App Password" ব্যবহার করুন এবং IMAP এনাবেল রাখুন।
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Zap size={18} />}
                {isSubmitting ? 'Authenticating...' : 'Validate & Connect Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inboxes;

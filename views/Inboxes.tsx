
import React, { useState, useEffect } from 'react';
import { 
  Mail, Shield, Zap, TrendingUp, Plus, Activity, 
  Settings, CheckCircle2, AlertTriangle, AlertCircle, X, Loader2, Globe, Server,
  Lock, Key, Info, ExternalLink, Trash2, Smartphone, Check
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
    const timeout = setTimeout(() => setIsLoading(false), 5000);
    try {
      const data = await apiService.getInboxes();
      clearTimeout(timeout);
      setInboxes(Array.isArray(data) ? data : []);
    } catch (err) {
      clearTimeout(timeout);
      setInboxes([]);
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
      if (res) {
        setShowAddModal(false);
        setForm({
          email: '', password: '', provider: 'Gmail',
          smtp_host: 'smtp.gmail.com', smtp_port: 587,
          imap_host: 'imap.gmail.com', imap_port: 993, limit_val: 50
        });
        await fetchInboxes();
      }
    } catch (err: any) {
      alert("Error adding inbox: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number, email: string) => {
    if (confirm(`Remove ${email}?`)) {
      try {
        await apiService.deleteInbox(id);
        fetchInboxes();
      } catch (err) {}
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
            <p className="font-bold">Syncing inboxes...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4">Account</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Sent Today</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {inboxes.length === 0 ? (
                  <tr><td colSpan={4} className="p-20 text-center text-slate-400 font-medium">No accounts connected.</td></tr>
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
                      <td className="px-8 py-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                        {inbox.sentToday || 0} / {inbox.limit_val || 50}
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDelete(inbox.id, inbox.email)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-all">
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

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Connect New Account</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
                <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="alex@company.com" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase">App Password</label>
                <input required value={form.password} onChange={e => setForm({...form, password: e.target.value})} type="password" placeholder="••••••••••••" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Provider</label>
                  <select value={form.provider} onChange={e => setForm({...form, provider: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none">
                    <option>Gmail</option>
                    <option>Outlook</option>
                    <option>SMTP</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase">Daily Limit</label>
                  <input type="number" value={form.limit_val} onChange={e => setForm({...form, limit_val: parseInt(e.target.value)})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" />
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 font-bold text-slate-500">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={18} />} Connect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inboxes;

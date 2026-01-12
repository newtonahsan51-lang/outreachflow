
import React, { useState, useEffect } from 'react';
import { 
  Mail, Shield, Zap, TrendingUp, Plus, Activity, 
  Settings, CheckCircle2, AlertTriangle, AlertCircle, X, Loader2, Globe, Server,
  Lock, Key, Info, ExternalLink
} from 'lucide-react';
import { apiService } from '../services/apiService';

const Inboxes = () => {
  const [inboxes, setInboxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInboxes = async () => {
      try {
        const data = await apiService.getInboxes();
        setInboxes(data || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInboxes();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Inboxes</h1>
          <p className="text-slate-500">Connected accounts from your server.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-xl font-bold">
          <Plus size={20} /> Add Account
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center gap-4 text-slate-400">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="font-bold">Syncing inboxes...</p>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-semibold uppercase">
              <tr>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Warmup</th>
                <th className="px-6 py-4">Sent Today</th>
                <th className="px-6 py-4">Health</th>
                <th className="px-6 py-4 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {inboxes.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-slate-400">No sending accounts connected yet.</td></tr>
              ) : (
                inboxes.map((inbox) => (
                  <tr key={inbox.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center"><Mail size={20} /></div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{inbox.email}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{inbox.provider}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`w-10 h-5 rounded-full relative ${inbox.warmup ? 'bg-blue-600' : 'bg-slate-200'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${inbox.warmup ? 'right-1' : 'left-1'}`} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold">{inbox.sentToday} / {inbox.limit_val}</td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-500 font-bold text-sm">{inbox.health}%</span>
                    </td>
                    <td className="px-6 py-4 text-right"><Settings size={18} className="text-slate-400 cursor-pointer ml-auto" /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Inboxes;


import React, { useState } from 'react';
import { 
  Mail, Shield, Zap, TrendingUp, Plus, Activity, 
  Settings, CheckCircle2, AlertTriangle, AlertCircle, X, Loader2, Globe, Server,
  Lock, Key, Info, ExternalLink
} from 'lucide-react';

const Inboxes = () => {
  const [inboxes, setInboxes] = useState([
    { id: '1', email: 'alex@growthflow.io', provider: 'Gmail', health: 98, sentToday: 42, limit: 50, warmup: true },
    { id: '2', email: 'outreach@growthflow.io', provider: 'Outlook', health: 84, sentToday: 18, limit: 30, warmup: true },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeConnectionTab, setActiveConnectionTab] = useState<'Google' | 'Outlook' | 'SMTP'>('Google');
  const [isConnecting, setIsConnecting] = useState(false);
  const [newInbox, setNewInbox] = useState({ email: '', provider: 'SMTP', host: '', port: '587', password: '' });

  const handleAddInbox = (e: React.FormEvent) => {
    e.preventDefault();
    setIsConnecting(true);
    // Simulate API connection delay
    setTimeout(() => {
      const id = Math.random().toString(36).substr(2, 9);
      setInboxes([...inboxes, { 
        ...newInbox, 
        provider: activeConnectionTab,
        id, 
        health: 100, 
        sentToday: 0, 
        limit: 50, 
        warmup: true 
      }]);
      setIsConnecting(false);
      setShowAddModal(false);
      setNewInbox({ email: '', provider: 'SMTP', host: '', port: '587', password: '' });
    }, 2000);
  };

  const handleGoogleConnect = () => {
    setIsConnecting(true);
    // Simulate Google OAuth flow
    setTimeout(() => {
      const id = Math.random().toString(36).substr(2, 9);
      setInboxes([...inboxes, { 
        email: 'new-gmail-user@gmail.com',
        provider: 'Gmail',
        id, 
        health: 100, 
        sentToday: 0, 
        limit: 50, 
        warmup: true 
      }]);
      setIsConnecting(false);
      setShowAddModal(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Email Inboxes</h1>
          <p className="text-slate-500 dark:text-slate-400">Connect sending accounts and monitor deliverability.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => { setShowAddModal(true); setActiveConnectionTab('Google'); }}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-sm font-bold shadow-sm hover:border-blue-500 transition-all active:scale-95"
          >
            <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
            Connect Gmail
          </button>
          <button 
            onClick={() => { setShowAddModal(true); setActiveConnectionTab('SMTP'); }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Plus size={20} /> Add Account
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-3 text-slate-500 mb-2">
             <Shield size={18} />
             <span className="text-sm font-semibold uppercase tracking-wider">Overall Reputation</span>
           </div>
           <p className="text-3xl font-bold text-slate-900 dark:text-white">Excellent</p>
           <div className="mt-4 flex items-center gap-2">
             <div className="h-2 flex-1 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-green-500 w-[94%]"></div>
             </div>
             <span className="text-xs font-bold text-green-600">94%</span>
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-3 text-slate-500 mb-2">
             <Zap size={18} />
             <span className="text-sm font-semibold uppercase tracking-wider">Warmup Active</span>
           </div>
           <p className="text-3xl font-bold text-slate-900 dark:text-white">{inboxes.filter(i => i.warmup).length} Accounts</p>
           <p className="text-xs text-slate-500 mt-2">Generating peer interactions daily.</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
           <div className="flex items-center gap-3 text-slate-500 mb-2">
             <TrendingUp size={18} />
             <span className="text-sm font-semibold uppercase tracking-wider">Daily Volume</span>
           </div>
           <p className="text-3xl font-bold text-slate-900 dark:text-white">{inboxes.reduce((acc, curr) => acc + curr.sentToday, 0)} / {inboxes.reduce((acc, curr) => acc + curr.limit, 0)}</p>
           <p className="text-xs text-slate-500 mt-2">Usage based on connected account limits.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Account</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Warmup</th>
                <th className="px-6 py-4">Sent Today</th>
                <th className="px-6 py-4">Health</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {inboxes.map((inbox) => (
                <tr key={inbox.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                        {inbox.provider === 'Gmail' ? <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" /> : <Mail size={20} />}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{inbox.email}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{inbox.provider}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${inbox.health > 80 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Connected</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${inbox.warmup ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${inbox.warmup ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{inbox.sentToday} / {inbox.limit}</p>
                    <div className="w-24 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1 overflow-hidden shadow-inner">
                      <div className="h-full bg-blue-500 transition-all duration-500" style={{width: `${(inbox.sentToday / inbox.limit) * 100}%`}}></div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {inbox.health > 90 ? <CheckCircle2 size={16} className="text-green-500" /> : inbox.health > 70 ? <AlertTriangle size={16} className="text-amber-500" /> : <AlertCircle size={16} className="text-red-500" />}
                      <span className={`text-sm font-bold ${inbox.health > 90 ? 'text-green-600' : inbox.health > 70 ? 'text-amber-600' : 'text-red-600'}`}>{inbox.health}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 group-hover:text-blue-500 transition-colors">
                      <Settings size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Connect Email Account</h2>
                <p className="text-sm text-slate-500">Choose your preferred connection method.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 flex gap-1 rounded-2xl mx-8 mt-6 border border-slate-200 dark:border-slate-700">
              {(['Google', 'Outlook', 'SMTP'] as const).map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveConnectionTab(tab)}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${activeConnectionTab === tab ? 'bg-white dark:bg-slate-900 text-blue-600 shadow-sm border border-slate-100 dark:border-slate-800' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeConnectionTab === 'Google' ? (
              <div className="p-8 space-y-8 animate-in fade-in duration-300">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto shadow-sm">
                    <img src="https://www.google.com/favicon.ico" className="w-8 h-8" alt="Google" />
                  </div>
                  <h3 className="text-lg font-bold">Connect your Google Inbox</h3>
                </div>

                {/* Manual Email/Password Form */}
                <form onSubmit={handleAddInbox} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Gmail Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        required
                        placeholder="you@gmail.com"
                        value={newInbox.email}
                        onChange={(e) => setNewInbox({...newInbox, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">App Password</label>
                      <a href="https://myaccount.google.com/apppasswords" target="_blank" className="text-[10px] text-blue-600 font-bold hover:underline flex items-center gap-1">
                        How to get one? <ExternalLink size={10} />
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="password" 
                        required
                        placeholder="Your 16-character app password"
                        value={newInbox.password}
                        onChange={(e) => setNewInbox({...newInbox, password: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isConnecting}
                    className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold transition-all hover:opacity-90 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isConnecting ? <Loader2 className="animate-spin" size={20} /> : <Mail size={20} />}
                    {isConnecting ? 'Connecting...' : 'Connect with Password'}
                  </button>
                </form>

                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                  <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
                  <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                </div>

                {/* OAuth Option */}
                <button 
                  onClick={handleGoogleConnect}
                  disabled={isConnecting}
                  className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-blue-500 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                >
                  {isConnecting ? (
                    <Loader2 className="animate-spin text-blue-600" size={24} />
                  ) : (
                    <>
                      <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="G" />
                      Sign in with Google OAuth
                    </>
                  )}
                </button>
                
                <div className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-2xl border border-amber-100 dark:border-amber-800/30 text-left">
                  <Shield className="text-amber-600 shrink-0" size={18} />
                  <p className="text-[10px] text-amber-800 dark:text-amber-400 leading-relaxed font-medium">
                    Security Tip: Use an <b>App Password</b> instead of your main account password to keep your Google account secure.
                  </p>
                </div>
              </div>
            ) : activeConnectionTab === 'SMTP' ? (
              <form onSubmit={handleAddInbox} className="p-8 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      required
                      placeholder="you@yourdomain.com"
                      value={newInbox.email}
                      onChange={(e) => setNewInbox({...newInbox, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">SMTP Host</label>
                    <div className="relative">
                      <Server className="absolute left-3 top-3 text-slate-400" size={18} />
                      <input 
                        type="text" 
                        required
                        placeholder="smtp.domain.com"
                        value={newInbox.host}
                        onChange={(e) => setNewInbox({...newInbox, host: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Port</label>
                    <input 
                      type="text" 
                      required
                      value={newInbox.port}
                      onChange={(e) => setNewInbox({...newInbox, port: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                    />
                  </div>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-start gap-3">
                  <Globe className="text-blue-600 shrink-0 mt-0.5" size={18} />
                  <p className="text-xs text-blue-800 dark:text-blue-400 leading-relaxed">
                    Make sure to update your DNS records (SPF, DKIM, DMARC) for this domain in the <b>Settings > Domains</b> tab to ensure 100% deliverability.
                  </p>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500">Cancel</button>
                  <button 
                    type="submit" 
                    disabled={isConnecting}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
                  >
                    {isConnecting ? <Loader2 className="animate-spin" size={18} /> : 'Verify & Connect'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-8 text-center space-y-8 animate-in fade-in duration-300">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-[30px] border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto shadow-sm">
                   <Mail size={40} className="text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold">Connect your Outlook Inbox</h3>
                  <p className="text-sm text-slate-500 max-w-xs mx-auto">We use official OAuth2 to securely connect your account without storing your password.</p>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={handleGoogleConnect}
                    disabled={isConnecting}
                    className="w-full py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold flex items-center justify-center gap-3 hover:border-blue-500 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                  >
                    {isConnecting ? (
                      <Loader2 className="animate-spin text-blue-600" size={24} />
                    ) : (
                      <>
                        <Mail size={20} className="text-blue-600" />
                        Sign in with Outlook OAuth
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Inboxes;

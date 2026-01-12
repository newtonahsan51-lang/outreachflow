
import React, { useState } from 'react';
import { 
  User, Users, Globe, Shield, Bell, Key, Webhook, 
  Trash2, Plus, CheckCircle2, AlertCircle, 
  ExternalLink, Copy, RefreshCw, FileText, 
  Link as LinkIcon, Save, Eye, X, Info, ClipboardCheck, Server,
  Lock, Smartphone, Monitor, Mail, Slack, Terminal, Play, 
  ShieldAlert, Settings as SettingsIcon, Check, Rocket, HelpCircle, ChevronRight,
  Zap, ArrowRight, MousePointer2, Loader2
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Quick Start');
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production API', key: 'pk_live_f82k...92k1', created: '2024-01-15', lastUsed: '2 hours ago' },
    { id: '2', name: 'Development', key: 'pk_test_a19s...2l88', created: '2024-02-10', lastUsed: 'Yesterday' },
  ]);
  const [domains, setDomains] = useState([
    { id: '1', name: 'growthflow.io', dkim: 'Verified', spf: 'Verified', dmarc: 'Verified', status: 'Active' },
    { id: '2', name: 'outreach.growthflow.io', dkim: 'Pending', spf: 'Verified', dmarc: 'Missing', status: 'Warning' },
  ]);
  const [connectedGmails, setConnectedGmails] = useState([
    { id: '1', email: 'alex@growthflow.io', status: 'Active', lastSync: '2m ago' }
  ]);
  const [webhooks, setWebhooks] = useState([
    { id: '1', url: 'https://api.myagency.com/hooks/leads', events: ['reply.received', 'meeting.booked'], status: 'Active' }
  ]);
  const [notificationSettings, setNotificationSettings] = useState({
    email: { campaign_finished: true, daily_summary: true, security_alerts: true },
    slack: { campaign_finished: false, daily_summary: true, security_alerts: true },
    in_app: { campaign_finished: true, daily_summary: true, security_alerts: true }
  });

  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [newKeyData, setNewKeyData] = useState<any>(null);
  
  const [newDomainName, setNewDomainName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [webhookForm, setWebhookForm] = useState({ url: '', events: [] as string[] });

  const generateApiKey = (name: string = "New Access Key") => {
    const key = 'sk_' + Math.random().toString(36).substr(2, 24);
    const newKey = {
      id: Math.random().toString(36).substr(2, 9),
      name: name,
      key: key.substring(0, 8) + '...',
      created: new Date().toISOString().split('T')[0],
      lastUsed: 'Never'
    };
    setApiKeys([newKey, ...apiKeys]);
    setNewKeyData({ name, fullKey: key });
    setIsGeneratingKey(false);
  };

  const handleConnectGmail = () => {
    setIsConnectingGmail(true);
    setTimeout(() => {
      const newAcc = {
        id: Math.random().toString(36).substr(2, 9),
        email: `user${Math.floor(Math.random()*100)}@gmail.com`,
        status: 'Active',
        lastSync: 'Just now'
      };
      setConnectedGmails([...connectedGmails, newAcc]);
      setIsConnectingGmail(false);
    }, 2000);
  };

  const revokeApiKey = (id: string) => {
    if (confirm("Are you sure you want to revoke this API key?")) {
      setApiKeys(apiKeys.filter(k => k.id !== id));
    }
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    const newHook = {
      id: Math.random().toString(36).substr(2, 9),
      url: webhookForm.url,
      events: webhookForm.events.length > 0 ? webhookForm.events : ['all'],
      status: 'Active'
    };
    setWebhooks([...webhooks, newHook]);
    setIsAddingWebhook(false);
    setWebhookForm({ url: '', events: [] });
  };

  const deleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter(w => w.id !== id));
  };

  const toggleWebhookEvent = (event: string) => {
    setWebhookForm(prev => ({
      ...prev,
      events: prev.events.includes(event) 
        ? prev.events.filter(e => e !== event) 
        : [...prev.events, event]
    }));
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const newDomain = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDomainName,
      dkim: 'Pending',
      spf: 'Pending',
      dmarc: 'Pending',
      status: 'Warning'
    };
    setDomains([...domains, newDomain]);
    setNewDomainName('');
    setIsAddingDomain(false);
    setSelectedDomain(newDomain);
  };

  const simulateVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (selectedDomain) {
        const updated = domains.map(d => 
          d.id === selectedDomain.id 
          ? { ...d, dkim: 'Verified', spf: 'Verified', dmarc: 'Verified', status: 'Active' } 
          : d
        );
        setDomains(updated);
        setSelectedDomain({ ...selectedDomain, dkim: 'Verified', spf: 'Verified', dmarc: 'Verified', status: 'Active' });
      }
    }, 2000);
  };

  const renderQuickStart = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-10 shadow-xl shadow-blue-500/5">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Rocket size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">সহজ সেটআপ গাইড (Quick Start)</h2>
            <p className="text-slate-500">নিচের ধাপগুলো অনুসরণ করে আপনার ইমেল ক্যাম্পেইন শুরু করুন।</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-10">
          {[
            { 
              step: '১', 
              title: 'আপনার ডোমেইন সেটআপ', 
              desc: 'আপনার কাস্টম ডোমেইনটি যুক্ত করে DNS রেকর্ড (SPF/DKIM) ভেরিফাই করে নিন। এটি করলে আপনার ইমেল স্প্যামে যাবে না।',
              icon: Globe,
              done: domains.some(d => d.status === 'Active'),
              action: () => setActiveTab('Domains')
            },
            { 
              step: '২', 
              title: 'মাল্টিপল জিমেইল কানেক্ট করুন', 
              desc: 'ইনবক্স ট্যাবে গিয়ে "Connect Gmail" এ ক্লিক করুন। আপনি চাইলে একসাথে ৫-১০টি বা তার বেশি জিমেইল কানেক্ট করতে পারেন।',
              icon: Mail,
              done: false,
              action: () => window.location.hash = '#/inboxes'
            },
            { 
              step: '৩', 
              title: 'লিড ফাইল (CSV) আপলোড করুন', 
              desc: 'লিড ট্যাবে গিয়ে আপনার কাস্টমারদের লিস্ট আপলোড করুন।',
              icon: Users,
              done: false,
              action: () => window.location.hash = '#/leads'
            },
            { 
              step: '৪', 
              title: 'সিকুয়েন্স ও ক্যাম্পেইন চালু করুন', 
              desc: 'আপনার মেসেজ লিখুন এবং কানেক্ট করা জিমেইলগুলো সিলেক্ট করে ক্যাম্পেইন চালু দিন।',
              icon: Zap,
              done: false,
              action: () => window.location.hash = '#/campaigns'
            }
          ].map((item, i) => (
            <div 
              key={i}
              onClick={item.action}
              className={`flex items-center gap-6 p-6 rounded-3xl border transition-all cursor-pointer group ${
                item.done 
                ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/50' 
                : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-500'
              }`}
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${
                item.done 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white dark:bg-slate-900 text-slate-400 group-hover:text-blue-600'
              }`}>
                {item.done ? <CheckCircle2 size={24} /> : item.step}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold ${item.done ? 'text-emerald-900 dark:text-emerald-400' : 'text-slate-900 dark:text-white'}`}>{item.title}</h4>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
              </div>
              <ChevronRight className="text-slate-300 group-hover:text-blue-500 transition-colors" />
            </div>
          ))}
        </div>

        {/* Specific Multi-Gmail Guide */}
        <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Gmail" />
              একাধিক জিমেইল থেকে ইমেল পাঠানোর নিয়ম:
            </h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold">১</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  প্রথমে <span className="text-white font-bold underline cursor-pointer" onClick={() => window.location.hash = '#/inboxes'}>Inboxes</span> সেকশনে গিয়ে আপনার সবগুলো জিমেইল এক এক করে কানেক্ট করুন।
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold">২</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  ক্যাম্পেইন তৈরি করার সময় <span className="text-blue-400 font-bold">Sequence Builder</span> এ গিয়ে "Select Sending Accounts" অপশন থেকে আপনার সবগুলো জিমেইল সিলেক্ট করে দিন।
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0 font-bold">৩</div>
                <p className="text-sm text-slate-300 leading-relaxed">
                  সিস্টেম নিজে থেকেই একেকবার একেক জিমেইল ব্যবহার করে ইমেল পাঠাবে। এতে আপনার জিমেইল একাউন্ট সেফ থাকবে এবং ডেলিভারিবিলিটি বাড়বে।
                </p>
              </div>
            </div>

            <button 
              onClick={() => window.location.hash = '#/inboxes'}
              className="mt-10 px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-blue-50 transition-all active:scale-95"
            >
              এখনই ইনবক্স কানেক্ট করুন <ArrowRight size={18} />
            </button>
          </div>
          
          <div className="absolute -bottom-10 -right-10 opacity-10 blur-2xl w-64 h-64 bg-blue-500 rounded-full"></div>
        </div>

        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/10 rounded-3xl border border-amber-100 dark:border-amber-800 flex items-start gap-4">
          <Info className="text-amber-600 shrink-0 mt-0.5" size={24} />
          <div>
            <p className="text-sm text-amber-900 dark:text-amber-400 font-bold">গুরুত্বপূর্ণ টিপস:</p>
            <p className="text-xs text-amber-800 dark:text-amber-500 mt-1 leading-relaxed">
              প্রতিটি জিমেইল একাউন্ট থেকে দিনে ২৫-৫০টির বেশি ইমেল না পাঠানোই ভালো। অনেকগুলো জিমেইল কানেক্ট করলে আপনি খুব সহজেই দিনে ১০০০+ ইমেল পাঠাতে পারবেন কোনো রিস্ক ছাড়াই।
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Profile Settings</h3>
        <div className="flex items-center gap-6 mb-8">
          <img src="https://picsum.photos/seed/alex/80/80" className="w-20 h-20 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm" />
          <div>
            <button className="px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-bold mr-3 transition-colors hover:opacity-90 active:scale-95">Change Avatar</button>
            <button className="text-xs font-bold text-red-500 hover:text-red-600 transition-colors">Remove</button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">First Name</label>
            <input type="text" defaultValue="Alex" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase">Last Name</label>
            <input type="text" defaultValue="Rivera" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
          </div>
        </div>
      </div>
    </div>
  );

  const renderDomains = () => (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Sending Domains</h3>
            <p className="text-sm text-slate-500">Configure SPF, DKIM, and DMARC to improve deliverability.</p>
          </div>
          <button 
            onClick={() => setIsAddingDomain(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-all active:scale-95"
          >
            <Plus size={18} /> Add Domain
          </button>
        </div>

        <div className="space-y-4">
          {domains.map(domain => (
            <div key={domain.id} className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl group hover:border-blue-500/50 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${domain.status === 'Active' ? 'bg-green-500' : 'bg-amber-500'}`} />
                  <span className="text-lg font-bold">{domain.name}</span>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedDomain(domain)}
                    className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1 transition-all"
                  >
                    <RefreshCw size={14} className={isVerifying && selectedDomain?.id === domain.id ? "animate-spin" : ""} /> 
                    {domain.status === 'Active' ? 'Re-verify' : 'Verify Domain'}
                  </button>
                  <button className="text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Gmail OAuth Section */}
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 shadow-sm">
              <img src="https://www.google.com/favicon.ico" className="w-6 h-6" alt="Google" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Google OAuth Accounts</h3>
              <p className="text-sm text-slate-500">Connect Gmail accounts via secure OAuth for high-volume sending.</p>
            </div>
          </div>
          <button 
            onClick={handleConnectGmail}
            disabled={isConnectingGmail}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-95 disabled:opacity-50"
          >
            {isConnectingGmail ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
            {isConnectingGmail ? 'Connecting...' : 'Connect Google Account'}
          </button>
        </div>

        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 mb-8 flex items-start gap-4">
          <Info className="text-blue-600 mt-1" size={20} />
          <div className="space-y-1">
            <p className="text-sm font-bold text-blue-900 dark:text-blue-300">OAuth Instructions</p>
            <p className="text-xs text-blue-800/70 dark:text-blue-400/70 leading-relaxed">
              Click the button above to authorize OutreachFlow via Google. For best deliverability, ensure you've enabled IMAP in your Gmail settings and use accounts associated with your verified sending domains.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {connectedGmails.length > 0 ? (
            connectedGmails.map(acc => (
              <div key={acc.id} className="p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between group transition-all hover:border-blue-500/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center">
                    <Mail size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{acc.email}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {acc.status}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">• Last Sync: {acc.lastSync}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-500 transition-colors shadow-sm">
                    <RefreshCw size={16} />
                  </button>
                  <button 
                    onClick={() => setConnectedGmails(connectedGmails.filter(g => g.id !== acc.id))}
                    className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-colors shadow-sm"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
              <p className="text-sm text-slate-400">No Google accounts connected yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAPIKeys = () => (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">API Keys</h3>
            <p className="text-sm text-slate-500">Manage your workspace API keys.</p>
          </div>
          <button onClick={() => setIsGeneratingKey(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold text-sm"><Plus size={18} /></button>
        </div>
        <div className="space-y-4">
          {apiKeys.map(key => (
            <div key={key.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{key.name}</p>
                <code className="text-xs text-slate-400">{key.key}</code>
              </div>
              <button onClick={() => revokeApiKey(key.id)} className="text-red-500"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workspace Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">আপনার ব্যক্তিগত ও ওয়ার্কস্পেস সেটিংস এখান থেকে কন্ট্রোল করুন।</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          {[
            { icon: Rocket, label: 'Quick Start' },
            { icon: User, label: 'Profile' },
            { icon: Globe, label: 'Domains' },
            { icon: Key, label: 'API Keys' },
            { icon: LinkIcon, label: 'Unsubscribe' },
            { icon: Webhook, label: 'Webhooks' },
          ].map((item) => (
            <button 
              key={item.label} 
              onClick={() => setActiveTab(item.label)}
              className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.label ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95'}`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </aside>

        <div className="md:col-span-3">
          {activeTab === 'Quick Start' && renderQuickStart()}
          {activeTab === 'Profile' && renderProfile()}
          {activeTab === 'Domains' && renderDomains()}
          {activeTab === 'API Keys' && renderAPIKeys()}
          {['Unsubscribe', 'Webhooks'].includes(activeTab) && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center text-slate-400">
               <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <SettingsIcon size={32} />
               </div>
               <h3 className="text-lg font-bold">{activeTab} Section</h3>
               <p className="text-sm mt-2">Coming in the next update.</p>
             </div>
          )}
        </div>
      </div>

      {/* NEW: Add Domain Modal */}
      {isAddingDomain && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Sending Domain</h2>
              <button onClick={() => setIsAddingDomain(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddDomain} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Domain Name</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. outreach.com"
                    value={newDomainName}
                    onChange={(e) => setNewDomainName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                  />
                </div>
              </div>
              <button 
                type="submit" 
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95"
              >
                Add Domain
              </button>
            </form>
          </div>
        </div>
      )}

      {isGeneratingKey && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Generate API Key</h2>
              <button onClick={() => setIsGeneratingKey(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6">
              <input 
                id="keyLabel"
                type="text" 
                placeholder="e.g. CRM Integration"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl" 
              />
              <button 
                onClick={() => generateApiKey((document.getElementById('keyLabel') as HTMLInputElement).value)}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold"
              >
                Create API Key
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDomain && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Verify {selectedDomain.name}</h2>
              <button onClick={() => setSelectedDomain(null)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-8">
              <p className="text-sm text-slate-500">Add DNS records to your provider.</p>
              <button 
                onClick={simulateVerification}
                disabled={isVerifying}
                className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold flex items-center gap-2"
              >
                {isVerifying ? <RefreshCw size={18} className="animate-spin" /> : <Check size={18} />}
                {isVerifying ? 'Verifying...' : 'Check Records'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;


import React, { useState } from 'react';
import { 
  User, Globe, Shield, Bell, Key, Webhook, 
  Trash2, Plus, CheckCircle2, AlertCircle, 
  ExternalLink, Copy, RefreshCw, FileText, 
  Link as LinkIcon, Save, Eye, X, Info, ClipboardCheck, Server,
  Lock, Smartphone, Monitor, Mail, Slack, Terminal, Play, 
  ShieldAlert, Settings as SettingsIcon, Check, Rocket, HelpCircle, ChevronRight,
  Zap, ArrowRight, MousePointer2, Loader2,
  Users, ShieldCheck, UserMinus, Search, Activity
} from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('Quick Start');
  const [apiKeys, setApiKeys] = useState([
    { id: '1', name: 'Production API', key: 'pk_live_f82k...92k1', created: '2024-01-15', lastUsed: '2 hours ago' },
    { id: '2', name: 'Development', key: 'pk_test_a19s...2l88', created: '2024-02-10', lastUsed: 'Yesterday' },
  ]);
  const [domains, setDomains] = useState([
    { 
      id: '1', 
      name: 'growthflow.io', 
      dkim: 'Verified', 
      spf: 'Verified', 
      dmarc: 'Verified', 
      status: 'Active',
      records: {
        spf: 'v=spf1 include:_spf.google.com ~all',
        dkim: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA7...',
        dmarc: 'v=DMARC1; p=quarantine; rua=mailto:dmarc@growthflow.io'
      }
    },
    { 
      id: '2', 
      name: 'outreach.growthflow.io', 
      dkim: 'Pending', 
      spf: 'Verified', 
      dmarc: 'Missing', 
      status: 'Warning',
      records: {
        spf: 'v=spf1 include:_spf.google.com ~all',
        dkim: 'v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA3...',
        dmarc: 'v=DMARC1; p=none; rua=mailto:admin@growthflow.io'
      }
    },
  ]);
  const [connectedGmails, setConnectedGmails] = useState([
    { id: '1', email: 'alex@growthflow.io', status: 'Active', lastSync: '2m ago' }
  ]);
  
  // Webhooks State
  const [webhooks, setWebhooks] = useState<any[]>([
    { id: '1', url: 'https://api.myagency.com/hooks/leads', events: ['reply.received', 'meeting.booked'], status: 'Active' }
  ]);
  const [isAddingWebhook, setIsAddingWebhook] = useState(false);
  const [newWebhook, setNewWebhook] = useState({
    url: '',
    events: [] as string[]
  });

  // Unsubscribe State
  const [unsubscribeSettings, setUnsubscribeSettings] = useState({
    linkText: 'Unsubscribe',
    includeLink: true,
    autoUnsubscribeOnReply: false
  });
  const [suppressionList, setSuppressionList] = useState([
    { id: '1', email: 'spam-trap@competitor.com', addedAt: '2024-02-01' },
    { id: '2', email: 'blocked-user@gmail.com', addedAt: '2024-02-15' },
  ]);
  const [newSuppressionEmail, setNewSuppressionEmail] = useState('');

  const [isAddingDomain, setIsAddingDomain] = useState(false);
  const [isConnectingGmail, setIsConnectingGmail] = useState(false);
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  
  const [newDomainName, setNewDomainName] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);

  const availableEvents = [
    { id: 'lead.created', label: 'Lead Created', desc: 'Triggered when a new lead is added.' },
    { id: 'email.opened', label: 'Email Opened', desc: 'Triggered when a recipient opens an email.' },
    { id: 'reply.received', label: 'Reply Received', desc: 'Triggered when a lead replies to a sequence.' },
    { id: 'meeting.booked', label: 'Meeting Booked', desc: 'Triggered when a calendar event is scheduled.' },
    { id: 'unsubscribe.requested', label: 'Unsubscribe', desc: 'Triggered when a lead opts out.' }
  ];

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(id);
    setTimeout(() => setCopySuccess(null), 2000);
  };

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

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const newDomain = {
      id: Math.random().toString(36).substr(2, 9),
      name: newDomainName,
      dkim: 'Pending',
      spf: 'Pending',
      dmarc: 'Pending',
      status: 'Warning',
      records: {
        spf: 'v=spf1 include:_spf.google.com ~all',
        dkim: `v=DKIM1; k=rsa; p=${Math.random().toString(36).substring(2, 100)}`,
        dmarc: 'v=DMARC1; p=none;'
      }
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

  const handleAddSuppression = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSuppressionEmail) return;
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      email: newSuppressionEmail,
      addedAt: new Date().toISOString().split('T')[0]
    };
    setSuppressionList([newEntry, ...suppressionList]);
    setNewSuppressionEmail('');
  };

  const handleAddWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhook.url || newWebhook.events.length === 0) return;
    const webhook = {
      id: Math.random().toString(36).substr(2, 9),
      url: newWebhook.url,
      events: newWebhook.events,
      status: 'Active'
    };
    setWebhooks([...webhooks, webhook]);
    setNewWebhook({ url: '', events: [] });
    setIsAddingWebhook(false);
  };

  const toggleWebhookStatus = (id: string) => {
    setWebhooks(webhooks.map(wh => wh.id === id ? { ...wh, status: wh.status === 'Active' ? 'Inactive' : 'Active' } : wh));
  };

  const deleteWebhook = (id: string) => {
    if (confirm("Are you sure you want to delete this webhook?")) {
      setWebhooks(webhooks.filter(wh => wh.id !== id));
    }
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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold">Sending Domains</h3>
            <p className="text-sm text-slate-500">Configure SPF, DKIM, and DMARC to improve deliverability.</p>
          </div>
          <button 
            onClick={() => setIsAddingDomain(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-all active:scale-95 shadow-lg shadow-blue-500/20"
          >
            <Plus size={18} /> Add Domain
          </button>
        </div>
        <div className="space-y-4">
          {domains.map(domain => (
            <div key={domain.id} className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[24px] group hover:border-blue-500/50 transition-all">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${domain.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'} border shadow-sm`}>
                    <Globe size={24} />
                  </div>
                  <div>
                    <span className="text-lg font-bold text-slate-900 dark:text-white">{domain.name}</span>
                    <div className="flex flex-wrap items-center gap-3 mt-1.5">
                      {['spf', 'dkim', 'dmarc'].map((type) => (
                        <div key={type} className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${domain[type as keyof typeof domain] === 'Verified' ? 'bg-emerald-500' : domain[type as keyof typeof domain] === 'Pending' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{type}:</span>
                          <span className={`text-[10px] font-bold ${domain[type as keyof typeof domain] === 'Verified' ? 'text-emerald-600' : 'text-slate-500'}`}>
                            {domain[type as keyof typeof domain]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setSelectedDomain(domain)} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-blue-600 hover:border-blue-500 transition-all shadow-sm">
                    <RefreshCw size={14} className={isVerifying && selectedDomain?.id === domain.id ? "animate-spin" : ""} /> 
                    {domain.status === 'Active' ? 'Re-verify' : 'Verify Domain'}
                  </button>
                  <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-colors shadow-sm">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
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
              <button onClick={() => setApiKeys(apiKeys.filter(k => k.id !== key.id))} className="text-red-500"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderUnsubscribe = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-600 rounded-2xl flex items-center justify-center border border-rose-100 dark:border-rose-800">
            <UserMinus size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Unsubscribe Settings</h3>
            <p className="text-sm text-slate-500">Customize how recipients opt-out of your sequences.</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl">
            <div>
              <p className="text-sm font-bold">Include Unsubscribe Link</p>
              <p className="text-xs text-slate-500">Automatically append an opt-out link to all outgoing emails.</p>
            </div>
            <button 
              onClick={() => setUnsubscribeSettings({...unsubscribeSettings, includeLink: !unsubscribeSettings.includeLink})}
              className={`w-12 h-6 rounded-full relative transition-colors ${unsubscribeSettings.includeLink ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-800'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${unsubscribeSettings.includeLink ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Unsubscribe Link Text</label>
            <input 
              type="text" 
              value={unsubscribeSettings.linkText}
              onChange={(e) => setUnsubscribeSettings({...unsubscribeSettings, linkText: e.target.value})}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-sm" 
            />
          </div>
          <div className="flex justify-end pt-2">
            <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2">
              <Save size={18} /> Save Settings
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold">Global Suppression List</h3>
            <p className="text-sm text-slate-500">Emails in this list will never be contacted.</p>
          </div>
        </div>
        <form onSubmit={handleAddSuppression} className="flex gap-3 mb-8">
          <input 
            type="email" 
            required
            placeholder="e.g. support@competitor.com"
            value={newSuppressionEmail}
            onChange={(e) => setNewSuppressionEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none text-sm" 
          />
          <button type="submit" className="px-6 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm">Add Email</button>
        </form>
        <div className="space-y-3">
          {suppressionList.map(item => (
            <div key={item.id} className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold">{item.email}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Added: {item.addedAt}</p>
              </div>
              <button onClick={() => setSuppressionList(suppressionList.filter(s => s.id !== item.id))} className="text-slate-300 hover:text-red-500"><Trash2 size={18} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100 dark:border-blue-800">
              <Webhook size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Webhooks Management</h3>
              <p className="text-sm text-slate-500">Receive real-time data payloads on specific events.</p>
            </div>
          </div>
          <button 
            onClick={() => setIsAddingWebhook(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Create Webhook
          </button>
        </div>

        <div className="space-y-4">
          {webhooks.length === 0 ? (
            <div className="p-12 text-center text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-800">
              <Activity className="mx-auto mb-3 opacity-20" size={40} />
              <p className="text-sm font-bold text-slate-500">No webhooks configured yet.</p>
            </div>
          ) : (
            webhooks.map(wh => (
              <div key={wh.id} className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl group transition-all hover:border-blue-500/50">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${wh.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{wh.url}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {wh.events.map((ev: string) => (
                        <span key={ev} className="px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                          {ev}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleWebhookStatus(wh.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                        wh.status === 'Active' 
                        ? 'bg-white dark:bg-slate-800 text-slate-500 hover:text-amber-600' 
                        : 'bg-blue-600 text-white border-blue-600'
                      }`}
                    >
                      {wh.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => deleteWebhook(wh.id)}
                      className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h3 className="text-xl font-bold mb-3 flex items-center gap-3">
              <Terminal className="text-blue-400" /> Webhook Security
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              Use this signing secret to verify incoming payloads.
            </p>
            <div className="flex gap-2">
              <input readOnly value="whsec_82jks92k...l2p" className="flex-1 bg-white/10 border border-white/10 rounded-xl px-4 py-2.5 text-xs font-mono text-blue-200 outline-none" />
              <button onClick={() => copyToClipboard('whsec_82jks92kl2p', 'secret')} className="px-4 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all">
                {copySuccess === 'secret' ? <Check size={18} /> : <Copy size={18} />}
              </button>
            </div>
          </div>
          <div className="hidden lg:block opacity-20">
            <Webhook size={120} />
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Workspace Settings</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your personal and workspace configurations.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1 space-y-1">
          {[
            { icon: Rocket, label: 'Quick Start' },
            { icon: User, label: 'Profile' },
            { icon: Globe, label: 'Domains' },
            { icon: Key, label: 'API Keys' },
            { icon: UserMinus, label: 'Unsubscribe' },
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
          {activeTab === 'Unsubscribe' && renderUnsubscribe()}
          {activeTab === 'Webhooks' && renderWebhooks()}
        </div>
      </div>

      {/* Add Domain Modal */}
      {isAddingDomain && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add Sending Domain</h2>
              <button onClick={() => setIsAddingDomain(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddDomain} className="p-8 space-y-6">
              <input 
                type="text" 
                required
                placeholder="e.g. outreach.com"
                value={newDomainName}
                onChange={(e) => setNewDomainName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none" 
              />
              <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Add Domain</button>
            </form>
          </div>
        </div>
      )}

      {/* Add Webhook Modal */}
      {isAddingWebhook && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Configure New Webhook</h2>
              <button onClick={() => setIsAddingWebhook(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20}/></button>
            </div>
            <form onSubmit={handleAddWebhook} className="p-8 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Endpoint URL</label>
                <input 
                  type="url" 
                  required
                  placeholder="https://your-api.com/webhooks"
                  value={newWebhook.url}
                  onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none" 
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Select Events</label>
                <div className="space-y-2">
                  {availableEvents.map(ev => (
                    <label key={ev.id} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-950 border border-slate-100 rounded-2xl cursor-pointer hover:border-blue-500 transition-all">
                      <input 
                        type="checkbox" 
                        className="mt-1"
                        checked={newWebhook.events.includes(ev.id)}
                        onChange={(e) => {
                          const updated = e.target.checked 
                            ? [...newWebhook.events, ev.id] 
                            : newWebhook.events.filter(id => id !== ev.id);
                          setNewWebhook({ ...newWebhook, events: updated });
                        }}
                      />
                      <div>
                        <p className="text-sm font-bold">{ev.label}</p>
                        <p className="text-[10px] text-slate-500">{ev.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              <button type="submit" disabled={!newWebhook.url || newWebhook.events.length === 0} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold disabled:opacity-50">Create Webhook</button>
            </form>
          </div>
        </div>
      )}

      {/* Verify Domain Modal */}
      {selectedDomain && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in-95 flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Verify {selectedDomain.name}</h2>
              <button onClick={() => setSelectedDomain(null)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              {['spf', 'dkim', 'dmarc'].map(type => (
                <div key={type} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">{type} Record (TXT)</h4>
                    {selectedDomain[type] === 'Verified' && <span className="text-[10px] font-bold text-emerald-600">VERIFIED</span>}
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-2xl flex flex-col gap-2">
                    <code className="text-xs font-mono break-all">{selectedDomain.records[type]}</code>
                    <button onClick={() => copyToClipboard(selectedDomain.records[type], type)} className="self-end text-blue-600 font-bold text-[10px] flex items-center gap-1">
                      {copySuccess === type ? <Check size={10}/> : <Copy size={10}/>} {copySuccess === type ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-4">
              <button onClick={() => setSelectedDomain(null)} className="px-6 py-2.5 text-sm font-bold text-slate-500">Close</button>
              <button onClick={simulateVerification} disabled={isVerifying} className="px-8 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold flex items-center gap-2">
                {isVerifying ? <RefreshCw size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
                {isVerifying ? 'Verifying...' : 'Verify Records'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API Key Modal */}
      {isGeneratingKey && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95">
             <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Generate API Key</h2>
              <button onClick={() => setIsGeneratingKey(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20}/></button>
            </div>
            <div className="p-8 space-y-6">
              <input id="keyLabel" type="text" placeholder="e.g. CRM Integration" className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 rounded-2xl outline-none" />
              <button onClick={() => generateApiKey((document.getElementById('keyLabel') as HTMLInputElement).value)} className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold">Create API Key</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;

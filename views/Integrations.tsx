
import React, { useState, useMemo } from 'react';
import { 
  Layers, Search, Check, Plus, ExternalLink, 
  Slack, Database, Zap, Globe, Github, 
  MessageSquare, Users, Link2, Info, X, 
  Loader2, Settings2, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';

const CATEGORIES = ['All', 'CRM', 'Communication', 'Automation', 'Data Enrichment'];

const INITIAL_INTEGRATIONS = [
  {
    id: 'salesforce',
    name: 'Salesforce',
    category: 'CRM',
    description: 'Sync leads and campaign activity directly to your Salesforce CRM.',
    icon: Database,
    color: 'blue',
    docsUrl: '#'
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    category: 'CRM',
    description: 'Automatic bidirectional sync for contacts and deal stages.',
    icon: Database,
    color: 'orange',
    docsUrl: '#'
  },
  {
    id: 'slack',
    name: 'Slack',
    category: 'Communication',
    description: 'Get real-time notifications for replies and meeting bookings.',
    icon: Slack,
    color: 'purple',
    docsUrl: '#'
  },
  {
    id: 'zapier',
    name: 'Zapier',
    category: 'Automation',
    description: 'Connect OutreachFlow to 5,000+ apps with custom zaps.',
    icon: Zap,
    color: 'orange',
    docsUrl: '#'
  },
  {
    id: 'apollo',
    name: 'Apollo.io',
    category: 'Data Enrichment',
    description: 'Directly import and enrich leads from the Apollo database.',
    icon: Users,
    color: 'blue',
    docsUrl: '#'
  },
  {
    id: 'hunter',
    name: 'Hunter.io',
    category: 'Data Enrichment',
    description: 'Verify email addresses before sending to protect deliverability.',
    icon: Globe,
    color: 'orange',
    docsUrl: '#'
  },
  {
    id: 'pipedrive',
    name: 'Pipedrive',
    category: 'CRM',
    description: 'Keep your sales pipeline updated with OutreachFlow engagement.',
    icon: Database,
    color: 'emerald',
    docsUrl: '#'
  },
  {
    id: 'make',
    name: 'Make.com',
    category: 'Automation',
    description: 'Powerful visual automation to build complex workflows.',
    icon: Zap,
    color: 'indigo',
    docsUrl: '#'
  }
];

const Integrations = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedIds, setConnectedIds] = useState<string[]>(['salesforce', 'slack', 'apollo']);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  const filtered = useMemo(() => {
    return INITIAL_INTEGRATIONS.filter(item => 
      (activeTab === 'All' || item.category === activeTab) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeTab, searchQuery]);

  const handleToggleConnect = (id: string) => {
    setLoadingId(id);
    // Simulate API connection delay
    setTimeout(() => {
      setConnectedIds(prev => 
        prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      );
      setLoadingId(null);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Layers className="text-blue-600" /> App Marketplace
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Connect your favorite tools to supercharge your outreach.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full border border-blue-100 dark:border-blue-800">
          <ShieldCheck size={14} /> {connectedIds.length} Active Connections
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === cat 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-slate-300 transition-colors'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search integrations..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(item => {
          const isConnected = connectedIds.includes(item.id);
          const isLoading = loadingId === item.id;
          
          return (
            <div 
              key={item.id} 
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:shadow-xl hover:border-blue-500/50 transition-all group relative overflow-hidden"
            >
              {isConnected && (
                <div className="absolute top-0 right-0 p-3">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-800 animate-in zoom-in-90">
                    <Check size={10} /> CONNECTED
                  </span>
                </div>
              )}
              
              <div className="flex items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-${item.color}-50 dark:bg-${item.color}-900/20 text-${item.color}-600 flex items-center justify-center border border-${item.color}-100 dark:border-${item.color}-800/50 transition-transform group-hover:scale-110`}>
                  <item.icon size={28} />
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                  {item.category}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <a 
                  href={item.docsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs font-bold text-slate-400 hover:text-blue-500 flex items-center gap-1 transition-colors"
                >
                  Docs <ExternalLink size={12} />
                </a>
                <div className="flex gap-2">
                  {isConnected && (
                    <button 
                      onClick={() => setSelectedApp(item)}
                      className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <Settings2 size={16} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleToggleConnect(item.id)}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                      isConnected 
                      ? 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/10'
                    }`}
                  >
                    {isLoading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : isConnected ? (
                      'Disconnect'
                    ) : (
                      <><Plus size={14} /> Connect</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center bg-white dark:bg-slate-900 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
            <Link2 size={40} />
          </div>
          <h3 className="text-xl font-bold text-slate-600 dark:text-slate-300">No Integrations Found</h3>
          <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">Try adjusting your search or category filters to find what you're looking for.</p>
        </div>
      )}

      {/* Configuration Modal */}
      {selectedApp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-${selectedApp.color}-50 dark:bg-${selectedApp.color}-900/20 text-${selectedApp.color}-600 flex items-center justify-center border border-${selectedApp.color}-100`}>
                  <selectedApp.icon size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{selectedApp.name} Configuration</h2>
                  <p className="text-xs text-slate-500">Manage your connection and data mapping.</p>
                </div>
              </div>
              <button onClick={() => setSelectedApp(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-center gap-3">
                <Check className="text-emerald-600" size={20} />
                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-400">Connection is healthy and active.</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold">Auto-Sync Contacts</p>
                    <p className="text-xs text-slate-500">Push new leads to CRM automatically.</p>
                  </div>
                  <button className="w-11 h-6 bg-blue-600 rounded-full relative">
                    <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold">Event Tracking</p>
                    <p className="text-xs text-slate-500">Sync email opens and clicks to timeline.</p>
                  </div>
                  <button className="w-11 h-6 bg-slate-300 dark:bg-slate-700 rounded-full relative">
                    <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                  </button>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Webhooks URL</label>
                <div className="flex gap-2">
                  <input readOnly value="https://api.outreachflow.io/wh/abc-123" className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs font-mono text-slate-500 outline-none" />
                  <button className="p-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-400 hover:text-blue-500">
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50/50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button onClick={() => setSelectedApp(null)} className="px-6 py-2.5 text-sm font-bold text-slate-500">Close</button>
              <button className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* Developer Section */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-blue-900/40 dark:to-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-md">
            <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
              <Zap className="text-amber-400 fill-amber-400" size={24} /> Custom Webhooks & API
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Need something custom? Build your own workflows by connecting our powerful REST API to your proprietary internal systems or applications.
            </p>
            <div className="flex gap-4">
              <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2">
                View API Docs <ExternalLink size={16} />
              </button>
              <button className="px-6 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl font-bold text-sm transition-all border border-white/10 flex items-center gap-2">
                <Key className="rotate-45" size={16} /> Manage Keys
              </button>
            </div>
          </div>
          <div className="hidden lg:grid grid-cols-2 gap-4">
             <div className="p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
               <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                 <Zap size={24} />
               </div>
               <div>
                 <p className="text-lg font-bold">12.5k</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Daily Calls</p>
               </div>
             </div>
             <div className="p-5 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition-colors">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                 <Check size={24} />
               </div>
               <div>
                 <p className="text-lg font-bold">99.9%</p>
                 <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Uptime</p>
               </div>
             </div>
          </div>
        </div>
        
        {/* Background blobs for flair */}
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-64 h-64 bg-purple-500/10 rounded-full blur-[80px] group-hover:bg-purple-500/20 transition-all duration-700"></div>
      </div>
    </div>
  );
};

const Key = ({ className, size }: { className?: string, size?: number }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4a1 1 0 0 0-1.4 0l-2.1 2.1a1 1 0 0 0 0 1.4Z"/><path d="m15.5 7.5-3 3"/><path d="m11 11-1 1-2-2-5 5a2 2 0 0 0 0 2.8l1.4 1.4a2 2 0 0 0 2.8 0l5-5-2-2 1-1Z"/>
  </svg>
);

export default Integrations;

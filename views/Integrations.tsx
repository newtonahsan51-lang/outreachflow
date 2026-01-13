
import React, { useState, useMemo, useEffect } from 'react';
import { 
  Layers, Search, Check, Plus, ExternalLink, 
  Slack, Database, Zap, Globe, Github, 
  MessageSquare, Users, Link2, Info, X, 
  Loader2, Settings2, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import { apiService } from '../services/apiService';

const CATEGORIES = ['All', 'CRM', 'Communication', 'Automation', 'Data Enrichment'];

const INTEGRATION_META = [
  { id: 'salesforce', name: 'Salesforce', category: 'CRM', description: 'Sync leads and campaign activity directly to your Salesforce CRM.', icon: Database, color: 'blue', docsUrl: '#' },
  { id: 'hubspot', name: 'HubSpot', category: 'CRM', description: 'Automatic bidirectional sync for contacts and deal stages.', icon: Database, color: 'orange', docsUrl: '#' },
  { id: 'slack', name: 'Slack', category: 'Communication', description: 'Get real-time notifications for replies and meeting bookings.', icon: Slack, color: 'purple', docsUrl: '#' },
  { id: 'zapier', name: 'Zapier', category: 'Automation', description: 'Connect OutreachFlow to 5,000+ apps with custom zaps.', icon: Zap, color: 'orange', docsUrl: '#' },
  { id: 'apollo', name: 'Apollo.io', category: 'Data Enrichment', description: 'Directly import and enrich leads from the Apollo database.', icon: Users, color: 'blue', docsUrl: '#' },
  { id: 'hunter', name: 'Hunter.io', category: 'Data Enrichment', description: 'Verify email addresses before sending to protect deliverability.', icon: Globe, color: 'orange', docsUrl: '#' },
  { id: 'pipedrive', name: 'Pipedrive', category: 'CRM', description: 'Keep your sales pipeline updated with OutreachFlow engagement.', icon: Database, color: 'emerald', docsUrl: '#' },
  { id: 'make', name: 'Make.com', category: 'Automation', description: 'Powerful visual automation to build complex workflows.', icon: Zap, color: 'indigo', docsUrl: '#' }
];

const Integrations = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [connectedIds, setConnectedIds] = useState<string[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    // Safety timeout
    const timeout = setTimeout(() => {
      if (isMounted) setIsLoadingList(false);
    }, 5000);

    const fetchIntegrations = async () => {
      try {
        const data = await apiService.getIntegrations();
        if (isMounted) {
          clearTimeout(timeout);
          const ids = Array.isArray(data) ? data.map((item: any) => typeof item === 'string' ? item : item.id) : [];
          setConnectedIds(ids);
          setIsLoadingList(false);
        }
      } catch (err) {
        if (isMounted) {
          clearTimeout(timeout);
          setIsLoadingList(false);
        }
      }
    };
    fetchIntegrations();
    return () => { isMounted = false; clearTimeout(timeout); };
  }, []);

  const filtered = useMemo(() => {
    return INTEGRATION_META.filter(item => 
      (activeTab === 'All' || item.category === activeTab) &&
      (item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
       item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [activeTab, searchQuery]);

  const handleToggleConnect = async (id: string) => {
    const isConnected = connectedIds.includes(id);
    setLoadingId(id);
    try {
      if (isConnected) {
        await apiService.disconnectIntegration(id);
        setConnectedIds(prev => prev.filter(i => i !== id));
      } else {
        await apiService.connectIntegration(id);
        setConnectedIds(prev => [...prev, id]);
      }
    } catch (err) {
      alert("Failed to update integration.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Layers className="text-blue-600" /> App Marketplace</h1>
          <p className="text-slate-500">Connect your tools to supercharge your outreach.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${activeTab === cat ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'}`}>{cat}</button>
          ))}
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm outline-none" />
        </div>
      </div>

      {isLoadingList ? (
        <div className="py-20 flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="font-bold">Syncing marketplace...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filtered.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:shadow-xl transition-all group">
              <div className="flex items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-100 dark:border-slate-700`}>
                  <item.icon size={28} />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{item.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mt-1">{item.description}</p>
              </div>
              <div className="mt-8 pt-6 border-t dark:border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{item.category}</span>
                <button onClick={() => handleToggleConnect(item.id)} disabled={loadingId === item.id} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${connectedIds.includes(item.id) ? 'bg-slate-100 text-slate-600' : 'bg-blue-600 text-white'}`}>
                  {loadingId === item.id ? <Loader2 size={14} className="animate-spin" /> : connectedIds.includes(item.id) ? 'Connected' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Integrations;

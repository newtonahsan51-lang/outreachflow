
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Copy, Eye, FileText, Plus, Sparkles, 
  Filter, Bookmark, X, Save, Check, Type, 
  Tag, MessageSquare, Layout, Info
} from 'lucide-react';

const CATEGORIES = ['All', 'Cold Outreach', 'Follow-up', 'Break-up', 'Meeting Request', 'Recruitment'];

const INITIAL_PRESETS = [
  {
    id: '1',
    name: 'Quick Question (The Bread & Butter)',
    category: 'Cold Outreach',
    subject: 'Quick question for {{first_name}}',
    body: "Hi {{first_name}},\n\nI was browsing through {{company_name}}'s LinkedIn profile and noticed you're scaling your sales team.\n\nMost agencies we work with struggle with reply rates. We helped [Competitor] double theirs in 30 days.\n\nWorth a 5-min chat next week?\n\nBest,\n{{my_name}}",
    stats: { open: 72, reply: 18 }
  },
  {
    id: '2',
    name: 'The Gentle Nudge',
    category: 'Follow-up',
    subject: 'Re: Quick question',
    body: "Hi {{first_name}},\n\nJust wanted to make sure this didn't get buried in your inbox. \n\nI know you're busy growing {{company_name}}, but I really think our automation could save your team 10+ hours a week.\n\nOpen to a brief look?\n\nCheers,\n{{my_name}}",
    stats: { open: 54, reply: 22 }
  },
  {
    id: '3',
    name: 'The Permission Asset',
    category: 'Cold Outreach',
    subject: 'Can I send you a quick video?',
    body: "Hey {{first_name}},\n\nI made a short 60-second video for {{company_name}} showing 3 specific areas where your current email deliverability might be leaking revenue.\n\nMind if I send the link over?\n\nBest,\n{{my_name}}",
    stats: { open: 88, reply: 31 }
  },
  {
    id: '4',
    name: 'The Final Goodbye',
    category: 'Break-up',
    subject: 'Closing your file',
    body: "Hi {{first_name}},\n\nI haven't heard back from you, so I'm assuming that optimizing your outreach isn't a priority for {{company_name}} right now.\n\nI'll go ahead and close your file. If things change in the future, feel free to reach out.\n\nAll the best,\n{{my_name}}",
    stats: { open: 65, reply: 14 }
  }
];

const Templates = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [templates, setTemplates] = useState(INITIAL_PRESETS);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New Template Form State
  const [newTemplate, setNewTemplate] = useState({
    name: '',
    category: 'Cold Outreach',
    subject: '',
    body: ''
  });

  const filtered = templates.filter(p => 
    (activeTab === 'All' || p.category === activeTab) &&
    (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.body.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const template = {
      ...newTemplate,
      id: Math.random().toString(36).substr(2, 9),
      stats: { open: 0, reply: 0 }
    };
    setTemplates([template, ...templates]);
    setShowCreateModal(false);
    setNewTemplate({ name: '', category: 'Cold Outreach', subject: '', body: '' });
  };

  const handleUseTemplate = (template: any) => {
    navigate('/campaigns', { state: { template } });
  };

  const handleCopyTemplate = (template: any) => {
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
    alert('Template copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Template Library</h1>
          <p className="text-slate-500 dark:text-slate-400">High-converting presets to kickstart your campaigns.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={20} /> Create Template
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto custom-scrollbar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === cat 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-blue-500/50'
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
            placeholder="Search templates..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(template => (
          <div key={template.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 flex flex-col hover:border-blue-500 hover:shadow-xl transition-all group animate-in zoom-in-95">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-2xl border border-blue-100 dark:border-blue-800/50">
                <FileText size={24} />
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors shadow-sm">
                  <Bookmark size={18} />
                </button>
                <button onClick={() => handleCopyTemplate(template)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors shadow-sm">
                  <Copy size={18} />
                </button>
              </div>
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{template.name}</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">{template.category}</p>
            
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 flex-1 mb-4 overflow-hidden shadow-inner">
              <p className="text-[10px] font-black text-blue-600 mb-2 uppercase tracking-tighter">Subject: {template.subject}</p>
              <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-5 leading-relaxed font-medium">
                {template.body}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-4">
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900 dark:text-white">{template.stats.open}%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Open</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-black text-slate-900 dark:text-white">{template.stats.reply}%</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Reply</p>
                </div>
              </div>
              <button 
                onClick={() => handleUseTemplate(template)}
                className="px-4 py-2 bg-slate-900 dark:bg-white dark:text-slate-900 text-white rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md hover:bg-blue-600 dark:hover:bg-blue-600 dark:hover:text-white"
              >
                Use Template
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-600 rounded-[28px] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
                  <Plus size={32} strokeWidth={3} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Create New Template</h2>
                  <p className="text-sm text-slate-500 font-medium">Draft a high-converting email asset.</p>
                </div>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl text-slate-400 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateTemplate} className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Layout size={14} /> Template Name
                  </label>
                  <input 
                    required 
                    type="text" 
                    value={newTemplate.name}
                    onChange={e => setNewTemplate({...newTemplate, name: e.target.value})}
                    placeholder="e.g. Discovery Call v1" 
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Tag size={14} /> Category
                  </label>
                  <select 
                    value={newTemplate.category}
                    onChange={e => setNewTemplate({...newTemplate, category: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-bold text-sm"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} /> Email Subject
                </label>
                <div className="relative">
                  <input 
                    required 
                    type="text" 
                    value={newTemplate.subject}
                    onChange={e => setNewTemplate({...newTemplate, subject: e.target.value})}
                    placeholder="Subject line for your email..." 
                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 transition-all font-semibold" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                    <button type="button" className="text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2 py-1 rounded-lg text-slate-400 hover:text-blue-500">{"{{first_name}}"}</button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center mb-1">
                   <label className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Type size={14} /> Email Body
                  </label>
                  <button type="button" className="text-[10px] font-bold text-blue-600 flex items-center gap-1 hover:underline">
                    <Sparkles size={12} /> AI Rewrite
                  </button>
                </div>
                <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-inner">
                  <textarea 
                    required 
                    value={newTemplate.body}
                    onChange={e => setNewTemplate({...newTemplate, body: e.target.value})}
                    placeholder="Write your email copy here..." 
                    className="w-full h-48 bg-transparent border-none outline-none resize-none text-sm leading-relaxed custom-scrollbar font-sans font-medium" 
                  />
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setNewTemplate({...newTemplate, body: newTemplate.body + ' {{first_name}}'})} className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold text-slate-600 hover:border-blue-500">{"{{first_name}}"}</button>
                      <button type="button" onClick={() => setNewTemplate({...newTemplate, body: newTemplate.body + ' {{company_name}}'})} className="px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] font-bold text-slate-600 hover:border-blue-500">{"{{company_name}}"}</button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                      <Check size={12} /> Deliverability Optimized
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-4 text-sm font-bold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all active:scale-95"
                >
                  Discard Draft
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={20} /> Save to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Templates;

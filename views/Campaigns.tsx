
import React, { useState } from 'react';
import { 
  Plus, Play, Pause, Trash2, Eye, MoreHorizontal, 
  Mail, Clock, MousePointer, MessageSquare, PlusCircle,
  ArrowRight, Sparkles, AlertCircle, ChevronDown, 
  GitBranch, Zap, Layers, X, Target, Info, Linkedin, ShieldCheck,
  RotateCw, Check, CheckCircle2, FileText, Settings, Copy, Share2
} from 'lucide-react';

const mockCampaigns = [
  { id: '1', name: 'SaaS Agency Outreach', status: 'Active', sent: 1240, open: 68, reply: 24, steps: 4 },
  { id: '2', name: 'Real Estate Cold Outreach', status: 'Draft', sent: 0, open: 0, reply: 0, steps: 3 },
  { id: '3', name: 'Q4 Recruitment Drive', status: 'Paused', sent: 450, open: 52, reply: 12, steps: 5 },
];

const PRESET_FLOWS = [
  {
    id: '3-step-growth',
    name: '3-Step Growth Engine',
    description: 'Cold, Warmup, and Closing sequence from your custom domain.',
    icon: ShieldCheck,
    color: 'emerald'
  },
  {
    id: 'agency-master',
    name: 'SaaS Agency Master Flow',
    description: '7-step multi-channel attack for high-ticket clients.',
    icon: Zap,
    color: 'blue'
  },
  {
    id: 'scratch',
    name: 'Start from Scratch',
    description: 'Build your own custom outreach sequence.',
    icon: Plus,
    color: 'slate'
  }
];

const Campaigns = () => {
  const [view, setView] = useState<'list' | 'presets' | 'builder'>('list');

  if (view === 'presets') {
    return <PresetFlowSelection onSelect={() => setView('builder')} onCancel={() => setView('list')} />;
  }

  if (view === 'builder') {
    return <CampaignBuilder onCancel={() => setView('list')} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campaigns</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your outreach sequences and performance.</p>
        </div>
        <button 
          onClick={() => setView('presets')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
        >
          <Plus size={20} /> New Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {mockCampaigns.map((c) => (
          <div key={c.id} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-blue-300 dark:hover:border-blue-900 transition-all group">
            <div className="flex items-center gap-4 flex-1">
              <div className={`p-3 rounded-xl ${c.status === 'Active' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{c.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${c.status === 'Active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                    {c.status}
                  </span>
                  <span className="text-xs text-slate-500">• {c.steps} steps</span>
                  <span className="text-xs text-slate-500">• Last updated 2d ago</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8 px-8 border-l border-slate-100 dark:border-slate-800">
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{c.sent}</p>
                <p className="text-xs text-slate-500">Sent</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{c.open}%</p>
                <p className="text-xs text-slate-500">Open</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-900 dark:text-white">{c.reply}%</p>
                <p className="text-xs text-slate-500">Reply</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400" title="Preview"><Eye size={18} /></button>
              {c.status === 'Active' ? (
                <button className="p-2 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg text-amber-600" title="Pause"><Pause size={18} /></button>
              ) : (
                <button className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-green-600" title="Start"><Play size={18} /></button>
              )}
              <button className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg text-red-600" title="Delete"><Trash2 size={18} /></button>
              <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400"><MoreHorizontal size={18} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PresetFlowSelection = ({ onSelect, onCancel }: { onSelect: () => void, onCancel: () => void }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-8 animate-in fade-in duration-300">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Choose a Campaign Preset</h2>
        <p className="text-slate-500 mt-2">Kickstart your outreach with a proven flow or build something unique.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRESET_FLOWS.map((flow) => (
          <button 
            key={flow.id}
            onClick={onSelect}
            className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 shadow-sm hover:shadow-xl transition-all group flex flex-col items-center text-center text-slate-900 dark:text-white"
          >
            <div className={`w-16 h-16 rounded-2xl bg-${flow.color}-100 dark:bg-${flow.color}-900/30 text-${flow.color}-600 mb-6 flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <flow.icon size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">{flow.name}</h3>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">{flow.description}</p>
            <div className="mt-auto w-full py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs uppercase tracking-wider group-hover:bg-blue-600 group-hover:text-white transition-colors">
              Select Preset
            </div>
          </button>
        ))}
      </div>

      <div className="text-center pt-8">
        <button onClick={onCancel} className="text-slate-500 font-bold hover:text-slate-800 dark:hover:text-white transition-colors">Go Back</button>
      </div>
    </div>
  );
};

const CampaignBuilder = ({ onCancel }: { onCancel: () => void }) => {
  const [steps, setSteps] = useState([
    { id: '1', type: 'Email', subject: 'Initial Discovery', content: 'Hi {{first_name}},\n\nSaw your team at {{company_name}} is growing...', condition: null },
    { id: '2', type: 'Wait', delayDays: 2, condition: 'If not replied' },
    { id: '3', type: 'Email', subject: 'Quick follow up', content: 'Just circling back on my last email...', condition: 'If opened' },
    { id: '4', type: 'LinkedIn', content: 'Hey {{first_name}}, sent you an email a few days ago. Love what you are doing with...', condition: 'If opened' }
  ]);
  
  const [selectedInboxes, setSelectedInboxes] = useState<string[]>(['alex@growthflow.io']);
  const [showInboxSelector, setShowInboxSelector] = useState(false);
  const [isSmartRotation, setIsSmartRotation] = useState(true);
  const [activeStepMenu, setActiveStepMenu] = useState<string | null>(null);
  const [activeHeaderMenu, setActiveHeaderMenu] = useState(false);

  const availableInboxes = [
    { email: 'alex@growthflow.io', provider: 'Gmail', health: 98 },
    { email: 'outreach@growthflow.io', provider: 'Outlook', health: 92 },
    { email: 'sales@growthflow.io', provider: 'Gmail', health: 85 },
    { email: 'growth@growthflow.io', provider: 'SMTP', health: 99 }
  ];

  const toggleInbox = (email: string) => {
    setSelectedInboxes(prev => 
      prev.includes(email) 
        ? (prev.length > 1 ? prev.filter(e => e !== email) : prev) 
        : [...prev, email]
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex items-center justify-between sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md z-[60] py-4 -mx-6 px-6 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 transition-colors">
            <X size={20} />
          </button>
          <div className="h-6 w-px bg-slate-200 dark:border-slate-800"></div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Sequence Builder</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900/30 px-1.5 py-0.5 rounded font-bold uppercase tracking-widest">Distributed Flow</span>
              <span className="text-[10px] text-slate-400">• v1.4</span>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button 
              onClick={() => setShowInboxSelector(!showInboxSelector)}
              className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm hover:border-blue-500 transition-all"
            >
              <div className="flex -space-x-2">
                {selectedInboxes.slice(0, 3).map((email, i) => (
                  <div key={i} className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-white uppercase">
                    {email[0]}
                  </div>
                ))}
                {selectedInboxes.length > 3 && (
                  <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-slate-600">
                    +{selectedInboxes.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs font-bold">{selectedInboxes.length} Account{selectedInboxes.length > 1 ? 's' : ''}</span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform ${showInboxSelector ? 'rotate-180' : ''}`} />
            </button>

            {showInboxSelector && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-50 p-4 animate-in fade-in zoom-in-95">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Select Sending Accounts</p>
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {availableInboxes.map(inbox => (
                    <label key={inbox.email} className="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors group">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox" 
                          checked={selectedInboxes.includes(inbox.email)}
                          onChange={() => toggleInbox(inbox.email)}
                          className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" 
                        />
                        <div>
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{inbox.email}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">{inbox.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${inbox.health > 90 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span className="text-[10px] font-bold text-slate-500">{inbox.health}%</span>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2">
                      <RotateCw size={14} className={`text-blue-600 ${isSmartRotation ? 'animate-spin-slow' : ''}`} />
                      <span className="text-[10px] font-bold text-slate-600">Smart Rotation</span>
                    </div>
                    <button 
                      onClick={() => setIsSmartRotation(!isSmartRotation)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isSmartRotation ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${isSmartRotation ? 'translate-x-5' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300">
            <Eye size={16} /> Preview
          </button>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">Launch Campaign</button>
          
          <div className="relative">
            <button 
              onClick={() => setActiveHeaderMenu(!activeHeaderMenu)}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500 transition-colors"
            >
              <MoreHorizontal size={20} />
            </button>
            {activeHeaderMenu && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl z-[70] py-2 animate-in fade-in zoom-in-95 overflow-hidden">
                <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors">
                  <FileText size={16} className="text-slate-400" /> Save as Draft
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors">
                  <Copy size={16} className="text-slate-400" /> Duplicate Sequence
                </button>
                <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors">
                  <Share2 size={16} className="text-slate-400" /> Share Template
                </button>
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1"></div>
                <button className="w-full px-4 py-2.5 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-3 transition-colors">
                  <Settings size={16} className="text-slate-400" /> Sequence Settings
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4 relative">
        <div className="p-6 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 rounded-[32px] flex items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100 dark:border-blue-800">
              <Zap size={28} />
            </div>
            <div>
              <p className="text-sm font-bold text-blue-900 dark:text-blue-300">Distributed Multi-Inbox Sending</p>
              <p className="text-xs text-blue-700/70 dark:text-blue-500/70 leading-relaxed max-w-md">
                Emails will be load-balanced across <b>{selectedInboxes.length} connected accounts</b>. 
                {isSmartRotation ? ' Smart rotation is active to maintain health and prevent blacklisting.' : ' Manual distribution enabled.'}
              </p>
            </div>
          </div>
          <div className="hidden lg:flex flex-col items-end">
            <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Max Daily Volume</p>
            <p className="text-xl font-black text-blue-900 dark:text-blue-200">{selectedInboxes.length * 50} <span className="text-xs font-bold text-blue-500">EMAILS</span></p>
          </div>
        </div>

        {steps.map((step, idx) => (
          <div key={step.id} className="relative flex flex-col items-center">
            {/* Connection Line */}
            {idx > 0 && (
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 relative">
                {/* Condition Tag */}
                {step.condition && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <GitBranch size={10} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{step.condition}</span>
                  </div>
                )}
              </div>
            )}

            <div className="w-full relative group">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all cursor-default">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-100 dark:border-slate-700 shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {step.type === 'Email' ? <Mail size={18} className="text-blue-500" /> : step.type === 'Wait' ? <Clock size={18} className="text-amber-500" /> : <Linkedin size={18} className="text-blue-600" />}
                        {step.type} Step
                        {step.type === 'Email' && step.subject && <span className="text-slate-400 font-normal hidden sm:inline text-sm">: {step.subject}</span>}
                      </h4>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-slate-400" title="AI Rewrite"><Sparkles size={16} /></button>
                    
                    <div className="relative">
                      <button 
                        onClick={() => setActiveStepMenu(activeStepMenu === step.id ? null : step.id)}
                        className={`p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors ${activeStepMenu === step.id ? 'text-blue-600 bg-slate-50 dark:bg-slate-800' : 'text-slate-400'}`} 
                        title="Settings"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {activeStepMenu === step.id && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 overflow-hidden">
                          <button className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                            <GitBranch size={14} className="text-slate-400" /> Add Condition
                          </button>
                          <button className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 transition-colors">
                            <Layers size={14} className="text-slate-400" /> Duplicate Step
                          </button>
                          <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                          <button className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2 transition-colors">
                            <Trash2 size={14} /> Delete Step
                          </button>
                        </div>
                      )}
                    </div>

                    <button className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-500" title="Delete"><Trash2 size={16} /></button>
                  </div>
                </div>

                {step.type === 'Wait' ? (
                  <div className="flex items-center gap-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 border-dashed">
                    <div className="flex-1 flex items-center gap-3">
                       <Clock size={20} className="text-slate-400" />
                       <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Wait for</span>
                       <input 
                         type="number" 
                         value={step.delayDays} 
                         className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 text-center"
                       />
                       <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">days</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <GitBranch size={14} className="text-slate-400" />
                       <select className="bg-transparent border-none text-xs font-bold text-blue-600 outline-none cursor-pointer">
                         <option>If no reply</option>
                         <option>Always</option>
                         <option>If bounced</option>
                       </select>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {step.type === 'Email' && (
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-400 uppercase w-16">Subject</span>
                        <input type="text" value={step.subject} className="bg-transparent border-none outline-none text-sm w-full font-medium text-slate-700 dark:text-slate-300" placeholder="Email subject..." />
                      </div>
                    )}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[120px]">
                      <textarea 
                        className="bg-transparent border-none outline-none text-sm w-full h-full resize-none text-slate-700 dark:text-slate-300 leading-relaxed custom-scrollbar font-sans"
                        defaultValue={step.content}
                        placeholder={`Write your ${step.type} content...`}
                      />
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                        <div className="flex gap-1">
                          <button className="text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:border-blue-500 transition-all">{"{{first_name}}"}</button>
                          <button className="text-[10px] font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-600 dark:text-slate-400 hover:border-blue-500 transition-all">{"{{company_name}}"}</button>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-full border border-emerald-100 dark:border-emerald-800">
                            <CheckCircle2 size={12} /> SPAM CHECK PASSED
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Add Step Tooltip/Menu */}
        <div className="flex flex-col items-center mt-12">
          <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 border-dashed mb-2"></div>
          <button className="flex items-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 font-bold hover:bg-white dark:hover:bg-slate-800 hover:border-blue-500 hover:text-blue-500 transition-all group shadow-sm">
            <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
            Add New Step to Flow
          </button>
          
          <div className="mt-8 grid grid-cols-4 gap-4 max-w-lg">
            {[
              { label: 'Email', icon: Mail, color: 'blue' },
              { label: 'Wait', icon: Clock, color: 'amber' },
              { label: 'LinkedIn', icon: Linkedin, color: 'blue' },
              { label: 'Branch', icon: GitBranch, color: 'indigo' },
            ].map(tool => (
              <div key={tool.label} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-12 h-12 rounded-2xl bg-${tool.color}-50 dark:bg-${tool.color}-900/20 text-${tool.color}-600 flex items-center justify-center group-hover:scale-110 transition-transform border border-transparent group-hover:border-${tool.color}-200`}>
                  <tool.icon size={20} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-slate-600 transition-colors">{tool.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Campaigns;


import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Plus, Play, Pause, Trash2, Eye, MoreHorizontal, 
  Mail, Clock, MousePointer, MessageSquare, PlusCircle,
  ArrowRight, Sparkles, AlertCircle, ChevronDown, 
  GitBranch, Zap, Layers, X, Target, Info, Linkedin, ShieldCheck,
  RotateCw, Check, CheckCircle2, FileText, Settings, Copy, Share2, Loader2
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
  const location = useLocation();
  const [view, setView] = useState<'list' | 'presets' | 'builder'>('list');
  const [initialTemplate, setInitialTemplate] = useState<any>(null);

  useEffect(() => {
    if (location.state?.template) {
      setInitialTemplate(location.state.template);
      setView('builder');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  if (view === 'presets') {
    return <PresetFlowSelection onSelect={() => setView('builder')} onCancel={() => setView('list')} />;
  }

  if (view === 'builder') {
    return <CampaignBuilder initialTemplate={initialTemplate} onCancel={() => { setView('list'); setInitialTemplate(null); }} />;
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

const CampaignBuilder = ({ onCancel, initialTemplate }: { onCancel: () => void, initialTemplate?: any }) => {
  const [steps, setSteps] = useState<any[]>([
    { 
      id: Math.random().toString(36).substr(2, 9), 
      type: 'Email', 
      subject: initialTemplate?.subject || 'Initial Discovery', 
      content: initialTemplate?.body || 'Hi {{first_name}},\n\nSaw your team at {{company_name}} is growing...', 
      condition: null 
    },
    { id: Math.random().toString(36).substr(2, 9), type: 'Wait', delayDays: 2, condition: 'If not replied' },
    { id: Math.random().toString(36).substr(2, 9), type: 'Email', subject: 'Quick follow up', content: 'Just circling back on my last email...', condition: 'If opened' },
    { id: Math.random().toString(36).substr(2, 9), type: 'LinkedIn', content: 'Hey {{first_name}}, sent you an email a few days ago. Love what you are doing with...', condition: 'If opened' }
  ]);
  
  const [selectedInboxes, setSelectedInboxes] = useState<string[]>(['alex@growthflow.io']);
  const [showInboxSelector, setShowInboxSelector] = useState(false);
  const [isSmartRotation, setIsSmartRotation] = useState(true);
  const [activeStepMenu, setActiveStepMenu] = useState<string | null>(null);
  const [activeHeaderMenu, setActiveHeaderMenu] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  const availableInboxes = [
    { email: 'alex@growthflow.io', provider: 'Gmail', health: 98 },
    { email: 'outreach@growthflow.io', provider: 'Outlook', health: 92 },
    { email: 'sales@growthflow.io', provider: 'Gmail', health: 85 },
    { email: 'growth@growthflow.io', provider: 'SMTP', health: 99 }
  ];

  const handleDuplicateStep = (id: string) => {
    const stepToCopy = steps.find(s => s.id === id);
    if (!stepToCopy) return;
    
    const index = steps.findIndex(s => s.id === id);
    const newStep = { ...stepToCopy, id: Math.random().toString(36).substr(2, 9) };
    
    const newSteps = [...steps];
    newSteps.splice(index + 1, 0, newStep);
    setSteps(newSteps);
    setActiveStepMenu(null);
  };

  const handleDeleteStep = (id: string) => {
    if (steps.length <= 1) {
      alert("A sequence must have at least one step.");
      return;
    }
    setSteps(steps.filter(s => s.id !== id));
    setActiveStepMenu(null);
  };

  const handleAddCondition = (id: string) => {
    const conditions = ['If opened', 'If not replied', 'If clicked', 'Always'];
    const currentStep = steps.find(s => s.id === id);
    const currentIndex = conditions.indexOf(currentStep.condition || 'Always');
    const nextCondition = conditions[(currentIndex + 1) % conditions.length];
    
    setSteps(steps.map(s => s.id === id ? { ...s, condition: nextCondition } : s));
    setActiveStepMenu(null);
  };

  const handleLaunchCampaign = () => {
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      alert("Campaign launched successfully! It is now live across your selected inboxes.");
      onCancel();
    }, 2000);
  };

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
              </div>
            )}
          </div>
          
          <button 
            onClick={() => setIsPreviewMode(true)}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            <Eye size={16} /> Preview
          </button>
          <button 
            onClick={handleLaunchCampaign}
            disabled={isLaunching}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-2"
          >
            {isLaunching ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
            {isLaunching ? 'Launching...' : 'Launch Campaign'}
          </button>
        </div>
      </div>

      <div className="space-y-4 relative">
        {steps.map((step, idx) => (
          <div key={step.id} className="relative flex flex-col items-center">
            {idx > 0 && (
              <div className="w-px h-12 bg-slate-200 dark:bg-slate-800 relative">
                {step.condition && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-blue-50 dark:bg-blue-900/40 border border-blue-100 dark:border-blue-800 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <GitBranch size={10} className="text-blue-500" />
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">{step.condition}</span>
                  </div>
                )}
              </div>
            )}

            <div className="w-full relative group">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-100 dark:border-slate-700 shadow-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {step.type === 'Email' ? <Mail size={18} className="text-blue-500" /> : step.type === 'Wait' ? <Clock size={18} className="text-amber-500" /> : <Linkedin size={18} className="text-blue-600" />}
                        {step.type} Step
                      </h4>
                    </div>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="relative">
                      <button 
                        onClick={() => setActiveStepMenu(activeStepMenu === step.id ? null : step.id)}
                        className={`p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors ${activeStepMenu === step.id ? 'text-blue-600 bg-slate-50 dark:bg-slate-800' : 'text-slate-400'}`} 
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {activeStepMenu === step.id && (
                        <div className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 py-2 animate-in fade-in zoom-in-95 overflow-hidden">
                          <button 
                            onClick={() => handleAddCondition(step.id)}
                            className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                          >
                            <GitBranch size={14} className="text-slate-400" /> Cycle Condition
                          </button>
                          <button 
                            onClick={() => handleDuplicateStep(step.id)}
                            className="w-full px-4 py-2 text-left text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                          >
                            <Layers size={14} className="text-slate-400" /> Duplicate Step
                          </button>
                          <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                          <button 
                            onClick={() => handleDeleteStep(step.id)}
                            className="w-full px-4 py-2 text-left text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                            <Trash2 size={14} /> Delete Step
                          </button>
                        </div>
                      )}
                    </div>
                    <button onClick={() => handleDeleteStep(step.id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-500"><Trash2 size={16} /></button>
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
                         onChange={(e) => setSteps(steps.map(s => s.id === step.id ? {...s, delayDays: parseInt(e.target.value)} : s))}
                         className="w-16 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-bold text-center"
                       />
                       <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">days</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {step.type === 'Email' && (
                      <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-400 uppercase w-16">Subject</span>
                        <input 
                          type="text" 
                          value={step.subject} 
                          onChange={(e) => setSteps(steps.map(s => s.id === step.id ? {...s, subject: e.target.value} : s))}
                          className="bg-transparent border-none outline-none text-sm w-full font-medium" 
                        />
                      </div>
                    )}
                    <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 min-h-[120px]">
                      <textarea 
                        className="bg-transparent border-none outline-none text-sm w-full h-full resize-none text-slate-700 dark:text-slate-300 leading-relaxed custom-scrollbar font-sans"
                        value={step.content}
                        onChange={(e) => setSteps(steps.map(s => s.id === step.id ? {...s, content: e.target.value} : s))}
                        placeholder={`Write your ${step.type} content...`}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Modal */}
      {isPreviewMode && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-2xl max-h-[90vh] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
                  <Eye size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Campaign Preview</h2>
                  <p className="text-sm text-slate-500">{steps.length} touchpoints configured.</p>
                </div>
              </div>
              <button onClick={() => setIsPreviewMode(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            
            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6 flex-1 bg-slate-50/30 dark:bg-slate-900/30">
              {steps.map((step, idx) => (
                <div key={step.id} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
                   <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full text-slate-500 uppercase">Step {idx + 1}</span>
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{step.type}</span>
                   </div>
                   {step.type === 'Wait' ? (
                     <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">⏳ Wait for <b>{step.delayDays} days</b> before next action.</p>
                   ) : (
                     <div className="space-y-2">
                        {step.subject && <p className="text-xs font-bold text-slate-900 dark:text-white">Subject: {step.subject}</p>}
                        <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-wrap leading-relaxed border-t border-slate-100 dark:border-slate-700 pt-3">{step.content}</p>
                     </div>
                   )}
                </div>
              ))}
            </div>

            <div className="p-8 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
               <button onClick={() => setIsPreviewMode(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl">Edit Sequence</button>
               <button onClick={handleLaunchCampaign} className="px-8 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 active:scale-95">Launch Now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Campaigns;

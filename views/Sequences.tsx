
import React, { useState, useEffect } from 'react';
import { 
  Workflow, Plus, ArrowRight, Mail, Linkedin, MessageSquare, 
  Clock, MoreVertical, Play, Zap, BarChart3, Target, 
  MousePointer2, X, Sparkles, Trash2, GitBranch, Save, ChevronRight,
  ShieldCheck, RefreshCw, ChevronDown, Loader2
} from 'lucide-react';
import { apiService } from '../services/apiService';

const PRESET_SEQUENCES = [
  {
    id: '3-step-growth',
    name: 'Standard 3-Step Growth Sequence',
    description: 'The ultimate automated engine: Cold Outreach -> Warmup Nudge -> Closing Follow-up.',
    goal: 'Revenue Growth',
    steps: ['Cold Email', 'Wait 2d', 'Warmup Nudge', 'Wait 3d', 'Final Follow-up'],
    metrics: { openRate: 82, replyRate: 34, conversionRate: 12.5 },
    channels: ['Email', 'Custom Domain'],
    performance: 'Very High'
  },
  {
    id: '1',
    name: 'SaaS Agency Master Flow',
    description: 'High-ticket agency outreach using multi-channel touchpoints.',
    goal: 'Lead Generation',
    steps: ['Email', 'Wait 2d', 'LinkedIn Connection', 'Wait 3d', 'Email', 'Wait 5d', 'SMS'],
    metrics: { openRate: 74, replyRate: 28, conversionRate: 8.4 },
    channels: ['Email', 'LinkedIn', 'SMS'],
    performance: 'High'
  },
  {
    id: '2',
    name: 'The Gentle Nudge',
    description: 'Low-pressure email-only follow-up sequence for warm prospects.',
    goal: 'Lead Nurturing',
    steps: ['Email', 'Wait 1d', 'Email', 'Wait 3d', 'Email'],
    metrics: { openRate: 58, replyRate: 14, conversionRate: 3.2 },
    channels: ['Email'],
    performance: 'Moderate'
  }
];

const STEP_TYPES = [
  { type: 'Email', icon: Mail, color: 'blue', desc: 'Send a cold or follow-up email.' },
  { type: 'Wait', icon: Clock, color: 'amber', desc: 'Pause the sequence for a set time.' },
  { type: 'LinkedIn', icon: Linkedin, color: 'blue', desc: 'Connect or message on LinkedIn.' },
  { type: 'SMS', icon: MessageSquare, color: 'emerald', desc: 'Send a text message nudge.' }
];

const Sequences = () => {
  const [view, setView] = useState<'list' | 'builder'>('list');
  const [customSteps, setCustomSteps] = useState<any[]>([]);
  const [availableInboxes, setAvailableInboxes] = useState<any[]>([]);
  const [selectedInboxes, setSelectedInboxes] = useState<string[]>([]);
  const [showInboxSelector, setShowInboxSelector] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);

  useEffect(() => {
    const fetchInboxes = async () => {
      try {
        const data = await apiService.getInboxes();
        setAvailableInboxes(data || []);
        if (data && data.length > 0 && selectedInboxes.length === 0) {
          setSelectedInboxes([data[0].email]);
        }
      } catch (err) {
        console.error("Failed to fetch inboxes", err);
      }
    };
    fetchInboxes();
  }, []);

  const addStep = (type: string) => {
    const newStep = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      config: type === 'Wait' ? { days: 2 } : { subject: '', content: '' },
      condition: null
    };
    setCustomSteps([...customSteps, newStep]);
  };

  const removeStep = (id: string) => {
    setCustomSteps(customSteps.filter(s => s.id !== id));
  };

  const toggleInbox = (email: string) => {
    setSelectedInboxes(prev => 
      prev.includes(email) 
        ? (prev.length > 1 ? prev.filter(e => e !== email) : prev) 
        : [...prev, email]
    );
  };

  const loadPreset = (id: string) => {
    if (id === '3-step-growth') {
      setCustomSteps([
        { id: '1', type: 'Email', config: { subject: 'Quick question for {{first_name}}', content: 'Hi {{first_name}},\n\nSaw what you are doing at {{company}}...' }, condition: null },
        { id: '2', type: 'Wait', config: { days: 2 }, condition: 'No reply' },
        { id: '3', type: 'Email', config: { subject: 'Re: Quick question', content: 'Just bumping this up. Thought my last email might have got buried...' }, condition: 'If opened' },
        { id: '4', type: 'Wait', config: { days: 3 }, condition: 'No reply' },
        { id: '5', type: 'Email', config: { subject: 'Closing your file', content: 'Since I haven\'t heard back, I assume this isn\'t a priority...' }, condition: 'Final nudge' }
      ]);
      setView('builder');
    }
  };

  const handleLaunchSequence = () => {
    if (selectedInboxes.length === 0) {
      alert("Please assign at least one inbox to this sequence.");
      return;
    }
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      alert(`Sequence live with ${selectedInboxes.length} accounts!`);
      setView('list');
    }, 1500);
  };

  if (view === 'builder') {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-8 sticky top-0 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md z-50 py-2 -mx-4 px-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('list')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500"
            >
              <X size={20} />
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800"></div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Custom Automation Builder</h1>
              <p className="text-xs text-slate-500">Design your own multi-channel outreach sequence.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Inbox Assignment Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowInboxSelector(!showInboxSelector)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-blue-500 transition-all group"
              >
                <div className="flex -space-x-2">
                  {selectedInboxes.length > 0 ? (
                    selectedInboxes.slice(0, 3).map((email, i) => (
                      <div key={i} className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white dark:border-slate-900 flex items-center justify-center text-[8px] font-bold text-white uppercase">
                        {email[0]}
                      </div>
                    ))
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                      <Mail size={12} />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase leading-none">Assignment</p>
                  <p className="text-xs font-bold mt-1 text-slate-900 dark:text-white">
                    {selectedInboxes.length > 0 ? `${selectedInboxes.length} Inboxes` : 'Select Inboxes'}
                  </p>
                </div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showInboxSelector ? 'rotate-180' : ''}`} />
              </button>

              {showInboxSelector && (
                <div className="absolute top-full right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl z-[100] p-4 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sending Accounts</p>
                    <span className="text-[10px] bg-blue-50 dark:bg-blue-900/30 text-blue-600 px-1.5 py-0.5 rounded-full font-bold">Rotation Active</span>
                  </div>
                  <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {availableInboxes.length === 0 ? (
                      <div className="p-4 text-center">
                        <p className="text-xs text-slate-400 font-bold">No accounts found.</p>
                        <button onClick={() => window.location.hash = '#/inboxes'} className="text-[10px] text-blue-600 underline mt-2">Connect Inboxes</button>
                      </div>
                    ) : (
                      availableInboxes.map(inbox => (
                        <label key={inbox.id} className="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl cursor-pointer transition-colors group">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox" 
                              checked={selectedInboxes.includes(inbox.email)}
                              onChange={() => toggleInbox(inbox.email)}
                              className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500" 
                            />
                            <div>
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[140px]">{inbox.email}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${inbox.health > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <span className="text-[9px] font-bold text-slate-400 uppercase">{inbox.provider} • {inbox.health}%</span>
                              </div>
                            </div>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-[9px] text-slate-500 leading-tight">The sequence will automatically rotate between these accounts to ensure maximum deliverability.</p>
                  </div>
                </div>
              )}
            </div>

            <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-bold text-slate-600 dark:text-slate-400 hover:border-blue-500 transition-all">
              <Sparkles size={16} className="text-blue-600" /> Optimize with AI
            </button>
            <button 
              onClick={handleLaunchSequence}
              disabled={isLaunching}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLaunching ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} fill="currentColor" />}
              {isLaunching ? 'Launching...' : 'Launch Automator'}
            </button>
          </div>
        </div>

        <div className="flex flex-1 gap-8 overflow-hidden">
          {/* Tool Palette */}
          <div className="w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-6 flex flex-col shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Drag to Canvas</h3>
            <div className="space-y-3">
              {STEP_TYPES.map((item) => (
                <button 
                  key={item.type}
                  onClick={() => addStep(item.type)}
                  className="w-full p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-4 group shadow-sm"
                >
                  <div className={`p-2 rounded-xl bg-${item.color}-100 dark:bg-${item.color}-900/30 text-${item.color}-600 group-hover:scale-110 transition-transform`}>
                    <item.icon size={20} />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.type}</p>
                    <p className="text-[10px] text-slate-500">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="mt-auto p-5 bg-blue-50 dark:bg-blue-900/10 rounded-3xl border border-blue-100 dark:border-blue-800/50">
              <p className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Target size={14} /> Builder Tip
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-500 mt-2 leading-relaxed font-medium">
                Add a 'Wait' step between every outreach to maintain high deliverability and account health.
              </p>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-slate-100/30 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[48px] p-12 overflow-y-auto custom-scrollbar flex flex-col items-center">
            {customSteps.length === 0 ? (
              <div className="my-auto text-center animate-in zoom-in-95">
                <div className="w-24 h-24 bg-white dark:bg-slate-900 rounded-[32px] shadow-2xl flex items-center justify-center mx-auto mb-8 border border-slate-100 dark:border-slate-800">
                  <Plus size={40} className="text-slate-300" strokeWidth={3} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Canvas is empty</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-2 font-medium">Choose a step from the palette to build your automated funnel.</p>
              </div>
            ) : (
              <div className="w-full max-w-2xl space-y-6">
                {customSteps.map((step, idx) => (
                  <div key={step.id} className="relative flex flex-col items-center animate-in slide-in-from-top-4">
                    {idx > 0 && (
                      <div className="h-12 w-px bg-slate-300 dark:bg-slate-700 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1.5 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 text-slate-400 shadow-sm">
                          <ArrowRight size={10} className="rotate-90" />
                        </div>
                      </div>
                    )}
                    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[40px] shadow-sm hover:shadow-xl hover:border-blue-500 transition-all group relative">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center text-slate-400 font-black border border-slate-100 dark:border-slate-700 shadow-inner">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {STEP_TYPES.find(t => t.type === step.type)?.icon && 
                                React.createElement(STEP_TYPES.find(t => t.type === step.type)!.icon, { size: 22 })}
                              {step.type} Step
                            </h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black mt-0.5">Configuration</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => removeStep(step.id)}
                            className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>

                      {step.type === 'Wait' ? (
                        <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-950 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 border-dashed">
                          <Clock size={24} className="text-amber-500" />
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">Wait for</span>
                            <input type="number" defaultValue={step.config.days} className="w-20 py-2 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-center font-black text-blue-600 outline-none focus:border-blue-500 transition-all" />
                            <span className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-tighter">days</span>
                          </div>
                          <div className="flex-1"></div>
                          <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full border border-blue-100 dark:border-blue-800/50">
                            <GitBranch size={12} /> {step.condition || 'IF NO REPLY'}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                           {step.config.subject !== undefined && (
                            <div className="bg-slate-50 dark:bg-slate-950 px-6 py-4 rounded-[32px] border border-slate-100 dark:border-slate-800 mb-2 flex items-center shadow-inner">
                              <span className="text-[10px] font-black text-slate-400 uppercase mr-4 tracking-widest shrink-0">Subject:</span>
                              <input defaultValue={step.config.subject} className="bg-transparent border-none outline-none text-sm w-full font-bold text-slate-700 dark:text-slate-300" placeholder="e.g. Quick question for {{first_name}}" />
                            </div>
                           )}
                          <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-inner">
                            <textarea 
                              defaultValue={step.config.content}
                              placeholder={`Compose your ${step.type} message...`}
                              className="w-full bg-transparent border-none outline-none text-sm min-h-[120px] resize-none leading-relaxed font-medium text-slate-600 dark:text-slate-300 custom-scrollbar"
                            />
                            <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                              <div className="flex gap-2">
                                <button className="text-[10px] font-black px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-tighter">{"{{first_name}}"}</button>
                                <button className="text-[10px] font-black px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 hover:text-blue-600 transition-colors uppercase tracking-tighter">{"{{company}}"}</button>
                              </div>
                              <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 rounded-2xl transition-all uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                                <Sparkles size={14} /> AI REWRITE
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="flex flex-col items-center pt-12 animate-in fade-in">
                  <div className="h-12 w-px bg-slate-200 dark:bg-slate-800 border-dashed mb-6"></div>
                  <div className="flex gap-4 p-2 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl">
                    {STEP_TYPES.map(s => (
                      <button 
                        key={s.type}
                        onClick={() => addStep(s.type)}
                        className="p-5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[28px] text-slate-400 hover:text-blue-600 hover:border-blue-500 hover:shadow-lg transition-all group"
                        title={`Add ${s.type}`}
                      >
                        <s.icon size={28} className="group-hover:scale-110 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sequence Library</h1>
          <p className="text-slate-500 dark:text-slate-400">Proven automation blueprints for every stage of your funnel.</p>
        </div>
        <button 
          onClick={() => setView('builder')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={18} /> New Sequence
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {PRESET_SEQUENCES.map(seq => (
          <div key={seq.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col hover:border-blue-500/50 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                  seq.goal === 'Revenue Growth' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' : 
                  seq.goal === 'Lead Nurturing' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20' : 
                  'bg-blue-100 text-blue-600 dark:bg-blue-900/20'
                }`}>
                  <Workflow size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">{seq.name}</h3>
                  <p className="text-xs text-slate-500 font-medium">{seq.goal} • {seq.steps.filter(s => !s.startsWith('Wait')).length} Touchpoints</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  seq.performance.includes('Very High') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                  seq.performance === 'High' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                  'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                }`}>
                  {seq.performance}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              {seq.description}
            </p>

            <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="text-center border-r border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                  <BarChart3 size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Open Rate</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{seq.metrics.openRate}%</p>
              </div>
              <div className="text-center border-r border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                  <MousePointer2 size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Reply Rate</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{seq.metrics.replyRate}%</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
                  <Target size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Conversion</span>
                </div>
                <p className="text-lg font-bold text-slate-900 dark:text-white">{seq.metrics.conversionRate}%</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-6">
              {seq.steps.map((step, i) => (
                <React.Fragment key={i}>
                  <div className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-[10px] font-bold ${
                    step.startsWith('Wait') 
                    ? 'bg-transparent text-slate-400 border-slate-200 dark:border-slate-800 border-dashed' 
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 shadow-sm'
                  }`}>
                    {step.includes('Email') && <Mail size={12} className="text-blue-500" />}
                    {step.includes('LinkedIn') && <Linkedin size={12} className="text-blue-600" />}
                    {step === 'SMS' && <MessageSquare size={12} className="text-emerald-500" />}
                    {step.startsWith('Wait') && <Clock size={12} />}
                    {step}
                  </div>
                  {i < seq.steps.length - 1 && <ArrowRight size={12} className="text-slate-300 dark:text-slate-700" />}
                </React.Fragment>
              ))}
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex gap-2">
                {seq.channels.map(channel => (
                  <div key={channel} className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500" title={channel}>
                    {channel === 'Email' && <Mail size={14} />}
                    {channel === 'Custom Domain' && <ShieldCheck size={14} className="text-emerald-500" />}
                    {channel === 'LinkedIn' && <Linkedin size={14} />}
                    {channel === 'SMS' && <MessageSquare size={14} />}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400 transition-colors">
                  <MoreVertical size={18} />
                </button>
                <button 
                  onClick={() => loadPreset(seq.id)}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                >
                  <Play size={14} fill="currentColor" /> Launch Automator
                </button>
              </div>
            </div>
          </div>
        ))}

        <button 
          onClick={() => setView('builder')}
          className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 flex flex-col items-center justify-center text-slate-400 hover:text-blue-500 hover:border-blue-500 transition-all group bg-slate-50/50 dark:bg-slate-900/20"
        >
          <div className="w-16 h-16 rounded-3xl bg-white dark:bg-slate-800 flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
            <Zap size={32} />
          </div>
          <span className="text-lg font-bold text-slate-900 dark:text-white mb-2">Build custom automation</span>
          <p className="text-sm max-w-xs text-center">Start from scratch or use AI to generate a sequence tailored to your ICP.</p>
        </button>
      </div>
    </div>
  );
};

export default Sequences;

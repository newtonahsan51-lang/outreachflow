
import React, { useState } from 'react';
import { 
  Workflow, Plus, ArrowRight, Mail, Linkedin, MessageSquare, 
  Clock, MoreVertical, Play, Zap, BarChart3, Target, 
  MousePointer2, X, Sparkles, Trash2, GitBranch, Save, ChevronRight,
  ShieldCheck, RefreshCw
} from 'lucide-react';

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

  if (view === 'builder') {
    return (
      <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in duration-300">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setView('list')}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-500"
            >
              <X size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">Custom Automation Builder</h1>
              <p className="text-xs text-slate-500">Design your own multi-channel outreach sequence.</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400">
              <Sparkles size={16} className="text-blue-600" /> Optimize with AI
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              <Save size={18} /> Save Sequence
            </button>
          </div>
        </div>

        <div className="flex flex-1 gap-8 overflow-hidden">
          {/* Tool Palette */}
          <div className="w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col shadow-sm">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Drag to Canvas</h3>
            <div className="space-y-3">
              {STEP_TYPES.map((item) => (
                <button 
                  key={item.type}
                  onClick={() => addStep(item.type)}
                  className="w-full p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-4 group"
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
            
            <div className="mt-auto p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 flex items-center gap-2">
                <Target size={14} /> Builder Tip
              </p>
              <p className="text-[10px] text-blue-600 dark:text-blue-500 mt-2 leading-relaxed">
                Add a 'Wait' step between every outreach to maintain high deliverability and health scores.
              </p>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-slate-100/30 dark:bg-slate-900/20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] p-12 overflow-y-auto custom-scrollbar flex flex-col items-center">
            {customSteps.length === 0 ? (
              <div className="my-auto text-center">
                <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-[30px] shadow-xl flex items-center justify-center mx-auto mb-6">
                  <Plus size={32} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Canvas is empty</h3>
                <p className="text-sm text-slate-500 max-w-xs mt-2">Choose a step from the left palette to start building your sequence.</p>
              </div>
            ) : (
              <div className="w-full max-w-2xl space-y-4">
                {customSteps.map((step, idx) => (
                  <div key={step.id} className="relative flex flex-col items-center">
                    {idx > 0 && (
                      <div className="h-10 w-px bg-slate-300 dark:bg-slate-700 relative">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 p-1 bg-white dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 text-slate-300">
                          <ArrowRight size={10} className="rotate-90" />
                        </div>
                      </div>
                    )}
                    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow group relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 font-bold border border-slate-100 dark:border-slate-700">
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                              {STEP_TYPES.find(t => t.type === step.type)?.icon && 
                                React.createElement(STEP_TYPES.find(t => t.type === step.type)!.icon, { size: 18 })}
                              {step.type} Step
                            </h4>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">Configuration</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => removeStep(step.id)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {step.type === 'Wait' ? (
                        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                          <Clock size={18} className="text-amber-500" />
                          <span className="text-sm font-semibold">Wait for</span>
                          <input type="number" defaultValue={step.config.days} className="w-16 px-2 py-1 rounded-lg border bg-white dark:bg-slate-900 text-center font-bold" />
                          <span className="text-sm font-semibold">days</span>
                          <div className="flex-1"></div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-full">
                            <GitBranch size={12} /> {step.condition || 'IF NO REPLY'}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                           {step.config.subject !== undefined && (
                            <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 rounded-xl border border-slate-100 dark:border-slate-800 mb-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase mr-2">Subject:</span>
                              <input defaultValue={step.config.subject} className="bg-transparent border-none outline-none text-sm w-full font-medium" placeholder="Email Subject" />
                            </div>
                           )}
                          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <textarea 
                              defaultValue={step.config.content}
                              placeholder={`Compose your ${step.type} message...`}
                              className="w-full bg-transparent border-none outline-none text-sm min-h-[80px] resize-none leading-relaxed"
                            />
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                              <div className="flex gap-1.5">
                                <button className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500">{"{{first_name}}"}</button>
                                <button className="text-[10px] font-bold px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-500">{"{{company}}"}</button>
                              </div>
                              <button className="flex items-center gap-1.5 text-[10px] font-bold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-2.5 py-1 rounded-lg transition-colors">
                                <Sparkles size={12} /> AI REWRITE
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                <div className="flex flex-col items-center pt-8">
                  <div className="h-10 w-px bg-slate-200 dark:bg-slate-800 border-dashed mb-4"></div>
                  <div className="flex gap-3">
                    {STEP_TYPES.map(s => (
                      <button 
                        key={s.type}
                        onClick={() => addStep(s.type)}
                        className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-500 transition-all shadow-sm"
                        title={`Add ${s.type}`}
                      >
                        <s.icon size={20} />
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

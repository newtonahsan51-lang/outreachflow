
import React, { useState } from 'react';
import { Sparkles, Copy, RefreshCcw, Save, Check, Wand2 } from 'lucide-react';
import { generateEmailCopy, GenerationParams } from '../services/geminiService';

const AIWriter = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ subject: string; body: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [params, setParams] = useState<GenerationParams>({
    product: '',
    icp: '',
    painPoint: '',
    offer: '',
    tone: 'Friendly'
  });

  const handleGenerate = async () => {
    if (!params.product || !params.icp) return;
    setLoading(true);
    try {
      const data = await generateEmailCopy(params);
      setResult(data);
    } catch (err) {
      alert("Error generating content. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(`Subject: ${result.subject}\n\n${result.body}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="text-blue-600" /> AI Email Copywriter
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Generate high-converting personalized email copy in seconds.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">My Product / Service</label>
            <input 
              type="text" 
              placeholder="e.g. OutreachFlow - Cold Email Platform" 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={params.product}
              onChange={e => setParams({...params, product: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Ideal Customer Profile (ICP)</label>
            <input 
              type="text" 
              placeholder="e.g. Marketing Agencies with 10+ employees" 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={params.icp}
              onChange={e => setParams({...params, icp: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">The Main Pain Point</label>
            <textarea 
              rows={2}
              placeholder="e.g. Low reply rates and deliverability issues" 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              value={params.painPoint}
              onChange={e => setParams({...params, painPoint: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">My Offer / Call to Action</label>
            <input 
              type="text" 
              placeholder="e.g. A free 14-day trial or 15min strategy call" 
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={params.offer}
              onChange={e => setParams({...params, offer: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Tone of Voice</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Friendly', 'Formal', 'Aggressive'] as const).map(tone => (
                <button
                  key={tone}
                  onClick={() => setParams({...params, tone})}
                  className={`py-2 px-3 text-sm font-semibold rounded-lg border transition-all ${
                    params.tone === tone 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {tone}
                </button>
              ))}
            </div>
          </div>

          <button 
            disabled={loading || !params.product || !params.icp}
            onClick={handleGenerate}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            {loading ? <RefreshCcw className="animate-spin" /> : <Wand2 size={20} />}
            {loading ? 'Generating...' : 'Generate Copy'}
          </button>
        </div>

        {/* Output Panel */}
        <div className="flex flex-col gap-4">
          <div className={`flex-1 bg-white dark:bg-slate-900 rounded-2xl border ${result ? 'border-blue-200 dark:border-blue-900/50' : 'border-slate-200 dark:border-slate-800'} shadow-lg overflow-hidden flex flex-col`}>
            {result ? (
              <>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Draft Generated</span>
                  <div className="flex gap-2">
                    <button onClick={handleCopy} className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
                      {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                    <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors">
                      <Save size={18} />
                    </button>
                  </div>
                </div>
                <div className="p-8 flex-1 overflow-y-auto space-y-4 custom-scrollbar">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-blue-600 uppercase">Subject</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{result.subject}</p>
                  </div>
                  <div className="w-12 h-px bg-slate-200 dark:bg-slate-800 my-4"></div>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {result.body}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400">
                <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-4">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-600 dark:text-slate-300">No Copy Generated Yet</h3>
                <p className="text-sm max-w-xs mt-2">Fill in your product details on the left and click Generate to see the magic.</p>
              </div>
            )}
          </div>

          {result && (
             <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 rounded-xl flex gap-3">
                <Sparkles size={20} className="text-amber-500 shrink-0" />
                <div>
                   <p className="text-sm font-bold text-amber-900 dark:text-amber-400">Pro Tip</p>
                   <p className="text-xs text-amber-800 dark:text-amber-500">Add custom variables like {"{{first_name}}"} or {"{{company_name}}"} manually for even better personalization!</p>
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIWriter;

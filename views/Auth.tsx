
import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Globe, Users, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

export const AuthView = ({ mode: initialMode, onAuthComplete }: { mode: 'login' | 'signup', onAuthComplete: () => void }) => {
  const [mode, setMode] = useState(initialMode);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (mode === 'signup' && step === 1) {
        setStep(2);
      } else {
        onAuthComplete();
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4 shadow-xl shadow-blue-500/20">O</div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">OutreachFlow</h1>
          <p className="text-slate-500 mt-2">Enterprise-grade cold email automation.</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
                {mode === 'login' ? 'Welcome Back' : 'Create your account'}
              </h2>
              
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="text" placeholder="Alex Rivera" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="email" placeholder="alex@company.com" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Password</label>
                  {mode === 'login' && <button type="button" className="text-[10px] text-blue-600 font-bold hover:underline">Forgot Password?</button>}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input type="password" placeholder="••••••••" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : mode === 'login' ? 'Login' : 'Create Account'}
                {!isLoading && <ArrowRight size={18} />}
              </button>

              <div className="text-center pt-4">
                <button 
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-sm text-slate-500"
                >
                  {mode === 'login' ? "Don't have an account?" : "Already have an account?"} <span className="text-blue-600 font-bold"> {mode === 'login' ? 'Sign up' : 'Log in'}</span>
                </button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2 text-center">Setup your Workspace</h2>
              <p className="text-sm text-slate-500 text-center mb-6">Let's customize OutreachFlow for your team.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Company Name</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                    <input type="text" placeholder="Acme Agency" className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      <option>UTC-8 (PST)</option>
                      <option>UTC+0 (GMT)</option>
                      <option>UTC+5:30 (IST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Team Size</label>
                    <select className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all">
                      <option>1-5 members</option>
                      <option>6-20 members</option>
                      <option>20+ members</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Main Use Case</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Sales', 'Agency', 'HR'].map(u => (
                      <button key={u} type="button" className="px-3 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-200 transition-all text-slate-600 dark:text-slate-400">
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95 mt-4"
              >
                {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Launch Workspace'}
                {!isLoading && <CheckCircle2 size={18} />}
              </button>
            </form>
          )}
        </div>

        <div className="mt-12 flex justify-center gap-8 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500" /> GDPR COMPLIANT</span>
          <span className="flex items-center gap-2"><CheckCircle2 size={12} className="text-green-500" /> 256-BIT ENCRYPTION</span>
        </div>
      </div>
    </div>
  );
};


import React from 'react';
import { Check, Zap, CreditCard, Shield, Globe, Award } from 'lucide-react';

const PLANS = [
  { name: 'Starter', price: '$49', features: ['5,000 Emails/mo', '3 Sending Accounts', 'Basic AI Writer', 'Community Support'], current: false },
  { name: 'Pro', price: '$129', features: ['25,000 Emails/mo', '10 Sending Accounts', 'Advanced AI Personalization', 'Priority Support', 'Team Collaboration'], current: true },
  { name: 'Agency', price: '$299', features: ['Unlimited Emails', 'Unlimited Accounts', 'Custom Branding', 'API Access', 'Dedicated Account Manager'], current: false },
];

const Billing = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Usage</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your subscription and monitor workspace usage.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <h3 className="text-lg font-bold mb-6">Current Usage (Monthly)</h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Emails Sent</span>
                <span className="text-sm font-bold text-slate-500">12,482 / 25,000</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 w-[50%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Sending Accounts</span>
                <span className="text-sm font-bold text-slate-500">6 / 10</span>
              </div>
              <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 w-[60%]"></div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Visa ending in 4242</p>
                <p className="text-xs text-slate-500">Expires 12/26</p>
              </div>
            </div>
            <button className="text-sm font-bold text-blue-600 hover:underline">Update Payment</button>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20 flex flex-col">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6">
            <Award size={24} />
          </div>
          <h3 className="text-xl font-bold mb-2">Pro Plan</h3>
          <p className="text-blue-100 text-sm mb-8 leading-relaxed">You're getting the best value with AI-personalization and priority delivery.</p>
          <div className="mt-auto">
            <p className="text-3xl font-bold">$129<span className="text-sm font-normal text-blue-200">/mo</span></p>
            <p className="text-xs text-blue-200 mt-1">Next billing date: April 15, 2024</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <div key={plan.name} className={`bg-white dark:bg-slate-900 rounded-3xl border ${plan.current ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200 dark:border-slate-800'} p-8 flex flex-col shadow-sm relative overflow-hidden`}>
            {plan.current && <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-[10px] font-bold uppercase rounded-bl-xl">Current</div>}
            <h4 className="text-xl font-bold mb-1">{plan.name}</h4>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-3xl font-bold">{plan.price}</span>
              <span className="text-sm text-slate-500">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                  <Check size={16} className="text-green-500" /> {f}
                </li>
              ))}
            </ul>
            <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${plan.current ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-default' : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:scale-[1.02]'}`}>
              {plan.current ? 'Your Current Plan' : 'Switch to ' + plan.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Billing;

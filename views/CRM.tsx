
import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Loader2, User, MoreVertical, X, Check } from 'lucide-react';
import { apiService } from '../services/apiService';

const STAGES = ['New Leads', 'Interested', 'Meeting Booked', 'Trial Started', 'Closed Won'];

const CRM = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '', contact: '', value: '', stage: 'New Leads'
  });

  const fetchDeals = async () => {
    setIsLoading(true);
    const timeout = setTimeout(() => setIsLoading(false), 5000);
    try {
      const data = await apiService.getDeals();
      clearTimeout(timeout);
      setDeals(Array.isArray(data) ? data : []);
    } catch (err) {
      clearTimeout(timeout);
      setDeals([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleAddDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await apiService.addDeal(form);
      if (res) {
        setShowAddModal(false);
        setForm({ name: '', contact: '', value: '', stage: 'New Leads' });
        await fetchDeals();
      }
    } catch (err: any) {
      alert("Error adding deal: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalValue = Array.isArray(deals) ? deals.reduce((a, b) => a + parseFloat(b.value || 0), 0) : 0;

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-slate-900 dark:text-white"><LayoutGrid className="text-blue-600" /> Sales Pipeline</h1>
          <p className="text-slate-500">Pipeline Value: <span className="font-bold text-blue-600">${totalValue.toLocaleString()}</span></p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-500/20">
          + New Deal
        </button>
      </div>

      {isLoading ? (
        <div className="p-20 flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="font-bold">Loading pipeline...</p>
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar min-h-[600px]">
          {STAGES.map(stage => {
            const stageDeals = Array.isArray(deals) ? deals.filter(d => d.stage === stage) : [];
            return (
              <div key={stage} className="w-80 shrink-0 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">{stage}</h3>
                  <span className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">{stageDeals.length}</span>
                </div>
                <div className="flex-1 bg-slate-100/40 dark:bg-slate-900/40 rounded-[32px] p-3 space-y-3">
                  {stageDeals.length === 0 ? (
                    <div className="p-10 text-center text-xs text-slate-400">No deals.</div>
                  ) : (
                    stageDeals.map(deal => (
                      <div key={deal.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">{deal.name}</h4>
                        <p className="text-xs text-slate-500 flex items-center gap-2 mt-2"><User size={12} /> {deal.contact}</p>
                        <div className="flex items-center justify-between pt-3 border-t dark:border-slate-800 mt-3">
                          <p className="text-sm font-black text-blue-600">${parseFloat(deal.value || 0).toLocaleString()}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Sales Deal</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddDeal} className="space-y-4">
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Deal Name (e.g. Enterprise Package)" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" />
              <input required value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} placeholder="Contact Email" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" />
              <input required type="number" value={form.value} onChange={e => setForm({...form, value: e.target.value})} placeholder="Deal Value ($)" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" />
              <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none">
                {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 font-bold text-slate-500">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={18} />} Save Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;

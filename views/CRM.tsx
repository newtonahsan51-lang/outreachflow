
import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, LayoutGrid, DollarSign, Clock, User, X, Loader2, 
  Trash2, TrendingUp, Briefcase, ChevronRight, MoreVertical
} from 'lucide-react';
import { apiService } from '../services/apiService';

const STAGES = ['New Leads', 'Interested', 'Meeting Booked', 'Trial Started', 'Closed Won'];

const CRM = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    name: '',
    contact: '',
    value: '',
    stage: 'New Leads'
  });

  const fetchDeals = async () => {
    setIsLoading(true);
    try {
      const data = await apiService.getDeals();
      setDeals(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.value) return;
    setIsSubmitting(true);
    try {
      const res = await apiService.addDeal(form);
      if (res.success) {
        setShowAddModal(false);
        setForm({ name: '', contact: '', value: '', stage: 'New Leads' });
        fetchDeals();
        await apiService.addLog({
          user: 'Admin',
          action: 'Created Deal',
          resource: form.name,
          status: 'Success'
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalValue = deals.reduce((a, b) => a + parseFloat(b.value || 0), 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <LayoutGrid className="text-blue-600" /> Sales Pipeline
          </h1>
          <p className="text-slate-500">
            Tracking <span className="font-bold text-blue-600">${totalValue.toLocaleString()}</span> in potential revenue across {deals.length} deals.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2"
        >
          <Plus size={20} /> New Deal
        </button>
      </div>

      {isLoading ? (
        <div className="p-20 flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="font-bold">Syncing pipeline with server...</p>
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-6 custom-scrollbar min-h-[600px]">
          {STAGES.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((a, b) => a + parseFloat(b.value || 0), 0);

            return (
              <div key={stage} className="w-80 shrink-0 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-700 dark:text-slate-300">{stage}</h3>
                    <span className="bg-slate-200 dark:bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {stageDeals.length}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                    ${stageValue.toLocaleString()}
                  </span>
                </div>

                <div className="flex-1 bg-slate-100/40 dark:bg-slate-900/40 rounded-[32px] p-3 border border-slate-200/50 dark:border-slate-800/50 space-y-3">
                  {stageDeals.length === 0 ? (
                    <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Empty Stage
                    </div>
                  ) : (
                    stageDeals.map(deal => (
                      <div key={deal.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500 transition-all group">
                        <div className="flex justify-between items-start mb-3">
                           <h4 className="font-bold text-slate-900 dark:text-white text-sm group-hover:text-blue-600 transition-colors">{deal.name}</h4>
                           <button className="text-slate-300 hover:text-slate-600"><MoreVertical size={14}/></button>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-slate-500 flex items-center gap-2">
                            <User size={12} className="text-blue-500" /> {deal.contact || 'No Contact'}
                          </p>
                          <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800 mt-2">
                             <p className="text-sm font-black text-blue-600">${parseFloat(deal.value).toLocaleString()}</p>
                             <div className="flex -space-x-1">
                                <div className="w-6 h-6 rounded-full bg-slate-100 border border-white dark:border-slate-900 text-[8px] flex items-center justify-center font-bold">AR</div>
                             </div>
                          </div>
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

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Create New Deal</h2>
                  <p className="text-sm text-slate-500">Add a potential sale to your pipeline.</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Deal Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" placeholder="e.g. 50 Seats License" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Contact Name</label>
                <div className="relative">
                  <input value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} type="text" placeholder="e.g. John Wick" className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm" />
                  <User className="absolute left-3 top-2.5 text-slate-300" size={16} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Value ($)</label>
                  <div className="relative">
                    <input required value={form.value} onChange={e => setForm({...form, value: e.target.value})} type="number" placeholder="5000" className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-bold" />
                    <DollarSign className="absolute left-3 top-2.5 text-slate-300" size={16} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pipeline Stage</label>
                  <select value={form.stage} onChange={e => setForm({...form, stage: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold">
                    {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Briefcase className="text-blue-600 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                  Adding a deal will automatically update your projected revenue analytics in the dashboard.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Plus size={18} />}
                {isSubmitting ? 'Creating...' : 'Create Deal'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;

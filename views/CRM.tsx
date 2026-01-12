
import React, { useState, useEffect } from 'react';
import { 
  Search, Plus, LayoutGrid, DollarSign, Clock, User, X, Loader2
} from 'lucide-react';
import { apiService } from '../services/apiService';

const STAGES = ['New Leads', 'Interested', 'Meeting Booked', 'Trial Started', 'Closed Won'];

const CRM = () => {
  const [deals, setDeals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        const data = await apiService.getDeals();
        setDeals(data || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDeals();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3"><LayoutGrid className="text-blue-600" /> Sales Pipeline</h1>
          <p className="text-slate-500">Tracking ${deals.reduce((a, b) => a + parseFloat(b.value), 0).toLocaleString()} in potential revenue.</p>
        </div>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg"><Plus size={20} /> New Deal</button>
      </div>

      {isLoading ? (
        <div className="p-20 flex flex-col items-center gap-4 text-slate-400">
          <Loader2 className="animate-spin text-blue-600" size={32} />
          <p className="font-bold">Syncing pipeline...</p>
        </div>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-6">
          {STAGES.map(stage => (
            <div key={stage} className="w-80 shrink-0 bg-slate-100/40 dark:bg-slate-900/40 rounded-[32px] p-5">
              <h3 className="font-bold text-sm mb-4 flex justify-between">
                {stage} 
                <span className="bg-white px-2 py-0.5 rounded-full border text-[10px]">{deals.filter(d => d.stage === stage).length}</span>
              </h3>
              <div className="space-y-4">
                {deals.filter(d => d.stage === stage).map(deal => (
                  <div key={deal.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border shadow-sm">
                    <h4 className="font-bold mb-2">{deal.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center gap-2 mb-2"><User size={12}/> {deal.contact}</p>
                    <p className="text-sm font-black text-blue-600">${parseFloat(deal.value).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CRM;

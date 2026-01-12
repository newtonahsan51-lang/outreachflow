
import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Filter, MoreHorizontal, User, DollarSign, 
  Clock, X, Trash2, Edit2, ChevronRight, LayoutGrid, 
  BarChart3, AlertCircle, CheckCircle2, Loader2, ArrowRight
} from 'lucide-react';

const STAGES = ['New Leads', 'Interested', 'Meeting Booked', 'Trial Started', 'Closed Won'];

interface Deal {
  id: string;
  name: string;
  contact: string;
  value: number;
  stage: string;
  lastActive: string;
  email: string;
  notes: string;
}

const INITIAL_DEALS: Deal[] = [
  { id: '1', name: 'Acme Corp', contact: 'John Smith', email: 'john@acme.com', value: 2400, stage: 'New Leads', lastActive: '2h ago', notes: 'Initial outreach sent.' },
  { id: '2', name: 'Global Tech', contact: 'Sarah J.', email: 'sarah@global.io', value: 12000, stage: 'Interested', lastActive: '5m ago', notes: 'Interested in enterprise plan.' },
  { id: '3', name: 'InnoWorks', contact: 'Mike Ross', email: 'mike@innoworks.com', value: 5000, stage: 'Meeting Booked', lastActive: '1d ago', notes: 'Demo scheduled for Friday.' },
  { id: '4', name: 'Apex Ltd', contact: 'Emma Stone', email: 'emma@apex.co', value: 8500, stage: 'Trial Started', lastActive: '4h ago', notes: 'Currently testing multi-channel sequences.' },
];

const CRM = () => {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // New Deal Form State
  const [newDeal, setNewDeal] = useState<Partial<Deal>>({
    name: '',
    contact: '',
    email: '',
    value: 0,
    stage: 'New Leads',
    notes: ''
  });

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deals, searchQuery]);

  const getStageTotal = (stage: string) => {
    return filteredDeals
      .filter(d => d.stage === stage)
      .reduce((sum, d) => sum + d.value, 0);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    const deal: Deal = {
      ...(newDeal as Deal),
      id: Math.random().toString(36).substr(2, 9),
      lastActive: 'Just now',
    };
    setDeals([deal, ...deals]);
    setShowAddModal(false);
    setNewDeal({ name: '', contact: '', email: '', value: 0, stage: 'New Leads', notes: '' });
  };

  const handleUpdateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDeal) return;
    setDeals(deals.map(d => d.id === selectedDeal.id ? selectedDeal : d));
    setIsEditing(false);
  };

  const moveDeal = (id: string, newStage: string) => {
    setDeals(deals.map(d => d.id === id ? { ...d, stage: newStage, lastActive: 'Just now' } : d));
    if (selectedDeal?.id === id) setSelectedDeal({ ...selectedDeal, stage: newStage });
  };

  const deleteDeal = (id: string) => {
    if (confirm('Are you sure you want to delete this deal?')) {
      setDeals(deals.filter(d => d.id !== id));
      setSelectedDeal(null);
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-140px)] flex flex-col animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            <LayoutGrid className="text-blue-600" /> Sales Pipeline
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Total pipeline value: <span className="font-bold text-slate-900 dark:text-white">${deals.reduce((a, b) => a + b.value, 0).toLocaleString()}</span></p>
        </div>
        <div className="flex gap-2">
           <div className="flex items-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl shadow-sm w-full md:w-64 focus-within:border-blue-500 transition-all">
             <Search size={18} className="text-slate-400 mr-2" />
             <input 
               type="text" 
               placeholder="Find deals..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               className="bg-transparent text-sm border-none outline-none w-full" 
             />
           </div>
           <button 
             onClick={() => setShowAddModal(true)}
             className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
           >
             <Plus size={20} /> New Deal
           </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-5 h-full min-w-max pr-6">
          {STAGES.map(stage => (
            <div key={stage} className="w-80 flex flex-col h-full bg-slate-100/40 dark:bg-slate-900/40 rounded-[32px] border border-slate-200/50 dark:border-slate-800/50">
              <div className="p-5 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-2">
                    {stage}
                    <span className="bg-white dark:bg-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
                      {filteredDeals.filter(d => d.stage === stage).length}
                    </span>
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Total: ${getStageTotal(stage).toLocaleString()}</p>
                </div>
                <button className="p-1.5 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><MoreHorizontal size={16} /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-4 custom-scrollbar">
                {filteredDeals.filter(d => d.stage === stage).map(deal => (
                  <div 
                    key={deal.id} 
                    onClick={() => setSelectedDeal(deal)}
                    className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:border-blue-400 dark:hover:border-blue-800 transition-all cursor-pointer group animate-in zoom-in-95"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{deal.name}</h4>
                      <div className="p-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-400 group-hover:text-blue-500">
                        <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                    
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                        <User size={14} className="text-slate-400" /> {deal.contact}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-blue-600 font-black">
                        <DollarSign size={14} /> ${deal.value.toLocaleString()}
                      </div>
                      
                      <div className="flex items-center justify-between pt-3 border-t border-slate-50 dark:border-slate-800 mt-2">
                        <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold uppercase tracking-tighter">
                          <Clock size={12} /> {deal.lastActive}
                        </span>
                        <div className="flex -space-x-2">
                          <img src={`https://picsum.photos/seed/${deal.id}/20/20`} className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-900" alt="Assignee" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => { setNewDeal({...newDeal, stage}); setShowAddModal(true); }}
                  className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-bold text-slate-400 hover:text-blue-500 hover:border-blue-500 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <Plus size={14} /> Add New Deal
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Deal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[32px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Create New Deal</h2>
                <p className="text-sm text-slate-500">Enter details to track a new sales opportunity.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddDeal} className="p-8 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company Name</label>
                  <input 
                    required 
                    type="text" 
                    value={newDeal.name}
                    onChange={e => setNewDeal({...newDeal, name: e.target.value})}
                    placeholder="e.g. Acme Corp" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Contact Person</label>
                  <input 
                    required 
                    type="text" 
                    value={newDeal.contact}
                    onChange={e => setNewDeal({...newDeal, contact: e.target.value})}
                    placeholder="John Doe" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Deal Value ($)</label>
                  <input 
                    required 
                    type="number" 
                    value={newDeal.value}
                    onChange={e => setNewDeal({...newDeal, value: parseInt(e.target.value) || 0})}
                    placeholder="5000" 
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Stage</label>
                <select 
                  value={newDeal.stage}
                  onChange={e => setNewDeal({...newDeal, stage: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STAGES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Create Opportunity</button>
            </form>
          </div>
        </div>
      )}

      {/* Deal Details Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-3xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-200">
                  <DollarSign size={32} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{selectedDeal.name}</h2>
                  <p className="text-sm text-slate-500">Deal managed by Alex Rivera</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                  <Edit2 size={20} />
                </button>
                <button onClick={() => deleteDeal(selectedDeal.id)} className="p-2 hover:bg-red-50 text-red-500 rounded-xl">
                  <Trash2 size={20} />
                </button>
                <button onClick={() => setSelectedDeal(null)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-10 grid grid-cols-3 gap-10">
              <div className="col-span-2 space-y-8">
                {isEditing ? (
                  <form onSubmit={handleUpdateDeal} className="space-y-6">
                    <div className="space-y-4">
                      <input 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none"
                        value={selectedDeal.name}
                        onChange={e => setSelectedDeal({...selectedDeal, name: e.target.value})}
                        placeholder="Company Name"
                      />
                      <textarea 
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none min-h-[120px] resize-none"
                        value={selectedDeal.notes}
                        onChange={e => setSelectedDeal({...selectedDeal, notes: e.target.value})}
                        placeholder="Deal notes..."
                      />
                    </div>
                    <button type="submit" className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold">Save Changes</button>
                  </form>
                ) : (
                  <>
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Deal Progress</h4>
                      <div className="flex items-center gap-1">
                        {STAGES.map((s, i) => (
                          <React.Fragment key={s}>
                            <button 
                              onClick={() => moveDeal(selectedDeal.id, s)}
                              className={`flex-1 h-2.5 rounded-full transition-all ${
                                STAGES.indexOf(selectedDeal.stage) >= i ? 'bg-blue-600' : 'bg-slate-100 dark:bg-slate-800'
                              }`} 
                              title={s}
                            />
                          </React.Fragment>
                        ))}
                      </div>
                      <p className="text-xs font-bold text-blue-600 mt-3 text-right">Current: {selectedDeal.stage}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Recent Notes</h4>
                      <div className="p-5 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 italic text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        "{selectedDeal.notes || 'No notes available for this deal yet.'}"
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[32px] border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Deal Value</p>
                     <p className="text-2xl font-black text-slate-900 dark:text-white">${selectedDeal.value.toLocaleString()}</p>
                   </div>
                   <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Primary Contact</p>
                     <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                         {selectedDeal.contact[0]}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedDeal.contact}</p>
                         <p className="text-[10px] text-slate-500 font-medium">{selectedDeal.email || 'No email synced'}</p>
                       </div>
                     </div>
                   </div>
                   <div className="pt-4">
                     <button className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-600 flex items-center justify-center gap-2 hover:border-blue-500 transition-all">
                       <BarChart3 size={14} /> Full Engagement History
                     </button>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;

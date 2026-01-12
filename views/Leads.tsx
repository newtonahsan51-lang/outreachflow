
import React, { useState, useRef } from 'react';
import { 
  Download, Upload, Filter, Search, MoreVertical, 
  Linkedin, Mail, Phone, Calendar, Clock, Sparkles,
  ChevronRight, X, ExternalLink, Send, Zap, Loader2, Check,
  FileSpreadsheet, Database, ArrowRight, Play
} from 'lucide-react';

const mockLeads = [
  { id: '1', name: 'Sarah Wilson', email: 'sarah@techflow.io', company: 'TechFlow', title: 'Director of Growth', status: 'Opened', source: 'LinkedIn', activity: '2h ago', score: 85, enriched: false },
  { id: '2', name: 'James Chen', email: 'james@vertex.com', company: 'Vertex Systems', title: 'VP Sales', status: 'Booked', source: 'Manual', activity: '5m ago', score: 98, enriched: true },
  { id: '3', name: 'Elena Rodriguez', email: 'elena@skyline.co', company: 'Skyline Creative', title: 'Founder', status: 'Replied', source: 'Import', activity: '1d ago', score: 92, enriched: false },
  { id: '4', name: 'Marcus Thorne', email: 'm.thorne@globalit.net', company: 'Global IT', title: 'IT Manager', status: 'Cold', source: 'LinkedIn', activity: '3d ago', score: 45, enriched: false },
  { id: '5', name: 'Olivia Bennett', email: 'olivia@designhub.com', company: 'DesignHub', title: 'Creative Director', status: 'Opened', source: 'Apollo', activity: '6h ago', score: 72, enriched: true },
];

const Leads = () => {
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isEnriching, setIsEnriching] = useState(false);
  const [leads, setLeads] = useState(mockLeads);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Booked': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Replied': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Opened': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const handleEnrich = () => {
    setIsEnriching(true);
    setTimeout(() => {
      setLeads(prev => prev.map(l => ({ ...l, enriched: true, score: Math.min(100, l.score + 10) })));
      setIsEnriching(false);
    }, 2000);
  };

  const handleImportCSV = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setImportStep(2);
    }, 1500);
  };

  const finalizeImport = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setShowImportWizard(false);
      setImportStep(1);
      alert('সফলভাবে লিডগুলো আপলোড হয়েছে এবং সিকুয়েন্স শুরু হয়েছে!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Total 12,482 prospects in your workspace.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setShowImportWizard(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 flex items-center gap-2"
          >
            <Upload size={18} /> Import Leads & Start Sequence
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 w-full md:w-96 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <input type="text" placeholder="Search by name, company..." className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-300" />
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-50">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded" /></th>
                <th className="px-6 py-4">Lead</th>
                <th className="px-6 py-4">Company & Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4 text-right">Activity</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
              {leads.map((lead) => (
                <tr 
                  key={lead.id} 
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white">{lead.name}</p>
                        <p className="text-xs text-slate-500">{lead.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{lead.company}</p>
                    <p className="text-xs text-slate-500">{lead.title}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full ${lead.score > 80 ? 'bg-green-500' : 'bg-blue-500'}`} style={{width: `${lead.score}%`}}></div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{lead.score}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <p className="text-xs text-slate-500">{lead.activity}</p>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-400">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Wizard Modal */}
      {showImportWizard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Database size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">লিড ইমপোর্ট উইজার্ড</h2>
                  <p className="text-sm text-slate-500">ধাপে ধাপে লিড আপলোড করুন।</p>
                </div>
              </div>
              <button onClick={() => {setShowImportWizard(false); setImportStep(1);}} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-10">
              {/* Stepper */}
              <div className="flex items-center justify-center mb-10">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                      importStep === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 
                      importStep > s ? 'bg-emerald-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}>
                      {importStep > s ? <Check size={20} /> : s}
                    </div>
                    {s < 3 && <div className={`w-20 h-1 mx-2 rounded-full ${importStep > s ? 'bg-emerald-500' : 'bg-slate-100 dark:bg-slate-800'}`} />}
                  </React.Fragment>
                ))}
              </div>

              {importStep === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 text-center">
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[40px] p-16 hover:border-blue-500 hover:bg-blue-50/30 transition-all group cursor-pointer"
                  >
                    <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-[30px] flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                      <FileSpreadsheet size={40} />
                    </div>
                    <h3 className="text-xl font-bold">CSV বা Excel ফাইল সিলেক্ট করুন</h3>
                    <p className="text-sm text-slate-500 max-w-xs mx-auto mt-2">আপনার লিড লিস্ট ড্র্যাগ করে এখানে আনুন অথবা ফাইলটি ক্লিক করে সিলেক্ট করুন।</p>
                    <input ref={fileInputRef} type="file" className="hidden" accept=".csv,.xlsx" onChange={handleImportCSV} />
                  </div>
                  {isConnecting && (
                    <div className="flex items-center justify-center gap-3 text-blue-600 font-bold">
                      <Loader2 className="animate-spin" /> ফাইল বিশ্লেষণ করা হচ্ছে...
                    </div>
                  )}
                </div>
              )}

              {importStep === 2 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold">কলাম ম্যাপিং করুন (Column Mapping)</h3>
                  <p className="text-sm text-slate-500">আপনার ফাইলের কলামগুলোর সাথে আমাদের সিস্টেমের ফিল্ডগুলো মিলিয়ে দিন।</p>
                  
                  <div className="space-y-3">
                    {[
                      { label: 'নাম (Name)', map: 'First Name' },
                      { label: 'ইমেল (Email)', map: 'Email Address' },
                      { label: 'কোম্পানি (Company)', map: 'Company' },
                    ].map((field, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl">
                        <span className="text-sm font-bold">{field.label}</span>
                        <div className="flex items-center gap-3">
                          <ArrowRight size={16} className="text-slate-400" />
                          <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 text-xs font-bold outline-none">
                            <option>{field.map}</option>
                            <option>Ignore</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button 
                    onClick={() => setImportStep(3)}
                    className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    ম্যাপিং নিশ্চিত করুন <ChevronRight size={20} />
                  </button>
                </div>
              )}

              {importStep === 3 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                  <h3 className="text-lg font-bold">সিকুয়েন্স সিলেক্ট করুন (Target Sequence)</h3>
                  <p className="text-sm text-slate-500">লিডগুলো ইমপোর্ট হওয়ার পর কোন ক্যাম্পেইন শুরু হবে?</p>
                  
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { name: 'Standard 3-Step Growth', leads: 42, color: 'blue' },
                      { name: 'SaaS Agency Master Flow', leads: 128, color: 'emerald' },
                      { name: 'The Gentle Nudge', leads: 12, color: 'amber' }
                    ].map((seq, i) => (
                      <label key={i} className="flex items-center justify-between p-5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-[28px] cursor-pointer hover:border-blue-500 transition-all group">
                        <div className="flex items-center gap-4">
                          <input type="radio" name="sequence" defaultChecked={i===0} className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="text-sm font-bold group-hover:text-blue-600 transition-colors">{seq.name}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Active in {seq.leads} campaigns</p>
                          </div>
                        </div>
                        <div className={`p-2 rounded-xl bg-${seq.color}-100 dark:bg-${seq.color}-900/30 text-${seq.color}-600`}>
                          <Zap size={18} />
                        </div>
                      </label>
                    ))}
                  </div>

                  <button 
                    onClick={finalizeImport}
                    disabled={isConnecting}
                    className="w-full py-5 bg-emerald-600 text-white rounded-3xl font-bold shadow-xl shadow-emerald-500/20 hover:bg-emerald-700 transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    {isConnecting ? <Loader2 className="animate-spin" /> : <Play size={20} fill="currentColor" />}
                    {isConnecting ? 'ফিনিশিং টাচ দেয়া হচ্ছে...' : 'ইমপোর্ট সম্পন্ন করুন ও ক্যাম্পেইন শুরু করুন'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;

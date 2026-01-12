
import React, { useState, useEffect } from 'react';
import { 
  Download, Upload, Filter, Search, MoreVertical, 
  Linkedin, Mail, Phone, Calendar, Clock, Sparkles,
  ChevronRight, X, ExternalLink, Send, Zap, Loader2, Check,
  FileSpreadsheet, Database, ArrowRight, Play
} from 'lucide-react';
import { apiService } from '../services/apiService';

const Leads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImportWizard, setShowImportWizard] = useState(false);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await apiService.getLeads();
        setLeads(data || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Booked': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30';
      case 'Replied': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30';
      case 'Opened': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all prospects in your database.</p>
        </div>
        <button onClick={() => setShowImportWizard(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2">
          <Upload size={18} /> Import Leads
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center gap-4 text-slate-400">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="font-bold">Fetching leads from server...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-6 py-4">Lead</th>
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Score</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leads.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400">No leads found in database.</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{lead.name[0]}</div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{lead.name}</p>
                            <p className="text-xs text-slate-500">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{lead.company}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-blue-600">{lead.score || 0}</span>
                      </td>
                      <td className="px-6 py-4 text-right"><MoreVertical size={16} className="text-slate-400 cursor-pointer ml-auto" /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Leads;

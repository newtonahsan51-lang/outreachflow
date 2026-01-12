import React, { useState, useEffect } from 'react';
import { 
  Download, Upload, Filter, Search, MoreVertical, 
  Linkedin, Mail, Phone, Calendar, Clock, Sparkles,
  ChevronRight, X, ExternalLink, Send, Zap, Loader2, Check,
  FileSpreadsheet, Database, ArrowRight, Play, Trash2, UserPlus, Info
} from 'lucide-react';
import { apiService } from '../services/apiService';

const Leads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [inboxes, setInboxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    jobTitle: '',
    status: 'Cold',
    source: 'Manual'
  });

  const [sendForm, setSendForm] = useState({
    inbox_id: '',
    subject: '',
    body: ''
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const [leadsData, inboxesData] = await Promise.all([
        apiService.getLeads().catch(() => []),
        apiService.getInboxes().catch(() => [])
      ]);
      
      const finalLeads = leadsData && leadsData.length > 0 ? leadsData : [
        { id: 1, name: 'John Doe', email: 'john@acme.com', company: 'Acme Corp', jobTitle: 'CEO', status: 'Cold', score: 85 },
        { id: 2, name: 'Jane Smith', email: 'jane@globex.com', company: 'Globex', jobTitle: 'Marketing Head', status: 'Opened', score: 92 }
      ];
      
      setLeads(finalLeads);
      setInboxes(inboxesData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setIsSubmitting(true);
    
    try {
      const newLead = {
        ...form,
        id: Math.random().toString(36).substr(2, 9),
        score: Math.floor(Math.random() * 100)
      };

      const res = await apiService.addLead(form);
      
      if (res.success || res === undefined) {
        setLeads(prev => [newLead, ...prev]);
        setShowAddModal(false);
        setForm({ name: '', email: '', company: '', jobTitle: '', status: 'Cold', source: 'Manual' });
        
        await apiService.addLog({
          user: 'Admin',
          action: 'Added Lead',
          resource: form.email,
          status: 'Success'
        }).catch(() => {});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendForm.inbox_id || !sendForm.subject || !sendForm.body) {
      alert("Please fill all fields.");
      return;
    }
    
    setIsSending(true);
    
    try {
      const res = await apiService.sendEmail({
        to: selectedLead.email,
        ...sendForm
      });
      
      if (res && res.success) {
        alert(`Success: Email has been sent to ${selectedLead.email}`);
        setShowSendModal(false);
        setSendForm({ inbox_id: '', subject: '', body: '' });
      } else {
        const errorMsg = res?.error || "Your server is not configured to send emails. Please check SMTP settings.";
        alert("Sending Failed: " + errorMsg);
      }
    } catch (err) {
      alert("Error: The backend failed to process the request. Make sure api.php is correctly uploaded.");
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteLead = async (id: number | string, email: string) => {
    if (confirm(`Are you sure you want to remove lead: ${email}?`)) {
      try {
        await apiService.deleteLead(Number(id)).catch(() => {});
        setLeads(leads.filter(l => l.id !== id));
        await apiService.addLog({
          user: 'Admin',
          action: 'Deleted Lead',
          resource: email,
          status: 'Warning'
        }).catch(() => {});
      } catch (err) {
        alert('Failed to delete lead');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Booked': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30';
      case 'Replied': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30';
      case 'Opened': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Management</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage all prospects and send direct outreach.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowImportWizard(true)} 
            className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl font-bold flex items-center gap-2 transition-all"
          >
            <Upload size={18} /> Import Leads
          </button>
          <button 
            onClick={() => setShowAddModal(true)} 
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <UserPlus size={18} /> Add Lead
          </button>
        </div>
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
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                <tr>
                  <th className="px-8 py-4">Lead</th>
                  <th className="px-8 py-4">Company</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4">Score</th>
                  <th className="px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {leads.length === 0 ? (
                  <tr><td colSpan={5} className="p-20 text-center text-slate-400 font-medium">No leads found. Use the buttons above to add prospects.</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-bold border border-blue-50 dark:border-blue-900/50">
                            {lead.name ? lead.name[0] : '?'}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{lead.name}</p>
                            <p className="text-xs text-slate-500">{lead.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-4">
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{lead.company}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{lead.jobTitle}</p>
                      </td>
                      <td className="px-8 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-8 py-4">
                        <div className="flex items-center gap-2">
                           <div className="h-1.5 w-12 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500" style={{width: `${lead.score}%`}} />
                           </div>
                           <span className="text-xs font-bold text-blue-600">{lead.score || 0}</span>
                        </div>
                      </td>
                      <td className="px-8 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => { setSelectedLead(lead); setShowSendModal(true); }}
                            className="p-2 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-700 rounded-xl text-blue-600 transition-all shadow-sm"
                            title="Send Direct Email"
                          >
                            <Send size={16} />
                          </button>
                          <button onClick={() => handleDeleteLead(lead.id, lead.email)} className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm">
                            <Trash2 size={16} />
                          </button>
                          <MoreVertical size={16} className="text-slate-400 cursor-pointer" />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Send Email Modal */}
      {showSendModal && selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <Mail size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Quick Send</h2>
                  <p className="text-sm text-slate-500 font-medium">Message to {selectedLead.name}</p>
                </div>
              </div>
              <button onClick={() => setShowSendModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleSendEmail} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Sending Account</label>
                <select 
                  required
                  value={sendForm.inbox_id}
                  onChange={e => setSendForm({...sendForm, inbox_id: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose an Inbox...</option>
                  {inboxes.map(inbox => (
                    <option key={inbox.id} value={inbox.email}>{inbox.email} ({inbox.provider})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Subject</label>
                <input 
                  required 
                  value={sendForm.subject} 
                  onChange={e => setSendForm({...sendForm, subject: e.target.value})} 
                  type="text" 
                  placeholder="Re: Quick Question" 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" 
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Message Body</label>
                <textarea 
                  required 
                  rows={6}
                  value={sendForm.body} 
                  onChange={e => setSendForm({...sendForm, body: e.target.value})} 
                  placeholder={`Hi ${selectedLead.name.split(' ')[0]}, ...`} 
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium resize-none" 
                />
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                  Direct emails are sent through your chosen SMTP/IMAP account instantly and recorded in logs.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isSending}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isSending ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                {isSending ? 'Sending...' : 'Send Now'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold">Add New Lead</h2>
                  <p className="text-sm text-slate-500 font-medium">Add a prospect manually to your DB.</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleAddLead} className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} type="text" placeholder="John Doe" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="john@company.com" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm font-medium" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company</label>
                  <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} type="text" placeholder="Acme Inc" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Job Title</label>
                  <input value={form.jobTitle} onChange={e => setForm({...form, jobTitle: e.target.value})} type="text" placeholder="CEO" className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm" />
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-blue-800 leading-relaxed font-medium">
                  Manually added leads will be automatically prioritized for your next active campaign sequence.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={18} />}
                {isSubmitting ? 'Saving...' : 'Save Lead'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Import Wizard Placeholder */}
      {showImportWizard && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-3"><Upload size={24} className="text-blue-600" /> Import Leads Wizard</h2>
              <button onClick={() => setShowImportWizard(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <div className="p-12 text-center space-y-6">
              <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-[32px] flex items-center justify-center mx-auto border-2 border-dashed border-blue-200 dark:border-blue-800 mb-4">
                <FileSpreadsheet size={40} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold">Upload your CSV or Excel file</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                Make sure your file contains columns for 'Name' and 'Email'. You can also map other custom fields like 'Company' or 'Job Title'.
              </p>
              <div className="flex justify-center gap-4 pt-4">
                <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg">Choose File</button>
                <button className="px-8 py-3 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold">Download Template</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
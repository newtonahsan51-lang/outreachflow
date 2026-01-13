
import React, { useState, useEffect } from 'react';
import { 
  Upload, Search, MoreVertical, Send, Loader2, Check, UserPlus, Trash2, X, Mail
} from 'lucide-react';
import { apiService } from '../services/apiService';

const Leads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [inboxes, setInboxes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const [form, setForm] = useState({
    name: '', email: '', company: '', jobTitle: '', status: 'Cold', source: 'Manual'
  });

  const [emailForm, setEmailForm] = useState({
    subject: '', body: '', from_inbox: ''
  });

  const fetchLeads = async () => {
    setIsLoading(true);
    try {
      const [leadsData, inboxesData] = await Promise.all([
        apiService.getLeads().catch(() => []),
        apiService.getInboxes().catch(() => [])
      ]);

      const processedLeads = Array.isArray(leadsData) ? leadsData : (leadsData?.data || []);
      const processedInboxes = Array.isArray(inboxesData) ? inboxesData : (inboxesData?.data || []);
      
      setLeads(processedLeads);
      setInboxes(processedInboxes);
    } catch (err) {
      console.error("Fetch Error:", err);
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
      const res = await apiService.addLead(form);
      if (res) {
        setShowAddModal(false);
        setForm({ name: '', email: '', company: '', jobTitle: '', status: 'Cold', source: 'Manual' });
        await fetchLeads();
      }
    } catch (err: any) {
      alert("Error adding lead: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !emailForm.subject || !emailForm.from_inbox) return;
    setIsSubmitting(true);
    try {
      await apiService.sendEmail({
        to: selectedLead.email,
        from: emailForm.from_inbox,
        subject: emailForm.subject,
        body: emailForm.body
      });
      alert("Email sent successfully!");
      setShowSendModal(false);
      setEmailForm({ subject: '', body: '', from_inbox: '' });
    } catch (err: any) {
      alert("Failed to send email: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this lead?")) {
      setIsLoading(true);
      try {
        await apiService.deleteLead(id);
        await fetchLeads();
      } catch (err: any) {
        alert("Delete failed: " + err.message);
        setIsLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Booked': return 'bg-emerald-100 text-emerald-700';
      case 'Replied': return 'bg-blue-100 text-blue-700';
      case 'Opened': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads Management</h1>
          <p className="text-slate-500">Manage all prospects and send direct outreach.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={fetchLeads} 
            disabled={isLoading}
            className={`p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all ${isLoading ? 'opacity-50' : ''}`}
          >
             <Loader2 size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-blue-500/20">
            <UserPlus size={18} /> Add Lead
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px] relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-slate-900/50 z-10 flex flex-col items-center justify-center gap-4 text-slate-400">
            <Loader2 className="animate-spin text-blue-600" size={32} />
            <p className="font-bold">Syncing Leads...</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-500">
              <tr>
                <th className="px-8 py-4">Lead</th>
                <th className="px-8 py-4">Company</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {leads.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={4} className="p-20 text-center text-slate-400 font-medium">
                    No leads found. Click "Add Lead" to start.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-600">
                          {lead.name ? lead.name[0] : '?'}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-slate-900 dark:text-white">{lead.name}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{lead.company}</p>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => { setSelectedLead(lead); setShowSendModal(true); }} 
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all"
                          title="Send Direct Email"
                        >
                          <Send size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(lead.id)} 
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all"
                          title="Delete Lead"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-md shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Lead</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddLead} className="space-y-4">
              <input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input required value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" placeholder="Email" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input value={form.company} onChange={e => setForm({...form, company: e.target.value})} placeholder="Company" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-all">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 active:scale-95 transition-all">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Check size={18} />} Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Email Modal */}
      {showSendModal && selectedLead && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Direct Outreach</h2>
                <p className="text-xs text-slate-500">To: {selectedLead.email}</p>
              </div>
              <button onClick={() => setShowSendModal(false)} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
            </div>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase mb-2 block">Select Sender Account</label>
                <select 
                  required 
                  value={emailForm.from_inbox} 
                  onChange={e => setEmailForm({...emailForm, from_inbox: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none"
                >
                  <option value="">Choose an Inbox</option>
                  {inboxes.map(inbox => <option key={inbox.id} value={inbox.email}>{inbox.email}</option>)}
                </select>
              </div>
              <input required value={emailForm.subject} onChange={e => setEmailForm({...emailForm, subject: e.target.value})} placeholder="Email Subject" className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none" />
              <textarea required value={emailForm.body} onChange={e => setEmailForm({...emailForm, body: e.target.value})} placeholder="Message content..." rows={5} className="w-full p-3 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl outline-none resize-none" />
              
              <div className="flex gap-2 pt-4">
                <button type="button" onClick={() => setShowSendModal(false)} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2">
                  {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={18} />} {isSubmitting ? 'Sending...' : 'Send Now'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;

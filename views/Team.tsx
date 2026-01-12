
import React, { useState, useMemo } from 'react';
import { 
  UserPlus, MoreVertical, Shield, User, Mail, ShieldCheck, 
  X, Check, Trash2, Edit2, Search, Filter, 
  Settings, Loader2, Info, ArrowRight, UserCheck, 
  Lock, Globe, Layout, Smartphone, Users
} from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'Owner' | 'Admin' | 'Member';
  status: 'Active' | 'Invited' | 'Deactivated';
  avatar: string;
  lastActive: string;
}

const INITIAL_MEMBERS: TeamMember[] = [
  { id: '1', name: 'Alex Rivera', email: 'alex@growthflow.io', role: 'Owner', status: 'Active', avatar: 'alex', lastActive: '2 hours ago' },
  { id: '2', name: 'Sarah Chen', email: 'sarah@growthflow.io', role: 'Admin', status: 'Active', avatar: 'u1', lastActive: '5 mins ago' },
  { id: '3', name: 'Mike Johnson', email: 'mike@growthflow.io', role: 'Member', status: 'Active', avatar: 'u2', lastActive: 'Yesterday' },
  { id: '4', name: 'Emma Wilson', email: 'emma@growthflow.io', role: 'Member', status: 'Invited', avatar: 'u3', lastActive: 'Never' },
];

const Team = () => {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [inviteForm, setInviteForm] = useState({
    name: '',
    email: '',
    role: 'Member' as const
  });

  const filteredMembers = useMemo(() => {
    return members.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [members, searchQuery]);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      const newMember: TeamMember = {
        id: Math.random().toString(36).substr(2, 9),
        name: inviteForm.name,
        email: inviteForm.email,
        role: inviteForm.role as 'Owner' | 'Admin' | 'Member',
        status: 'Invited',
        avatar: `u${Math.floor(Math.random() * 10)}`,
        lastActive: 'Never'
      };
      setMembers([...members, newMember]);
      setIsSubmitting(false);
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '', role: 'Member' });
    }, 1500);
  };

  const handleUpdateRole = (id: string, role: 'Owner' | 'Admin' | 'Member') => {
    setMembers(members.map(m => m.id === id ? { ...m, role } : m));
    setShowEditModal(false);
  };

  const toggleStatus = (id: string) => {
    setMembers(members.map(m => {
      if (m.id === id) {
        return { 
          ...m, 
          status: m.status === 'Active' ? 'Deactivated' : 'Active' 
        };
      }
      return m;
    }));
  };

  const removeMember = (id: string) => {
    if (confirm('Are you sure you want to remove this team member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            {/* Added missing Users icon from lucide-react */}
            <Users className="text-blue-600" /> Team Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400">Total {members.length} members in your organization workspace.</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all active:scale-95"
        >
          <UserPlus size={18} /> Invite Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Members</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{members.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pending Invites</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{members.filter(m => m.status === 'Invited').length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Active Today</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{members.filter(m => m.lastActive.includes('mins') || m.lastActive.includes('hours')).length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Available Seats</p>
          <p className="text-2xl font-bold text-blue-600">10 / 25</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-2xl border border-slate-200 dark:border-slate-700 w-full md:w-96 shadow-sm">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm w-full text-slate-700 dark:text-slate-300" 
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 transition-colors hover:border-blue-500">
            <Filter size={16} /> Filters
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Last Active</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={`https://picsum.photos/seed/${member.avatar}/40/40`} 
                          alt={member.name}
                          className="w-10 h-10 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
                        />
                        {member.status === 'Active' && (
                          <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white text-sm">{member.name}</p>
                        <p className="text-xs text-slate-500">{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {member.role === 'Owner' ? (
                        <ShieldCheck size={14} className="text-blue-600" />
                      ) : member.role === 'Admin' ? (
                        <Shield size={14} className="text-amber-500" />
                      ) : (
                        <User size={14} className="text-slate-400" />
                      )}
                      <span className={`text-xs font-bold ${
                        member.role === 'Owner' ? 'text-blue-600' : 
                        member.role === 'Admin' ? 'text-amber-600' : 'text-slate-600 dark:text-slate-400'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      member.status === 'Active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 
                      member.status === 'Invited' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-slate-500">
                    {member.lastActive}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => { setSelectedMember(member); setShowEditModal(true); }}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-blue-500 transition-all shadow-sm"
                        title="Edit Member"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => toggleStatus(member.id)}
                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-400 hover:text-amber-500 transition-all shadow-sm"
                        title={member.status === 'Active' ? 'Deactivate' : 'Activate'}
                      >
                        <UserCheck size={16} />
                      </button>
                      {member.role !== 'Owner' && (
                        <button 
                          onClick={() => removeMember(member.id)}
                          className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-slate-400 hover:text-red-500 transition-all shadow-sm"
                          title="Remove Member"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 mb-6 border border-blue-200 shadow-sm">
              <Lock size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Role Permissions</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Customize what each role can see and do within your workspace. Manage granular permissions for campaigns, billing, and leads.</p>
            <button className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              Configure Permissions <ArrowRight size={14} />
            </button>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center text-amber-600 mb-6 border border-amber-200 shadow-sm">
              <Globe size={24} />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white mb-2">Agency Mode</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">Manage client sub-accounts. Grant restricted access to clients to view their own campaign analytics while keeping your settings private.</p>
            <button className="text-xs font-bold text-amber-600 hover:underline flex items-center gap-1">
              Setup Client Portals <ArrowRight size={14} />
            </button>
          </div>
          <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-amber-50 dark:bg-amber-900/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-blue-400 mb-6 border border-white/10">
              <Shield size={24} />
            </div>
            <h3 className="font-bold mb-2">Security Audit</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">Review access logs, track login attempts, and monitor workspace configuration changes for compliance.</p>
            <button className="text-xs font-bold text-blue-400 hover:text-white transition-colors flex items-center gap-1">
              Download Audit Log <ArrowRight size={14} />
            </button>
          </div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-[60px] group-hover:bg-blue-500/20 transition-all duration-700"></div>
        </div>
      </div>

      {/* Invite Member Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                  <UserPlus size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Invite Team Member</h2>
                  <p className="text-sm text-slate-500">Add someone to your organization.</p>
                </div>
              </div>
              <button onClick={() => setShowInviteModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleInvite} className="p-10 space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. John Doe"
                    value={inviteForm.name}
                    onChange={(e) => setInviteForm({ ...inviteForm, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                  <input 
                    required 
                    type="email" 
                    placeholder="john@company.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-medium" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Workspace Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {['Owner', 'Admin', 'Member'].map(role => (
                    <button 
                      key={role}
                      type="button"
                      onClick={() => setInviteForm({ ...inviteForm, role: role as any })}
                      className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                        inviteForm.role === role 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-500/20' 
                        : 'bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-800'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/50 flex items-start gap-3">
                <Info className="text-blue-600 shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-blue-800 dark:text-blue-400 leading-relaxed font-medium">
                  The invited member will receive an email with a unique link to join your workspace. They will have access to campaigns based on their role.
                </p>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl font-bold shadow-xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <UserPlus size={20} />}
                {isSubmitting ? 'Sending Invite...' : 'Send Invitation'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src={`https://picsum.photos/seed/${selectedMember.avatar}/48/48`} 
                  className="w-12 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
                  alt=""
                />
                <div>
                  <h2 className="text-2xl font-bold">{selectedMember.name}</h2>
                  <p className="text-sm text-slate-500">Manage member role and permissions.</p>
                </div>
              </div>
              <button onClick={() => setShowEditModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-slate-400">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-10 space-y-8">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Permissions</h4>
                <div className="space-y-3">
                  {(['Owner', 'Admin', 'Member'] as const).map(role => (
                    <button 
                      key={role}
                      onClick={() => handleUpdateRole(selectedMember.id, role)}
                      className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                        selectedMember.role === role 
                        ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 ring-2 ring-blue-500/10' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 hover:border-blue-500/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${
                          selectedMember.role === role ? 'bg-blue-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'
                        }`}>
                          {role === 'Owner' ? <ShieldCheck size={18} /> : role === 'Admin' ? <Shield size={18} /> : <User size={18} />}
                        </div>
                        <div>
                          <p className="text-sm font-bold">{role}</p>
                          <p className="text-[10px] opacity-70">
                            {role === 'Owner' ? 'Full workspace control' : role === 'Admin' ? 'Management and campaign access' : 'Restricted member access'}
                          </p>
                        </div>
                      </div>
                      {selectedMember.role === role && <Check size={20} className="text-blue-600" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  onClick={() => { toggleStatus(selectedMember.id); setShowEditModal(false); }}
                  className="flex-1 py-4 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl font-bold text-sm transition-all hover:bg-slate-100 active:scale-95"
                >
                  {selectedMember.status === 'Active' ? 'Deactivate Member' : 'Activate Member'}
                </button>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-sm transition-all active:scale-95 shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Team;

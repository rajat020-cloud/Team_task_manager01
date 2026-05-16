import React, { useEffect, useState } from 'react';
import { Mail, Shield, Calendar, Search, X, CheckSquare } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  remarks?: string;
  tasksAssigned?: any[];
}

const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user: currentUser } = useAuth();
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'tasks'>('profile');
  const [remarks, setRemarks] = useState('');

  const fetchTeam = async () => {
    try {
      const response = await api.get('/team');
      setMembers(response.data);
    } catch (error) {
      toast.error('Failed to fetch team members');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  const handleUpdateRemarks = async () => {
    if (!selectedMember) return;
    try {
      await api.put(`/team/${selectedMember.id}/remarks`, { remarks });
      toast.success('Remarks updated successfully');
      fetchTeam();
    } catch (error) {
      toast.error('Failed to update remarks');
    }
  };

  const openModal = (member: TeamMember, tab: 'profile' | 'tasks') => {
    setSelectedMember(member);
    setActiveTab(tab);
    setRemarks(member.remarks || '');
  };

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Team Members</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and view all contributors in your organization.</p>
        </div>
        <div className="relative group">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-600 transition-colors">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Find a teammate..."
            className="pl-12 pr-4 py-3 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all w-72 text-sm font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMembers.map((member, i) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-8 group border border-white/40 hover:border-primary-200 transition-all flex flex-col h-full"
          >
            <div className="flex items-center gap-5 mb-8">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-violet p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[0.9rem] bg-white flex items-center justify-center text-primary-600 font-bold text-2xl">
                  {member.name.charAt(0)}
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{member.name}</h3>
                <div className={`mt-1 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-extrabold uppercase tracking-widest ${
                  member.role === 'Admin' ? 'bg-accent-violet/10 text-accent-violet' : 'bg-primary-50 text-primary-600'
                }`}>
                  <Shield className="w-3 h-3" />
                  {member.role}
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-50 mb-8">
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-700 transition-colors">
                <Mail className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-medium">{member.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-700 transition-colors">
                <Calendar className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-medium">Joined {new Date(member.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <button 
                onClick={() => openModal(member, 'profile')}
                className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Profile
              </button>
              <button 
                onClick={() => openModal(member, 'tasks')}
                className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Tasks
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedMember && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card bg-white w-full max-w-2xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-white/60 max-h-[90vh] flex flex-col"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-violet p-0.5 shadow-md">
                  <div className="w-full h-full rounded-lg bg-white flex items-center justify-center text-primary-600 font-bold text-lg">
                    {selectedMember.name.charAt(0)}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{selectedMember.name}</h2>
                  <p className="text-sm font-medium text-slate-500">{selectedMember.role}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMember(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex px-8 pt-4 gap-6 border-b border-slate-100">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`pb-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'profile' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Profile & Remarks
                {activeTab === 'profile' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></span>}
              </button>
              <button 
                onClick={() => setActiveTab('tasks')}
                className={`pb-4 text-sm font-bold tracking-wide transition-colors relative ${activeTab === 'tasks' ? 'text-primary-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Assigned Tasks
                {activeTab === 'tasks' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-t-full"></span>}
              </button>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              {activeTab === 'profile' ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Email</p>
                      <p className="text-sm font-medium text-slate-900">{selectedMember.email}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Joined Date</p>
                      <p className="text-sm font-medium text-slate-900">{new Date(selectedMember.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="text-sm font-bold text-slate-900 mb-3">Admin Remarks</h3>
                    {currentUser?.role === 'Admin' ? (
                      <div className="space-y-4">
                        <textarea
                          placeholder="Add notes, performance reviews, or remarks about this team member..."
                          className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium h-32 resize-none"
                          value={remarks}
                          onChange={e => setRemarks(e.target.value)}
                        ></textarea>
                        <button onClick={handleUpdateRemarks} className="btn-gradient px-6 py-2.5 text-sm">Save Remarks</button>
                      </div>
                    ) : (
                      <div className="p-5 bg-slate-50 rounded-2xl">
                        <p className="text-sm text-slate-600 italic font-medium">{selectedMember.remarks || "No remarks added yet."}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedMember.tasksAssigned && selectedMember.tasksAssigned.length > 0 ? (
                    selectedMember.tasksAssigned.map((task: any) => (
                      <div key={task.id} className="p-5 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className={`p-2 rounded-xl ${
                            task.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                            task.status === 'InProgress' ? 'bg-blue-50 text-blue-600' : 'bg-slate-100 text-slate-500'
                          }`}>
                            <CheckSquare className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{task.title}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{task.project?.title}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-lg text-[9px] font-extrabold uppercase tracking-widest ${
                            task.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                            task.priority === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-sky-600'
                          }`}>{task.priority}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                            {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : '-'}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No tasks assigned</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Team;

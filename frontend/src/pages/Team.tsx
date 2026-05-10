import React, { useEffect, useState } from 'react';
import { Users, Mail, Shield, Calendar, Search } from 'lucide-react';
import api from '../api/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const Team: React.FC = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
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
            className="glass-card p-8 group border border-white/40 hover:border-primary-200 transition-all"
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

            <div className="space-y-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-700 transition-colors">
                <Mail className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-medium">{member.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 group-hover:text-slate-700 transition-colors">
                <Calendar className="w-4 h-4 text-slate-300" />
                <span className="text-sm font-medium">Joined {new Date(member.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}</span>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">
                Profile
              </button>
              <button className="flex-1 py-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-slate-100 transition-all">
                Tasks
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Team;

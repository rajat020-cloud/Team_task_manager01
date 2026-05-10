import React, { useEffect, useState } from 'react';
import { Plus, MoreVertical, Briefcase, Users, Calendar, Trash2 } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Project {
  id: string;
  title: string;
  description: string;
  members: any[];
  tasks: any[];
  createdAt: string;
  creator: { name: string };
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', memberEmails: '' });
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const emails = newProject.memberEmails.split(',').map(e => e.trim()).filter(e => e !== '');
      await api.post('/projects', { ...newProject, memberEmails: emails });
      toast.success('Project created!');
      setIsModalOpen(false);
      setNewProject({ title: '', description: '', memberEmails: '' });
      fetchProjects();
    } catch (error) {
      toast.error('Failed to create project');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Projects</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage your team's workspace and collaboration units.</p>
        </div>
        {user?.role === 'Admin' && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-gradient flex items-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Launch New Project
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <motion.div 
            key={project.id} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8 group relative flex flex-col h-full border border-white/40"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary-500/10 to-accent-violet/10 text-primary-600 flex items-center justify-center shadow-inner">
                <Briefcase className="w-7 h-7" />
              </div>
              {user?.role === 'Admin' && (
                <button 
                  onClick={() => handleDelete(project.id)}
                  className="p-2.5 text-slate-400 hover:text-rose-500 rounded-xl hover:bg-rose-50 transition-all duration-300"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">{project.title}</h3>
            <p className="text-sm text-slate-500 mb-8 line-clamp-3 font-medium leading-relaxed">{project.description}</p>
            
            <div className="mt-auto space-y-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Users className="w-4 h-4" />
                  <span>{project.members.length} Members</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                <div className="flex -space-x-3">
                  {project.members.slice(0, 3).map((m, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary-600 to-accent-violet p-0.5 border-2 border-white shadow-md">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-[10px] font-bold text-primary-600">
                        {m.name.charAt(0)}
                      </div>
                    </div>
                  ))}
                  {project.members.length > 3 && (
                    <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                      +{project.members.length - 3}
                    </div>
                  )}
                </div>
                <div className="px-3 py-1.5 bg-primary-50 text-primary-600 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                  {project.tasks.length} Active Tasks
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card bg-white w-full max-w-lg p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-white/60"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Project Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Marketing Sprint"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                <textarea
                  placeholder="Describe the project goals and scope..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium h-32 resize-none"
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Invite Team (comma separated emails)</label>
                <input
                  type="text"
                  placeholder="alex@taskflow.com, sara@taskflow.com"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium"
                  value={newProject.memberEmails}
                  onChange={e => setNewProject({...newProject, memberEmails: e.target.value})}
                />
              </div>
              <div className="flex gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 btn-gradient py-4"
                >
                  Launch Project
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Projects;

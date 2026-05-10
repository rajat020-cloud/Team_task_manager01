import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  MoreVertical,
  Calendar,
  Tag
} from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Todo' | 'InProgress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  assignee: { name: string; email: string } | null;
  project: { title: string; id: string };
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    projectId: '',
    assignedTo: '',
    priority: 'Medium',
    status: 'Todo',
    dueDate: ''
  });

  const { user } = useAuth();

  const fetchData = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        api.get('/tasks'),
        api.get('/projects')
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      
      // Extract unique members from projects for task assignment
      const membersMap = new Map();
      projectsRes.data.forEach((p: any) => {
        p.members.forEach((m: any) => membersMap.set(m.id, m));
      });
      setTeamMembers(Array.from(membersMap.values()));
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/tasks', newTask);
      toast.success('Task created!');
      setIsModalOpen(false);
      setNewTask({
        title: '', description: '', projectId: '', assignedTo: '',
        priority: 'Medium', status: 'Todo', dueDate: ''
      });
      fetchData();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      toast.success('Status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { id: 'Todo', label: 'To Do', color: 'bg-slate-400' },
    { id: 'InProgress', label: 'In Progress', color: 'bg-blue-500' },
    { id: 'Completed', label: 'Completed', color: 'bg-emerald-500' },
  ];

  if (loading) return <div className="flex items-center justify-center h-full">Loading...</div>;

  return (
    <div className="space-y-10 max-w-7xl mx-auto py-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Tasks</h1>
          <p className="text-slate-500 mt-1 font-medium">Coordinate, execute, and monitor team activities.</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative group">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-600 transition-colors">
              <Search className="w-5 h-5" />
            </span>
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-12 pr-4 py-3 bg-white/60 border border-white/40 rounded-2xl focus:outline-none focus:bg-white focus:ring-4 focus:ring-primary-500/10 transition-all w-72 text-sm font-medium"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="h-10 w-px bg-slate-200/50 mx-2"></div>
          {user?.role === 'Admin' && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-gradient flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              New Activity
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-8 min-h-[75vh] scrollbar-hide">
        {columns.map(column => (
          <div key={column.id} className="flex-shrink-0 w-[22rem] flex flex-col">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${column.color} shadow-lg shadow-${column.color}/40`} />
                <h3 className="font-extrabold text-slate-800 uppercase text-xs tracking-widest">
                  {column.label} 
                  <span className="ml-3 px-2 py-0.5 bg-slate-200/50 rounded-full text-[10px] text-slate-500">
                    {filteredTasks.filter(t => t.status === column.id).length}
                  </span>
                </h3>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-all">
                <Plus className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5 flex-1 p-2 bg-slate-200/20 rounded-[2.5rem] border border-white/20">
              {filteredTasks
                .filter(t => t.status === column.id)
                .map(task => (
                  <motion.div 
                    key={task.id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6 border border-white/60 cursor-pointer group hover:border-primary-300/50"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`px-3 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest ${
                        task.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                        task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        'bg-sky-50 text-sky-600 border border-sky-100'
                      }`}>
                        {task.priority}
                      </div>
                      <select 
                        className="text-[10px] bg-white/50 border border-transparent rounded-lg focus:ring-0 cursor-pointer font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase px-2 py-1"
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                      >
                        <option value="Todo">Todo</option>
                        <option value="InProgress">Doing</option>
                        <option value="Completed">Done</option>
                      </select>
                    </div>
                    
                    <h4 className="font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">{task.title}</h4>
                    <p className="text-xs text-slate-500 mb-5 line-clamp-2 font-medium leading-relaxed">{task.description}</p>
                    
                    <div className="flex items-center justify-between pt-5 border-t border-slate-50">
                      <div className="flex items-center gap-2 text-slate-400">
                        <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center">
                          <Calendar className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No date'}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-[9px] font-bold text-slate-500 uppercase leading-none mb-0.5">{task.project.title}</p>
                          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter leading-none">PROJECT</p>
                        </div>
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary-600 to-accent-violet p-0.5 shadow-sm group-hover:scale-110 transition-transform">
                          <div className="w-full h-full rounded-[0.5rem] bg-white flex items-center justify-center text-[10px] font-bold text-primary-600">
                            {task.assignee?.name.charAt(0) || '?'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              {filteredTasks.filter(t => t.status === column.id).length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 opacity-20 border-2 border-dashed border-slate-300 rounded-[2rem]">
                  <Tag className="w-10 h-10 mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Empty List</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="glass-card bg-white w-full max-w-lg p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] border border-white/60 max-h-[90vh] overflow-y-auto"
          >
            <h2 className="text-3xl font-bold text-slate-900 mb-8 tracking-tight">Add New Activity</h2>
            <form onSubmit={handleCreate} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Activity Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Design System Review"
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium"
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Instructions / Description</label>
                <textarea
                  placeholder="Detailed breakdown of the task..."
                  className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium h-28 resize-none"
                  value={newTask.description}
                  onChange={e => setNewTask({...newTask, description: e.target.value})}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Parent Project</label>
                  <select
                    required
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium appearance-none"
                    value={newTask.projectId}
                    onChange={e => setNewTask({...newTask, projectId: e.target.value})}
                  >
                    <option value="">Select...</option>
                    {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Assignee</label>
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium appearance-none"
                    value={newTask.assignedTo}
                    onChange={e => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Urgency</label>
                  <select
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium appearance-none"
                    value={newTask.priority}
                    onChange={e => setNewTask({...newTask, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Target Date</label>
                  <input
                    type="date"
                    className="w-full px-5 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-slate-900 font-medium"
                    value={newTask.dueDate}
                    onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  />
                </div>
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
                  Post Activity
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Tasks;

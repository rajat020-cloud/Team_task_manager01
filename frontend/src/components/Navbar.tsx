import React, { useEffect, useState } from 'react';
import { Bell, Search, Check, Circle, Loader2, Briefcase, CheckSquare, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{tasks: any[], projects: any[], team: any[]}>({ tasks: [], projects: [], team: [] });
  const [showSearch, setShowSearch] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Polling every 10s
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setShowSearch(true);
      const executeSearch = async () => {
        setIsSearching(true);
        try {
          const [tasksRes, projectsRes, teamRes] = await Promise.all([
            api.get('/tasks'),
            api.get('/projects'),
            api.get('/team')
          ]);
          
          const q = searchQuery.toLowerCase();
          setSearchResults({
            tasks: tasksRes.data.filter((t: any) => t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))),
            projects: projectsRes.data.filter((p: any) => p.title.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q))),
            team: teamRes.data.filter((m: any) => m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q))
          });
        } catch (error) {
          console.error(error);
        } finally {
          setIsSearching(false);
        }
      };

      const timer = setTimeout(executeSearch, 400);
      return () => clearTimeout(timer);
    } else {
      setShowSearch(false);
      setSearchResults({ tasks: [], projects: [], team: [] });
    }
  }, [searchQuery]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Failed to mark notifications as read');
    }
  };

  const handleNavigate = (path: string) => {
    setShowSearch(false);
    setSearchQuery('');
    navigate(path);
  };

  return (
    <header className="h-20 glass border-b border-white/20 flex items-center justify-between px-10 relative z-10">
      <div className="relative w-[450px]">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
        </span>
        <input
          type="text"
          placeholder="Search for tasks, people or projects..."
          className="block w-full pl-12 pr-4 py-3 bg-white/40 border border-white/40 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:bg-white/80 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 text-sm font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => { if(searchQuery.length >= 2) setShowSearch(true); }}
        />

        <AnimatePresence>
          {showSearch && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-0 mt-3 w-[500px] glass-card bg-white/95 p-0 overflow-hidden shadow-2xl border border-slate-100 z-50 max-h-96 overflow-y-auto"
            >
              <div className="p-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Global Search Results</h3>
              </div>

              {!isSearching && searchResults.tasks.length === 0 && searchResults.projects.length === 0 && searchResults.team.length === 0 && (
                <div className="p-6 text-center text-sm font-medium text-slate-500">
                  No matches found for "{searchQuery}"
                </div>
              )}

              {searchResults.projects.length > 0 && (
                <div className="py-2">
                  <h4 className="px-5 py-2 text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50/50">Projects</h4>
                  {searchResults.projects.map(p => (
                    <div key={p.id} onClick={() => handleNavigate('/projects')} className="px-5 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors">
                      <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600"><Briefcase className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{p.title}</p>
                        <p className="text-xs text-slate-500 truncate max-w-sm">{p.description || 'No description'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.tasks.length > 0 && (
                <div className="py-2">
                  <h4 className="px-5 py-2 text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50/50">Tasks</h4>
                  {searchResults.tasks.map(t => (
                    <div key={t.id} onClick={() => handleNavigate('/tasks')} className="px-5 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><CheckSquare className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{t.title}</p>
                        <p className="text-xs text-slate-500">Status: {t.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {searchResults.team.length > 0 && (
                <div className="py-2">
                  <h4 className="px-5 py-2 text-[10px] font-bold text-primary-600 uppercase tracking-widest bg-primary-50/50">Team Members</h4>
                  {searchResults.team.map(m => (
                    <div key={m.id} onClick={() => handleNavigate('/team')} className="px-5 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3 border-b border-slate-50 last:border-0 transition-colors">
                      <div className="p-2 rounded-lg bg-amber-50 text-amber-600"><UserIcon className="w-4 h-4" /></div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-6 relative">
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative group"
          >
            <Bell className="w-6 h-6" />
            {unreadCount > 0 && (
              <span className="absolute top-2.5 right-2.5 block h-2.5 w-2.5 rounded-full bg-accent-rose ring-2 ring-white animate-pulse"></span>
            )}
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-3 w-80 glass-card bg-white/90 p-0 overflow-hidden shadow-2xl border border-slate-100 z-50"
              >
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs font-bold text-primary-600 hover:text-primary-700">
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(n => (
                      <div key={n.id} className={`p-4 border-b border-slate-50 flex gap-3 ${!n.isRead ? 'bg-primary-50/30' : ''}`}>
                        <div className="mt-1">
                          {!n.isRead ? <Circle className="w-2.5 h-2.5 fill-primary-500 text-primary-500" /> : <Check className="w-3 h-3 text-slate-300" />}
                        </div>
                        <div>
                          <p className={`text-sm ${!n.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{n.message}</p>
                          <p className="text-[10px] text-slate-400 mt-1 font-bold tracking-wider uppercase">
                            {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-6 text-center text-sm font-medium text-slate-500">
                      No notifications yet.
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-8 w-px bg-slate-200/50"></div>

        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{user?.name}</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{user?.role}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-violet p-0.5 shadow-lg group-hover:scale-105 transition-transform duration-300">
            <div className="w-full h-full rounded-[0.9rem] bg-white flex items-center justify-center text-primary-600 font-bold text-lg">
              {user?.name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

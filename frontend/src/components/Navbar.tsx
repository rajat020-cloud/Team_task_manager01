import React, { useEffect, useState } from 'react';
import { Bell, Search, Check, Loader2, Briefcase, CheckSquare, User as UserIcon, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{tasks: any[], projects: any[], team: any[]}>({ tasks: [], projects: [], team: [] });
  const [showSearch, setShowSearch] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      setNotifications(res.data);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      setShowSearch(true);
      const executeSearch = async () => {
        setIsSearching(true);
        try {
          const [tasksRes, projectsRes, teamRes] = await Promise.all([
            api.get('/tasks'), api.get('/projects'), api.get('/team')
          ]);
          const q = searchQuery.toLowerCase();
          setSearchResults({
            tasks: tasksRes.data.filter((t: any) => t.title.toLowerCase().includes(q)),
            projects: projectsRes.data.filter((p: any) => p.title.toLowerCase().includes(q)),
            team: teamRes.data.filter((m: any) => m.name.toLowerCase().includes(q))
          });
        } catch {} finally { setIsSearching(false); }
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
    } catch {}
  };

  const handleNavigate = (path: string) => {
    setShowSearch(false); setSearchQuery(''); navigate(path);
  };

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <header className="h-16 glass border-b border-slate-200/60 flex items-center justify-between px-4 md:px-6 relative z-10">
      {/* Search */}
      <div className="relative w-full max-w-xl">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 pointer-events-none">
          {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </span>
        <input
          type="text"
          placeholder="Search tasks, projects, people..."
          className="block w-full pl-10 pr-8 py-2.5 bg-slate-100/80 border border-transparent rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-200 focus:ring-2 focus:ring-blue-500/10 transition-all duration-200 text-slate-700 font-medium"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => { if (searchQuery.length >= 2) setShowSearch(true); }}
        />
        {searchQuery && (
          <button aria-label="Clear search" onClick={() => { setSearchQuery(''); setShowSearch(false); }} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600">
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        <AnimatePresence>
          {showSearch && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 top-full mt-2 w-[400px] bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50"
            >
              <div className="px-4 py-2.5 border-b border-slate-50 bg-slate-50/80">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Search Results</p>
              </div>
              {!isSearching && searchResults.tasks.length === 0 && searchResults.projects.length === 0 && searchResults.team.length === 0 && (
                <div className="p-8 text-center text-sm text-slate-400">No results for "{searchQuery}"</div>
              )}
              {searchResults.projects.length > 0 && (
                <div className="pb-2">
                  <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Projects</p>
                  {searchResults.projects.slice(0, 3).map(p => (
                    <div key={p.id} onClick={() => handleNavigate('/projects')} className="px-4 py-2 hover:bg-blue-50/50 cursor-pointer flex items-center gap-3 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0"><Briefcase className="w-3.5 h-3.5 text-violet-600" /></div>
                      <div><p className="text-sm font-semibold text-slate-700">{p.title}</p></div>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.tasks.length > 0 && (
                <div className="pb-2">
                  <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest">Tasks</p>
                  {searchResults.tasks.slice(0, 3).map(t => (
                    <div key={t.id} onClick={() => handleNavigate('/tasks')} className="px-4 py-2 hover:bg-blue-50/50 cursor-pointer flex items-center gap-3 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0"><CheckSquare className="w-3.5 h-3.5 text-emerald-600" /></div>
                      <div><p className="text-sm font-semibold text-slate-700">{t.title}</p></div>
                    </div>
                  ))}
                </div>
              )}
              {searchResults.team.length > 0 && (
                <div className="pb-2">
                  <p className="px-4 pt-2 pb-1 text-[10px] font-bold text-blue-600 uppercase tracking-widest">People</p>
                  {searchResults.team.slice(0, 3).map(m => (
                    <div key={m.id} onClick={() => handleNavigate('/team')} className="px-4 py-2 hover:bg-blue-50/50 cursor-pointer flex items-center gap-3 transition-colors">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0"><UserIcon className="w-3.5 h-3.5 text-orange-500" /></div>
                      <div><p className="text-sm font-semibold text-slate-700">{m.name}</p></div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100/80 text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
          >
            <Bell style={{width: '17px', height: '17px'}} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          <AnimatePresence>
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.96 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-2xl shadow-slate-200/80 border border-slate-100 overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 text-sm">Notifications {unreadCount > 0 && <span className="ml-1.5 text-xs font-normal text-slate-400">({unreadCount} new)</span>}</h3>
                  {unreadCount > 0 && (
                    <button onClick={markAllAsRead} className="text-xs font-semibold text-blue-600 hover:text-blue-700 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors">
                      Mark read
                    </button>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length > 0 ? notifications.map(n => (
                    <div key={n.id} className={`px-4 py-3 flex gap-3 hover:bg-slate-50 transition-colors ${!n.isRead ? 'bg-blue-50/40' : ''}`}>
                      <div className="mt-1.5 flex-shrink-0">
                        {!n.isRead ? <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> : <Check className="w-3 h-3 text-slate-300" />}
                      </div>
                      <div>
                        <p className={`text-sm leading-snug ${!n.isRead ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="px-4 py-8 text-center text-sm text-slate-400">No notifications yet.</div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="w-px h-6 bg-slate-200" />

        {/* User */}
        <div className="flex items-center gap-2.5 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800 leading-tight">{user?.name}</p>
            <p className="text-[10px] text-slate-400 font-medium">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white ring-2 ring-blue-100 group-hover:ring-blue-300 transition-all bg-gradient-to-br from-blue-500 to-violet-500">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
};

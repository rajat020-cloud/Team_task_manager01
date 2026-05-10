import React from 'react';
import { Bell, Search, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 glass border-b border-white/20 flex items-center justify-between px-10 relative z-10">
      <div className="relative w-[450px]">
        <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
          <Search className="w-5 h-5" />
        </span>
        <input
          type="text"
          placeholder="Search for tasks, people or projects..."
          className="block w-full pl-12 pr-4 py-3 bg-white/40 border border-white/40 rounded-2xl leading-5 placeholder-slate-400 focus:outline-none focus:bg-white/80 focus:ring-2 focus:ring-primary-500/20 transition-all duration-300 text-sm font-medium"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="p-2.5 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all relative group">
          <Bell className="w-6 h-6" />
          <span className="absolute top-2.5 right-2.5 block h-2.5 w-2.5 rounded-full bg-accent-rose ring-2 ring-white animate-pulse"></span>
        </button>
        
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

import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
    { icon: Users, label: 'Team', path: '/team' },
  ];

  if (user?.role === 'Admin') {
    // Admin specific items could go here
  }

  return (
    <div className="w-72 glass border-r border-white/20 flex flex-col h-full relative z-10">
      <div className="p-8">
        <h1 className="text-3xl font-bold tracking-tight text-gradient flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-accent-violet flex items-center justify-center text-white shadow-lg shadow-primary-200">
            <CheckSquare className="w-6 h-6" />
          </div>
          TaskFlow
        </h1>
      </div>

      <nav className="flex-1 px-6 space-y-2 mt-4">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group ${
                isActive 
                  ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-lg shadow-primary-200' 
                  : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
              }`
            }
          >
            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110`} />
            <span className="font-semibold text-[0.95rem]">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-6 mt-auto">
        <div className="glass-card p-5 bg-gradient-to-br from-white/80 to-primary-50/50 mb-6">
          <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">Current User</p>
          <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
          <p className="text-[10px] text-slate-500 uppercase font-medium">{user?.role}</p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-4 w-full px-6 py-4 text-slate-500 hover:bg-rose-50 hover:text-rose-600 rounded-2xl transition-all duration-300 font-bold group"
        >
          <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};

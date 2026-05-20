import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Briefcase, CheckSquare, Users, LogOut, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', color: 'from-blue-500 to-cyan-500' },
    { icon: Briefcase, label: 'Projects', path: '/projects', color: 'from-violet-500 to-purple-500' },
    { icon: CheckSquare, label: 'Tasks', path: '/tasks', color: 'from-emerald-500 to-teal-500' },
    { icon: Users, label: 'Team', path: '/team', color: 'from-orange-500 to-amber-500' },
  ];

  const initials = user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'U';

  return (
    <div className="w-72 lg:w-64 flex flex-col h-full relative bg-slate-950/95 backdrop-blur-xl border-r border-slate-900/80">
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full opacity-10 bg-[radial-gradient(circle,_#3b82f6,_transparent)]" />
        <div className="absolute bottom-20 -right-10 w-48 h-48 rounded-full opacity-10 bg-[radial-gradient(circle,_#8b5cf6,_transparent)]" />
      </div>

      {/* Logo */}
      <div className="relative z-10 px-6 py-7 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-violet-500">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg tracking-tight">TaskFlow</h1>
            <p className="text-blue-400/60 text-[10px] font-medium uppercase tracking-widest">Pro</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex-1 px-3 py-5 space-y-1">
        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest px-3 mb-3">Main Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${isActive ? `bg-gradient-to-br ${item.color} shadow-md` : 'bg-white/5 group-hover:bg-white/10'}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User Card */}
      <div className="relative z-10 px-3 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/5 mb-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0 bg-gradient-to-br from-blue-500 to-violet-500">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-slate-400 text-[10px] font-medium">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-200 font-medium text-sm group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-red-500/10 transition-all">
            <LogOut className="w-4 h-4" />
          </div>
          Sign Out
        </button>
      </div>
    </div>
  );
};

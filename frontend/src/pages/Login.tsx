import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Mail, Lock, ArrowRight } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.user);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/login_background_abstract_1778431247836.png" 
          alt="background" 
          className="w-full h-full object-cover scale-105 animate-pulse-slow"
        />
        <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1000px] w-full glass rounded-[3rem] overflow-hidden flex shadow-2xl relative z-10 border border-white/20"
      >
        {/* Left Side: Branding/Visual */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary-600/20 to-accent-violet/20 p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary-600 mb-8 shadow-xl">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Master your <br /> 
              <span className="text-primary-200">workflow</span> with <br />
              TaskFlow.
            </h1>
            <p className="text-primary-100/80 mt-6 text-lg max-w-sm">
              The world's most intuitive platform for team collaboration and task management.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-4">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-bold">
              #1 Productivity Tool
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-bold">
              Trusted by 10k+ Teams
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 bg-white p-12 md:p-16">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="text-slate-500 mt-2">Enter your details to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all duration-300 text-slate-900 font-medium"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all duration-300 text-slate-900 font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-4 flex items-center justify-center gap-3 group"
            >
              {loading ? 'Verifying...' : (
                <>
                  <span className="text-lg">Sign In to Dashboard</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium">
              New to TaskFlow?{' '}
              <Link to="/signup" className="text-primary-600 font-bold hover:text-accent-violet transition-colors underline underline-offset-4 decoration-primary-200 hover:decoration-accent-violet">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;

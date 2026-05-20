import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CheckSquare, Mail, Lock, User, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const Signup: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Member' as 'Admin' | 'Member'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post('/auth/signup', formData);
      login(response.data.token, response.data.user);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-6 overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(96,165,250,0.22),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(139,92,246,0.18),transparent_18%)]" />
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm" />

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-[1000px] w-full glass rounded-[3rem] overflow-hidden flex shadow-2xl relative z-10 border border-white/20"
      >
        {/* Left Side: Branding/Visual */}
        <div className="hidden lg:flex flex-1 bg-gradient-to-br from-accent-violet/20 to-primary-600/20 p-12 flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-accent-violet mb-8 shadow-xl">
              <CheckSquare className="w-8 h-8" />
            </div>
            <h1 className="text-5xl font-bold text-white leading-tight">
              Start your <br /> 
              <span className="text-accent-rose">journey</span> with <br />
              TaskFlow.
            </h1>
            <p className="text-primary-100/80 mt-6 text-lg max-w-sm">
              Join thousands of teams already optimizing their productivity with our cutting-edge tools.
            </p>
          </div>
          
          <div className="relative z-10 flex gap-4">
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-bold">
              Free 14-day trial
            </div>
            <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10 text-white text-xs font-bold">
              No credit card required
            </div>
          </div>

          {/* Decorative Circle */}
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent-violet/20 rounded-full blur-3xl"></div>
        </div>

        {/* Right Side: Form */}
        <div className="flex-1 bg-white p-10 md:p-14 overflow-y-auto max-h-[90vh]">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Create Account</h2>
            <p className="text-slate-500 mt-2">Join TaskFlow and scale your team's output</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <User className="w-5 h-5" />
                </span>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all duration-300 text-slate-900 font-medium"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Mail className="w-5 h-5" />
                </span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all duration-300 text-slate-900 font-medium"
                  placeholder="name@company.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <Lock className="w-5 h-5" />
                </span>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all duration-300 text-slate-900 font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 ml-1">Account Role</label>
              <div className="relative group">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 group-focus-within:text-primary-500 transition-colors">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <select
                  aria-label="Account Role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Member' })}
                  className="block w-full pl-12 pr-4 py-3.5 bg-slate-50 border-2 border-transparent rounded-2xl focus:outline-none focus:bg-white focus:border-primary-500 transition-all duration-300 text-slate-900 font-medium appearance-none"
                >
                  <option value="Member">Team Member (Collaborator)</option>
                  <option value="Admin">Team Admin (Manager)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-gradient py-4 flex items-center justify-center gap-3 group mt-4"
            >
              {loading ? 'Creating Account...' : (
                <>
                  <span className="text-lg">Create Your Account</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="text-primary-600 font-bold hover:text-accent-violet transition-colors underline underline-offset-4 decoration-primary-200 hover:decoration-accent-violet">
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;

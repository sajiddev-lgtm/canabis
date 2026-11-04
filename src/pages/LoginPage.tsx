/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, registerUser, navigateTo, currentUser } = useApp();

  const [mode, setMode] = useState<'login' | 'register' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 text-[#07543F] dark:text-emerald-300 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-[#063E30] dark:text-white">
          Welcome back, {currentUser.name}!
        </h2>
        <p className="text-xs text-[#68756F] dark:text-emerald-200/80">
          You are currently signed in as a verified {currentUser.role}.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => navigateTo('dashboard')}
            className="py-2.5 px-5 rounded-xl bg-[#07543F] text-white text-xs font-bold"
          >
            Go to Member Profile
          </button>
          {['super_admin', 'admin'].includes(currentUser.role) && (
            <button
              onClick={() => navigateTo('admin')}
              className="py-2.5 px-5 rounded-xl bg-[#F28A19] text-white text-xs font-bold"
            >
              Go to Admin Panel
            </button>
          )}
        </div>
      </div>
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      if (email.includes('admin')) {
        navigateTo('admin');
      } else {
        navigateTo('dashboard');
      }
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const result = await registerUser({ name, email, password });
    setLoading(false);

    if (result.success) {
      navigateTo('dashboard');
    } else {
      setErrorMsg(result.error || 'Registration failed');
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, resetCode, newPassword }),
      });
      const data = await res.json();
      setLoading(false);
      if (res.ok) {
        setSuccessMsg(data.message || 'Password has been reset successfully. Please log in.');
        setMode('login');
      } else {
        setErrorMsg(data.error || 'Password reset failed');
      }
    } catch {
      setLoading(false);
      setErrorMsg('Failed to reach password reset endpoint');
    }
  };

  const fillAdminCredentials = () => {
    setEmail('admin@canabishub.de');
    setPassword('Admin@2026!');
  };

  const fillMemberCredentials = () => {
    setEmail('user@canabishub.de');
    setPassword('User@2026!');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="p-8 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xl space-y-6">
        {/* Brand Icon */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#07543F] to-[#063E30] text-[#F28A19] mx-auto flex items-center justify-center shadow-md">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-[#063E30] dark:text-white font-['Outfit']">
            {mode === 'login' && 'Sign In to Canabis Hub'}
            {mode === 'register' && 'Create Verified Member Account'}
            {mode === 'reset' && 'Reset Account Password'}
          </h2>
          <p className="text-xs text-[#68756F] dark:text-emerald-200/70">
            {mode === 'login' && 'Access certified monographs, saved cultivars, and administrator tools.'}
            {mode === 'register' && 'Join Germany’s leading verified cannabis monograph community.'}
            {mode === 'reset' && 'Enter your registered email and administrative authorization code.'}
          </p>
        </div>

        {/* Quick Demo Credentials Assistant */}
        {mode === 'login' && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
            <span className="font-bold text-[#07543F] dark:text-[#F28A19] block text-[11px] uppercase tracking-wider">
              Quick Test Credentials:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={fillAdminCredentials}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 font-bold text-[11px] text-[#07543F] dark:text-emerald-200 hover:border-[#07543F]"
              >
                Fill Super Admin
              </button>
              <button
                type="button"
                onClick={fillMemberCredentials}
                className="flex-1 py-1.5 px-2 rounded-lg bg-white dark:bg-emerald-900 border border-emerald-300 dark:border-emerald-700 font-bold text-[11px] text-[#07543F] dark:text-emerald-200 hover:border-[#07543F]"
              >
                Fill Member User
              </button>
            </div>
          </div>
        )}

        {/* Alerts */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Login Form */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#263A36] dark:text-emerald-100">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                  placeholder="admin@canabishub.de"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[#263A36] dark:text-emerald-100">Password</label>
                <button
                  type="button"
                  onClick={() => setMode('reset')}
                  className="text-[11px] text-[#07543F] dark:text-[#F28A19] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-[#68756F] dark:text-emerald-200/70">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="font-bold text-[#07543F] dark:text-[#F28A19] hover:underline"
              >
                Register Here
              </button>
            </div>
          </form>
        )}

        {/* Register Form */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#263A36] dark:text-emerald-100">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                  placeholder="e.g. Maximilian Weber"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#263A36] dark:text-emerald-100">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                  placeholder="user@domain.de"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#263A36] dark:text-emerald-100">Password (Min 8 Characters)</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2 text-[#68756F] dark:text-emerald-200/70">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#07543F] dark:text-[#F28A19] hover:underline"
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* Reset Password Form */}
        {mode === 'reset' && (
          <form onSubmit={handleResetSubmit} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-[#263A36] dark:text-emerald-100">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                placeholder="admin@canabishub.de"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between">
                <label className="font-bold text-[#263A36] dark:text-emerald-100">Admin Authorization Code</label>
                <span className="text-[10px] text-slate-500">Default: CANABIS-ADMIN-2026</span>
              </div>
              <input
                type="text"
                required
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40 font-mono"
                placeholder="CANABIS-ADMIN-2026"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#263A36] dark:text-emerald-100">New Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white font-bold transition-all shadow-md"
            >
              <span>{loading ? 'Resetting Password...' : 'Reset Password'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="font-bold text-[#07543F] dark:text-[#F28A19] hover:underline"
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

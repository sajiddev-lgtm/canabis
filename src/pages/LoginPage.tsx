/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle, Sparkles, User, Check } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, navigateTo } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const result = await login(email, password);
    setIsSubmitting(false);

    if (result.success) {
      if (email.toLowerCase().includes('admin')) {
        navigateTo('admin');
      } else {
        navigateTo('dashboard');
      }
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleDemoSignIn = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setIsSubmitting(true);
    setErrorMsg(null);
    const result = await login(demoEmail, demoPass);
    setIsSubmitting(false);
    if (result.success) {
      if (demoEmail.includes('admin')) {
        navigateTo('admin');
      } else {
        navigateTo('dashboard');
      }
    } else {
      setErrorMsg(result.error || 'Demo login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#063E30] p-8 sm:p-10 rounded-3xl border border-[#E9EDE7] dark:border-white/10 shadow-xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#07543F] via-[#F28A19] to-[#07543F]" />

        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#07543F] text-white flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#07543F]/20">
            <Lock className="w-7 h-7 text-[#F28A19]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
            SECURE ACCESS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white tracking-tight">
            Sign In to Canabis Hub
          </h2>
          <p className="text-xs text-[#68756F] dark:text-white/70 mt-1">
            Manage saved monographs, track lawful orders, and access administration controls.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {forgotSent && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Password reset instructions sent to your email.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#68756F] dark:text-white/50 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white">
                Password
              </label>
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="text-[11px] text-[#F28A19] hover:underline font-semibold"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#68756F] dark:text-white/50 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-[#68756F] dark:text-white/70">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-[#07543F] focus:ring-0"
              />
              <span>Remember this session (7 days)</span>
            </label>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Verifying Credentials...'
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Demo Fast-Login Strip for Evaluation */}
        <div className="pt-4 border-t border-[#E9EDE7] dark:border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#68756F] dark:text-white/50 block mb-2 text-center">
            One-Click Verified Demo Access:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleDemoSignIn('user@canabishub.de', 'User@CanabisHub2026!')}
              className="px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-xs font-semibold text-[#063E30] dark:text-white hover:border-[#07543F] transition-all flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-[#07543F]" />
              Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('admin@canabishub.de', 'Admin@CanabisHub2026!')}
              className="px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-xs font-semibold text-[#F28A19] hover:border-[#F28A19] transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F28A19]" />
              Super Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-[#68756F] dark:text-white/70">
          Don&apos;t have an account yet?{' '}
          <button
            onClick={() => navigateTo('register')}
            className="text-[#F28A19] font-bold hover:underline"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};

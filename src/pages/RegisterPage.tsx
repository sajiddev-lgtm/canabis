/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, User, Lock, Mail, ArrowRight, CheckCircle2, AlertCircle, Phone, MapPin } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerUser, navigateTo, currentUser } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsConfirmed, setTermsConfirmed] = useState(false);

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
          Already Registered
        </h2>
        <p className="text-xs text-[#68756F] dark:text-emerald-200/80">
          You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.email}).
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => navigateTo('dashboard')}
            className="py-2.5 px-5 rounded-xl bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30]"
          >
            Go to Account Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !email.trim() || !password.trim()) {
      setErrorMsg('Please complete all required fields (Name, Email, Password).');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    if (!ageConfirmed) {
      setErrorMsg('You must certify that you are at least 18 years of age under German CanG regulations.');
      return;
    }

    if (!termsConfirmed) {
      setErrorMsg('Please agree to the Terms of Service and Privacy Policy.');
      return;
    }

    setLoading(true);
    const result = await registerUser({
      name: name.trim(),
      email: email.trim(),
      password,
      phone: phone.trim() || undefined,
      address: address.trim() || undefined,
    });
    setLoading(false);

    if (result.success) {
      setSuccessMsg('Account created successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigateTo('dashboard');
      }, 1200);
    } else {
      setErrorMsg(result.error || 'Registration failed. An account with this email may already exist.');
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-12">
      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 text-[#07543F] dark:text-[#F28A19] mx-auto flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white font-['Outfit']">
            Create Member Account
          </h1>
          <p className="text-xs text-[#68756F] dark:text-emerald-200/80">
            Join Canabis Hub Germany to save monographs, curate your personal wishlist, and access accredited lab COAs.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#063E30] dark:text-white uppercase tracking-wider mb-1">
              Full Legal Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Johannes Schmidt"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-emerald-950/60 border border-[#E9EDE7] dark:border-emerald-800 text-[#263A36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#07543F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#063E30] dark:text-white uppercase tracking-wider mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.de"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-emerald-950/60 border border-[#E9EDE7] dark:border-emerald-800 text-[#263A36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#07543F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#063E30] dark:text-white uppercase tracking-wider mb-1">
                Password * (min 8 chars)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-emerald-950/60 border border-[#E9EDE7] dark:border-emerald-800 text-[#263A36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#07543F]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#063E30] dark:text-white uppercase tracking-wider mb-1">
                Phone (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+49 170 1234567"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-emerald-950/60 border border-[#E9EDE7] dark:border-emerald-800 text-[#263A36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#07543F]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#063E30] dark:text-white uppercase tracking-wider mb-1">
              Residential Address (Optional)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, City, Postal Code"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-emerald-950/60 border border-[#E9EDE7] dark:border-emerald-800 text-[#263A36] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#07543F]"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="flex items-start gap-2 text-xs text-[#263A36] dark:text-emerald-100 cursor-pointer">
              <input
                type="checkbox"
                checked={ageConfirmed}
                onChange={(e) => setAgeConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-[#07543F] focus:ring-[#07543F]"
              />
              <span>
                I certify that I am at least 18 years old and legally permitted to access educational cannabis data under German law (CanG).
              </span>
            </label>

            <label className="flex items-start gap-2 text-xs text-[#263A36] dark:text-emerald-100 cursor-pointer">
              <input
                type="checkbox"
                checked={termsConfirmed}
                onChange={(e) => setTermsConfirmed(e.target.checked)}
                className="mt-0.5 rounded text-[#07543F] focus:ring-[#07543F]"
              />
              <span>
                I accept the <button type="button" onClick={() => navigateTo('terms')} className="text-[#F28A19] underline">Terms of Service</button> and <button type="button" onClick={() => navigateTo('privacy')} className="text-[#F28A19] underline">Privacy Policy</button>.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 mt-4"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-[#E9EDE7] dark:border-emerald-800 text-center">
          <p className="text-xs text-[#68756F] dark:text-emerald-200/80">
            Already have an account?{' '}
            <button
              onClick={() => navigateTo('login')}
              className="text-[#07543F] dark:text-[#F28A19] font-bold hover:underline"
            >
              Sign In here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, User, Phone, MapPin, ArrowRight, ShieldCheck, AlertCircle, Check } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { registerUser, navigateTo } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Password strength calculation
  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score; // 0 to 4
  };

  const strength = getPasswordStrength(password);
  const strengthLabels = ['Too Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-rose-500', 'bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-600'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (strength < 2) {
      setErrorMsg('Please choose a stronger password (at least 8 chars with uppercase and numbers).');
      return;
    }
    if (!acceptTerms) {
      setErrorMsg('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const res = await registerUser({
      name,
      email,
      password,
      phone,
      address,
    });

    setIsSubmitting(false);

    if (res.success) {
      navigateTo('dashboard');
    } else {
      setErrorMsg(res.error || 'Registration failed.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-lg w-full space-y-6 bg-white dark:bg-[#063E30] p-8 sm:p-10 rounded-3xl border border-[#E9EDE7] dark:border-white/10 shadow-xl relative overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#07543F] via-[#F28A19] to-[#07543F]" />

        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#07543F] text-white flex items-center justify-center mx-auto mb-3 shadow-lg shadow-[#07543F]/20">
            <User className="w-7 h-7 text-[#F28A19]" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
            NEW MEMBER ACCOUNT
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white tracking-tight">
            Create Your Account
          </h2>
          <p className="text-xs text-[#68756F] dark:text-white/70 mt-1">
            Access personalized monographs, save European brand cultivars, and order permitted botanical accessories.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
              Full Legal Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#68756F] dark:text-white/50 absolute left-3.5 top-3" />
              <input
                type="text"
                required
                placeholder="e.g. Maximilian Schmidt"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#68756F] dark:text-white/50 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@organization.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#68756F] dark:text-white/50 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="At least 8 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#68756F] dark:text-white/50 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="Repeat password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                />
              </div>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#68756F] dark:text-white/60">Strength:</span>
                <span className="font-bold text-[#063E30] dark:text-white">
                  {strengthLabels[strength]}
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-100 dark:bg-white/10 rounded-full overflow-hidden flex gap-1">
                {[0, 1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-full flex-1 transition-all ${
                      strength > step ? strengthColors[strength] : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#68756F] dark:text-white/50 absolute left-3.5 top-3" />
                <input
                  type="tel"
                  placeholder="+49 170 1234567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                City / Region
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-[#68756F] dark:text-white/50 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Berlin"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                />
              </div>
            </div>
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer pt-2 text-[#68756F] dark:text-white/70">
            <input
              type="checkbox"
              required
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="mt-0.5 rounded text-[#07543F] focus:ring-0"
            />
            <span>
              I am at least 18 years old and agree to the{' '}
              <button
                type="button"
                onClick={() => navigateTo('terms')}
                className="text-[#07543F] dark:text-emerald-400 font-bold hover:underline"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => navigateTo('privacy')}
                className="text-[#07543F] dark:text-emerald-400 font-bold hover:underline"
              >
                Privacy Policy (DSGVO)
              </button>
              .
            </span>
          </label>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                'Registering Account...'
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <div className="text-center text-xs text-[#68756F] dark:text-white/70">
          Already registered?{' '}
          <button
            onClick={() => navigateTo('login')}
            className="text-[#F28A19] font-bold hover:underline"
          >
            Sign in here
          </button>
        </div>
      </div>
    </div>
  );
};

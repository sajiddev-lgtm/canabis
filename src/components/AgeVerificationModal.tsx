/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, CheckCircle, AlertTriangle, X } from 'lucide-react';

export const AgeVerificationModal: React.FC = () => {
  const { isAgeModalOpen, verifyAge, denyAge, isAgeVerified } = useApp();
  const [birthYear, setBirthYear] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAgeModalOpen) return null;

  const handleConfirmAge = () => {
    if (birthYear) {
      const year = parseInt(birthYear, 10);
      const currentYear = new Date().getFullYear();
      if (isNaN(year) || year < 1920 || year > currentYear) {
        setErrorMsg('Please enter a valid four-digit birth year.');
        return;
      }
      if (currentYear - year < 18) {
        setErrorMsg('You must be at least 18 years of age to access this platform.');
        return;
      }
    }
    verifyAge();
  };

  const handleExit = () => {
    denyAge();
    window.location.href = 'https://www.google.com';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-[#073B2E] rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[#E9EDE7] dark:border-white/10 text-center relative overflow-hidden transition-colors">
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#07543F] via-[#F28A19] to-[#07543F]" />

        {isAgeVerified && (
          <button
            onClick={() => useApp().setIsAgeModalOpen(false)}
            className="absolute top-4 right-4 text-[#68756F] dark:text-gray-300 hover:text-[#263A36] dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-[#07543F] dark:bg-emerald-900/60 text-white flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[#07543F]/20 border border-white/10">
          <ShieldAlert className="w-9 h-9 text-[#F28A19]" />
        </div>

        <div className="flex items-center justify-center gap-1.5 mb-2">
          <span className="font-extrabold text-2xl tracking-tight text-[#063E30] dark:text-white">
            CANABIS<span className="text-[#F28A19] ml-1">HUB</span>
          </span>
        </div>

        <h3 className="text-xl font-bold text-[#263A36] dark:text-white mb-2">
          Age Verification Required (18+)
        </h3>

        <p className="text-sm text-[#68756F] dark:text-gray-300 leading-relaxed mb-6">
          Under the German Cannabis Act (CanG) and federal youth protection regulations, the informational resources, brand profiles, and analytical test data on this platform are intended solely for adults aged 18 and older.
        </p>

        {/* Optional birth year verification */}
        <div className="mb-6 bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 rounded-2xl p-4 text-left">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
            Confirm Your Birth Year (Optional Verification)
          </label>
          <input
            type="number"
            placeholder="e.g. 1998"
            value={birthYear}
            onChange={(e) => {
              setBirthYear(e.target.value);
              setErrorMsg(null);
            }}
            className="w-full px-3.5 py-2.5 bg-white dark:bg-[#073B2E]/50 border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F] dark:focus:border-emerald-400 placeholder:text-gray-400"
          />
          {errorMsg && (
            <p className="mt-2 text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {errorMsg}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <button
            onClick={handleConfirmAge}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#F28A19] hover:bg-[#e07c12] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            I am 18 or Older — Enter
          </button>

          <button
            onClick={handleExit}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white dark:bg-[#041F18] hover:bg-[#F4F6F2] dark:hover:bg-[#073B2E] text-[#68756F] dark:text-gray-200 border border-[#E9EDE7] dark:border-white/10 font-semibold text-sm transition-all"
          >
            I am Under 18 — Exit
          </button>
        </div>

        {/* Legal Disclaimer */}
        <p className="text-[11px] text-[#68756F]/80 dark:text-gray-400 leading-normal border-t border-[#E9EDE7] dark:border-white/10 pt-4">
          By clicking &ldquo;Enter&rdquo;, you confirm that you are at least 18 years old and agree to our Terms of Service and Privacy Policy. This verification is stored locally on your device.
        </p>
      </div>
    </div>
  );
};

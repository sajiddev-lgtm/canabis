/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, AlertCircle, Check, X } from 'lucide-react';

export const AgeVerificationModal: React.FC = () => {
  const { isAgeVerified, verifyAge } = useApp();

  if (isAgeVerified) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[#FFFDF8] dark:bg-[#063E30] border border-[#E9EDE7] dark:border-emerald-800 rounded-3xl max-w-lg w-full p-8 shadow-2xl text-center relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#F28A19]/20 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-[#07543F]/30 rounded-full blur-2xl pointer-events-none"></div>

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#07543F] to-[#063E30] text-[#F28A19] mx-auto flex items-center justify-center mb-6 shadow-lg border border-emerald-500/20">
          <ShieldCheck className="w-9 h-9" />
        </div>

        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#F28A19] px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 inline-block mb-3">
          German Law (CanG) Compliance
        </span>

        <h3 className="text-2xl font-extrabold text-[#063E30] dark:text-white font-['Outfit']">
          Age Verification Required
        </h3>

        <p className="text-sm text-[#68756F] dark:text-emerald-200/80 mt-3 leading-relaxed">
          In accordance with the German Federal Cannabis Act (Cannabisgesetz – CanG), access to certified botanical monographs, strain specifications, and laboratory testing profiles is strictly reserved for verified adults aged <strong className="text-[#07543F] dark:text-[#F28A19]">21 years and older</strong>.
        </p>

        <div className="my-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-left text-xs text-[#263A36] dark:text-emerald-200 space-y-1.5">
          <div className="flex items-center gap-2 font-semibold text-[#07543F] dark:text-emerald-300">
            <AlertCircle className="w-4 h-4 text-[#F28A19] shrink-0" />
            <span>Youth Protection & Legal Monograph Policy:</span>
          </div>
          <p className="text-[11px] text-[#68756F] dark:text-emerald-300/70 pl-6">
            By clicking "I Am 21 or Older", you confirm that you meet the statutory age threshold and accept responsible harm reduction guidelines.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => {
              window.location.href = 'https://www.google.de';
            }}
            className="py-3 px-4 rounded-xl border border-slate-300 dark:border-emerald-800 text-xs font-bold text-slate-600 dark:text-emerald-300 hover:bg-slate-100 dark:hover:bg-emerald-900/40 transition-colors flex items-center justify-center gap-1.5"
          >
            <X className="w-4 h-4" />
            I Am Under 21
          </button>
          <button
            onClick={verifyAge}
            className="py-3 px-4 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white text-xs font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 text-[#F28A19]" />
            I Am 21 or Older
          </button>
        </div>
      </div>
    </div>
  );
};

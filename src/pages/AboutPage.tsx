/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Leaf, Award, MapPin, Building, Users, Sparkles } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Hero */}
      <div className="rounded-3xl bg-gradient-to-br from-[#063E30] to-[#07543F] text-white p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] px-3 py-1 rounded-full bg-emerald-900/80 inline-block">
            About Canabis Hub Germany
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit']">
            Pioneering Botanical Purity & Consumer Harm Reduction
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Founded in Berlin following the passage of the German Cannabis Act (CanG), Canabis Hub serves as the definitive independent informational repository bridging licensed craft cultivators, accredited laboratories, and adult consumers.
          </p>
        </div>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-[#07543F] dark:text-emerald-300 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-[#F28A19]" />
          </div>
          <h3 className="text-base font-bold text-[#063E30] dark:text-white font-['Outfit']">
            100% Verified Testing
          </h3>
          <p className="text-xs text-[#68756F] dark:text-emerald-200/80 leading-relaxed">
            We reject unverified black-market marketing claims. Every cultivator featured in our directory must furnish recent ICP-MS certificates of analysis from accredited testing institutes.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 dark:bg-orange-950 text-[#F28A19] flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#063E30] dark:text-white font-['Outfit']">
            Craft Grower Recognition
          </h3>
          <p className="text-xs text-[#68756F] dark:text-emerald-200/80 leading-relaxed">
            Spotlighting artisanal indoor and greenhouse facilities across Bavaria, Brandenburg, and Europe that honor organic living soils and solventless whole-plant extraction.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900 text-[#07543F] dark:text-emerald-300 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-[#063E30] dark:text-white font-['Outfit']">
            Harm Reduction First
          </h3>
          <p className="text-xs text-[#68756F] dark:text-emerald-200/80 leading-relaxed">
            We provide clear, responsible dosing metrics, onset expectations, and educational insights to protect young adults and cultivate responsible societal consumption.
          </p>
        </div>
      </div>

      {/* Berlin Headquarters */}
      <div className="p-8 rounded-3xl bg-emerald-50/70 dark:bg-[#063E30]/40 border border-emerald-200 dark:border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#F28A19]">
            Headquarters & Registration
          </span>
          <h3 className="text-xl font-bold text-[#063E30] dark:text-white">
            Canabis Hub Germany GmbH
          </h3>
          <p className="text-xs text-[#68756F] dark:text-emerald-200/80">
            {settings.address} · Registration Number: {settings.canGRegNumber}
          </p>
        </div>
        <button
          onClick={() => navigateTo('contact')}
          className="py-3 px-6 rounded-xl bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30]"
        >
          Contact Our Berlin Team
        </button>
      </div>
    </div>
  );
};

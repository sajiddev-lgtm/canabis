/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAQ_ITEMS } from '../data/cannabisData';
import { HelpCircle, ChevronDown, Search, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [openIndexes, setOpenIndexes] = useState<number[]>([0, 1]);

  const toggleAccordion = (index: number) => {
    if (openIndexes.includes(index)) {
      setOpenIndexes(openIndexes.filter((i) => i !== index));
    } else {
      setOpenIndexes([...openIndexes, index]);
    }
  };

  const filteredFaqs = FAQ_ITEMS.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 inline-block">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#063E30] dark:text-white font-['Outfit']">
          Regulatory & Platform Guidance
        </h1>
        <p className="text-xs sm:text-sm text-[#68756F] dark:text-emerald-200/80 leading-relaxed">
          Transparent answers regarding German Cannabis Act (CanG) compliance, non-commercial directory policies, accredited laboratory testing, and user membership.
        </p>

        {/* Search */}
        <div className="relative max-w-lg mx-auto pt-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQ topics (e.g., CanG, shipping, COA, age limit)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl text-xs bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 text-[#263A36] dark:text-white shadow-xs focus:outline-none focus:ring-2 focus:ring-[#07543F]"
          />
        </div>
      </div>

      {/* Accordion list */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800">
            <HelpCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#063E30] dark:text-white">
              No matching questions found for "{searchQuery}".
            </p>
            <p className="text-xs text-[#68756F] dark:text-emerald-200/70 mt-1">
              Have a specific compliance question? Contact our regulatory office in Berlin.
            </p>
            <button
              onClick={() => navigateTo('contact')}
              className="mt-4 px-4 py-2 rounded-xl bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30]"
            >
              Contact Legal & Support
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq, index) => {
            const isOpen = openIndexes.includes(index);
            return (
              <div
                key={index}
                className="rounded-2xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 overflow-hidden transition-all shadow-xs"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-[#063E30] dark:text-white hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-[#07543F] dark:text-emerald-300 text-xs flex items-center justify-center shrink-0">
                      Q
                    </span>
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#07543F] dark:text-[#F28A19]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#E9EDE7] dark:border-emerald-800/60 text-xs sm:text-sm text-[#4A5568] dark:text-emerald-100/90 leading-relaxed space-y-2">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Compliance Callout Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900 to-[#063E30] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#F28A19] uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>German Legal Certainty</span>
          </div>
          <h3 className="text-xl font-bold font-['Outfit']">
            Do You Represent a Licensed European Cultivator or Brand?
          </h3>
          <p className="text-xs text-emerald-100/80 leading-relaxed">
            Submit your laboratory certificates of analysis (COA) and company credentials to be considered for our educational brand directory.
          </p>
        </div>
        <button
          onClick={() => navigateTo('contact')}
          className="px-6 py-3.5 rounded-xl bg-[#F28A19] hover:bg-[#d9770e] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
        >
          <span>Submit Brand Dossier</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

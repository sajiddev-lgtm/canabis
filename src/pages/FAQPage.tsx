/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FAQ_ITEMS } from '../data/cannabisData';
import { Plus, Minus, Search, HelpCircle, MessageSquare } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filteredFaqs = FAQ_ITEMS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-12 text-[#263A36] dark:text-[#E2E8F0] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-10 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-[#68756F] dark:text-gray-400 mb-3">
            <button onClick={() => navigateTo('home')} className="hover:text-[#07543F] dark:hover:text-emerald-400">
              Home
            </button>
            <span>/</span>
            <span className="text-[#07543F] dark:text-emerald-400 font-semibold">FAQ</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            HELP & COMPLIANCE DESK
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-[#68756F] dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Find immediate answers concerning our non-commercial directory mandate, German legal compliance, laboratory testing protocols, and courier guidelines.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto mt-6 relative">
            <Search className="w-4 h-4 text-[#68756F] dark:text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search frequently asked questions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-[#073B2E]/60 border border-[#E9EDE7] dark:border-white/10 rounded-xl text-xs sm:text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F] dark:focus:border-emerald-400 shadow-sm placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white dark:bg-[#073B2E]/50 rounded-3xl border border-[#E9EDE7] dark:border-white/10 shadow-sm divide-y divide-[#E9EDE7] dark:divide-white/10 px-6 sm:px-8">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = expandedIndex === idx;
            return (
              <div key={idx} className="py-6">
                <button
                  onClick={() => setExpandedIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between text-left group focus:outline-none"
                >
                  <span className="font-bold text-base sm:text-lg text-[#063E30] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 text-[#F28A19] flex items-center justify-center shrink-0 group-hover:bg-[#F28A19] group-hover:text-white transition-colors">
                    {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-4 text-xs sm:text-sm text-[#68756F] dark:text-gray-300 leading-relaxed animate-fadeIn">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-[#073B2E]/50 rounded-2xl border border-[#E9EDE7] dark:border-white/10 mt-6">
            <HelpCircle className="w-10 h-10 text-slate-300 dark:text-emerald-500/30 mx-auto mb-2" />
            <p className="text-sm text-[#68756F] dark:text-gray-300">
              No results found matching &ldquo;{searchQuery}&rdquo;.
            </p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="mt-12 bg-[#073B2E] dark:bg-[#073B2E]/90 text-white rounded-3xl p-8 sm:p-10 text-center border border-white/10 shadow-xl">
          <MessageSquare className="w-10 h-10 text-[#F28A19] mx-auto mb-3" />
          <h3 className="text-xl font-bold mb-2">Still Have Questions?</h3>
          <p className="text-xs sm:text-sm text-[#FFFDF8]/80 max-w-md mx-auto mb-6">
            Our regulatory compliance and laboratory auditing specialists are available to answer inquiries.
          </p>
          <button
            onClick={() => navigateTo('contact')}
            className="px-7 py-3 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white text-xs font-bold transition-all shadow-md"
          >
            Submit an Inquiry to Berlin Desk
          </button>
        </div>
      </div>
    </div>
  );
};

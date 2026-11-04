/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CANG_LEGAL_SECTIONS } from '../data/cannabisData';
import { Scale, ShieldCheck, AlertTriangle, BookOpen, CheckCircle2, FileText } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const { blogPosts, navigateTo } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#063E30] to-[#07543F] text-white p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] px-3 py-1 rounded-full bg-emerald-900/80 inline-block">
            Federal Republic of Germany
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit']">
            German Cannabis Act (CanG) Legal Framework
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            An authoritative, transparent review of adult possession rights, non-commercial cultivation associations (Anbauvereinigungen), and analytical testing obligations under current federal legislation.
          </p>
        </div>
      </div>

      {/* Statutory Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {CANG_LEGAL_SECTIONS.map((sec, idx) => (
          <div
            key={idx}
            className="p-6 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-900/60">
                  {sec.code}
                </span>
                <Scale className="w-4 h-4 text-[#F28A19]" />
              </div>

              <h3 className="text-lg font-bold text-[#063E30] dark:text-white font-['Outfit']">
                {sec.title}
              </h3>

              <p className="text-xs text-[#68756F] dark:text-emerald-200/80 mt-1 leading-relaxed">
                {sec.summary}
              </p>

              <ul className="mt-4 space-y-2 pt-3 border-t border-[#E9EDE7] dark:border-emerald-800/60 text-xs text-[#263A36] dark:text-emerald-100">
                {sec.points.map((pt, pIdx) => (
                  <li key={pIdx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#07543F] dark:text-[#F28A19] shrink-0 mt-0.5" />
                    <span className="text-[11px] leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Deep Dive Educational Monographs */}
      <div className="space-y-6 pt-6">
        <div>
          <h2 className="text-2xl font-bold text-[#063E30] dark:text-white font-['Outfit']">
            Analytical & Pharmacopoeial Monographs
          </h2>
          <p className="text-xs text-[#68756F] dark:text-emerald-200/70">
            Peer-reviewed perspectives authored by German pharmacologists and analytical biochemists.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="p-6 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs space-y-3"
            >
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F28A19]">
                {post.category} · {post.read_time}
              </span>
              <h3 className="text-xl font-bold text-[#063E30] dark:text-white font-['Outfit']">
                {post.title}
              </h3>
              <p className="text-xs text-[#68756F] dark:text-emerald-200/80 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between">
                <span>By {post.author}</span>
                <span>Published {post.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

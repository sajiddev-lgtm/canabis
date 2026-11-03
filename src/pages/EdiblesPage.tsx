/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BRANDS_DIRECTORY, PRODUCTS_DATA } from '../data/cannabisData';
import { Sparkles, ArrowRight, ShieldCheck, Clock, Heart, Apple } from 'lucide-react';

export const EdiblesPage: React.FC = () => {
  const { navigateTo } = useApp();

  const edibleBrands = BRANDS_DIRECTORY.filter((b) => b.category === 'edibles_more');
  const edibleProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === 'edibles');

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-12 text-[#263A36] dark:text-[#E2E8F0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-xs text-[#68756F] dark:text-gray-400 mb-3">
            <button onClick={() => navigateTo('home')} className="hover:text-[#07543F] dark:hover:text-emerald-400">
              Home
            </button>
            <span>/</span>
            <span className="text-[#07543F] dark:text-emerald-400 font-semibold">Edibles & More</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            CONFECTIONERY & BIOAVAILABILITY
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-4">
            Artisanal Edibles & Infusions
          </h1>
          <p className="text-sm sm:text-base text-[#68756F] dark:text-gray-300 max-w-3xl leading-relaxed">
            From precision vegan pectin lozenges and Belgian dark chocolates to whole-plant RSO elixirs. Discover how metered oral dosing and nano-emulsion technology provide predictable, sustained wellness.
          </p>
        </div>

        {/* Science & Dosing Guidelines Banner */}
        <div className="bg-[#073B2E] dark:bg-[#073B2E]/90 text-white rounded-3xl p-8 sm:p-10 mb-16 border border-white/10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-[#F28A19] flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Pharmacokinetics</h3>
              <p className="text-xs text-[#FFFDF8]/80 leading-relaxed">
                Ingested cannabinoids are converted by the liver into 11-hydroxy-THC, yielding a more profound, prolonged duration of action (4 to 8 hours).
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-[#F28A19] flex items-center justify-center mb-3">
                <Apple className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Clean Pectin Bases</h3>
              <p className="text-xs text-[#FFFDF8]/80 leading-relaxed">
                Our partnered confectioners avoid animal gelatins, corn syrups, and synthetic dyes, choosing fruit pectin and organic tapioca syrups.
              </p>
            </div>

            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-[#F28A19] flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-white">Start Low, Go Slow</h3>
              <p className="text-xs text-[#FFFDF8]/80 leading-relaxed">
                Medical guidelines recommend initiating edible exploration with 2.5mg to 5mg of THC, waiting 90 minutes before evaluating onset.
              </p>
            </div>
          </div>
        </div>

        {/* 13 Indexed Edible Brands */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
                MEGA MENU COLUMN 4
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white">
                All 13 Indexed Edible & Wellness Brands
              </h2>
            </div>
            <span className="text-xs text-[#68756F] dark:text-gray-400">13 Artisanal Labs</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {edibleBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white dark:bg-[#073B2E]/50 rounded-2xl p-6 border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/40 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[#68756F] dark:text-gray-400">{brand.location}</span>
                    <span className="text-[#F28A19] font-bold text-[10px] uppercase">
                      {brand.founded}
                    </span>
                  </div>

                  <h3
                    onClick={() => navigateTo('brand-detail', brand.id)}
                    className="font-extrabold text-xl text-[#063E30] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300 cursor-pointer mb-1.5 transition-colors"
                  >
                    {brand.name}
                  </h3>

                  <p className="text-xs font-medium text-[#F28A19] mb-3">
                    {brand.tagline}
                  </p>

                  <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed mb-4">
                    {brand.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#E9EDE7] dark:border-white/10">
                  <button
                    onClick={() => navigateTo('brand-detail', brand.id)}
                    className="w-full py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#041F18]/80 hover:bg-[#07543F] dark:hover:bg-emerald-600 hover:text-white border border-[#E9EDE7] dark:border-white/10 text-xs font-bold text-[#063E30] dark:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Confectionery Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

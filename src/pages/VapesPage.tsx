/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BRANDS_DIRECTORY, PRODUCTS_DATA } from '../data/cannabisData';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2, AlertCircle } from 'lucide-react';

export const VapesPage: React.FC = () => {
  const { navigateTo } = useApp();

  const vapeBrands = BRANDS_DIRECTORY.filter((b) => b.category === 'vapes');
  const vapeProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === 'vapes');

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
            <span className="text-[#07543F] dark:text-emerald-400 font-semibold">Vaporizers & Hardware</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            HARDWARE SAFETY & PURITY
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-4">
            Medical Ceramic Vaporizers & Distillates
          </h1>
          <p className="text-sm sm:text-base text-[#68756F] dark:text-gray-300 max-w-3xl leading-relaxed">
            Engineering excellence meets botanical precision. All indexed vapor platforms utilize biocompatible porous ceramic cores, aircraft-grade aluminium shells, and zero chemical cutting agents (no PG, VG, MCT, or Vitamin E acetate).
          </p>
        </div>

        {/* Safety Comparison Grid */}
        <div className="bg-white dark:bg-[#073B2E]/60 rounded-3xl p-8 border border-[#E9EDE7] dark:border-white/10 shadow-sm mb-16">
          <h2 className="text-xl font-bold text-[#063E30] dark:text-white mb-6">
            Hardware Safety Benchmarks
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Certified Medical Standards
              </h3>
              <ul className="space-y-2 text-xs text-[#68756F] dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1 shrink-0" />
                  <span><strong>Biocompatible Ceramic Cores:</strong> Microporous matrix ensures uniform heat distribution without burning oil.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1 shrink-0" />
                  <span><strong>Zero Heavy Metal Leaching:</strong> Tested to below 0.1 ppm for lead, nickel, and cadmium.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 mt-1 shrink-0" />
                  <span><strong>100% Cannabis Terpenes:</strong> Single-origin native terpene fractions without synthetic aroma boosters.</span>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-rose-800 dark:text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                Unregulated Market Hazards Avoided
              </h3>
              <ul className="space-y-2 text-xs text-[#68756F] dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 mt-1 shrink-0" />
                  <span><strong>No Synthetic Thinning Agents:</strong> Strict ban on propylene glycol, vegetable glycerin, and synthetic oils.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 mt-1 shrink-0" />
                  <span><strong>No Metal Solder Joints:</strong> Modern weldless and glue-free cartridge construction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-600 dark:bg-rose-400 mt-1 shrink-0" />
                  <span><strong>No Vitamin E Acetate:</strong> Fully verified through HPLC laboratory screening.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4 Indexed Vape Brands */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
                MEGA MENU COLUMN 5
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white">
                Curated Vapor Brands
              </h2>
            </div>
            <span className="text-xs text-[#68756F] dark:text-gray-400">4 Certified Brands</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vapeBrands.map((brand) => (
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
                    <span>View Hardware Specs</span>
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

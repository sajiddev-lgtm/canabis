/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { Layers, ShieldCheck, Zap, Bookmark, ArrowRight, CheckCircle2 } from 'lucide-react';

export const VapesPage: React.FC = () => {
  const { products, openProductModal, savedProductIds, toggleSaveProduct } = useApp();

  const vapeProducts = products.filter(
    (p) => p.category_slug === 'vapes' || p.category === 'Vaporizers & Pods'
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-cyan-950 via-[#063E30] to-[#07543F] text-white p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] px-3 py-1 rounded-full bg-cyan-900/60 inline-block">
            Medical Ceramic Core Hardware & Clean Extracts
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit']">
            Vaporizers & Precision Pod Systems
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Medical-grade porous ceramic heating cores designed to vaporize without scorching delicate monoterpenes. Verified 100% free of Vitamin E acetate, synthetic thinners (PG/VG/MCT), and heavy metal leeching.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vapeProducts.map((p) => {
          const isSaved = savedProductIds.includes(p.id);
          return (
            <div
              key={p.id}
              className="group p-5 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs hover:shadow-xl hover:border-[#07543F] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-4/3 rounded-2xl overflow-hidden mb-4 bg-emerald-950">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#07543F] text-emerald-100 text-[10px] font-bold">
                    {p.short_description}
                  </div>
                  <button
                    onClick={() => toggleSaveProduct(p.id)}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isSaved ? 'bg-[#07543F] text-white' : 'bg-white/80 dark:bg-emerald-950/80 text-slate-700 dark:text-white'
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <span className="text-xs font-bold text-[#F28A19] block uppercase tracking-wider">
                  {p.brand}
                </span>

                <h3 className="text-lg font-bold text-[#063E30] dark:text-white mt-1 group-hover:text-[#07543F] transition-colors">
                  {p.name}
                </h3>

                <p className="text-xs text-[#68756F] dark:text-emerald-200/70 mt-2 line-clamp-2">
                  {p.description}
                </p>

                <div className="mt-4 pt-3 border-t border-[#E9EDE7] dark:border-emerald-800 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-800">
                    <span className="text-[10px] text-slate-500 block">THC</span>
                    <span className="font-extrabold text-[#07543F] dark:text-emerald-300">{p.thc}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-100 dark:border-orange-800">
                    <span className="text-[10px] text-slate-500 block">CBD</span>
                    <span className="font-extrabold text-[#F28A19]">{p.cbd}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E9EDE7] dark:border-emerald-800 flex items-center justify-between">
                <span className="font-mono text-[10px] text-slate-500">{p.lab_batch}</span>
                <button
                  onClick={() => openProductModal(p)}
                  className="px-3 py-1.5 rounded-xl bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30] flex items-center gap-1.5"
                >
                  <span>Hardware & Specs</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

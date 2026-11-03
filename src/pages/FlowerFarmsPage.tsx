/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BRANDS_DIRECTORY, PRODUCTS_DATA } from '../data/cannabisData';
import { Sprout, ShieldCheck, ArrowRight, Sun, Droplets, Wind, Sparkles } from 'lucide-react';

export const FlowerFarmsPage: React.FC = () => {
  const { navigateTo, isItemSaved, toggleSaveItem } = useApp();

  const flowerBrands = BRANDS_DIRECTORY.filter((b) => b.category === 'flower_farms');
  const flowerProducts = PRODUCTS_DATA.filter((p) => p.categorySlug === 'flower');

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
            <span className="text-[#07543F] dark:text-emerald-400 font-semibold">Flower Farms</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            ORGANIC & CRAFT CANOPIES
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-4">
            Certified Flower Farms of Europe
          </h1>
          <p className="text-sm sm:text-base text-[#68756F] dark:text-gray-300 max-w-3xl leading-relaxed">
            Exploring the vanguard of living-soil agronomy, high-altitude alpine indoor environments, and small-batch cold curing across Germany. Zero synthetic pesticides, zero heavy metals, and pure genetic pedigree.
          </p>
        </div>

        {/* Cultivation Standards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-white dark:bg-[#073B2E]/60 p-6 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-300 flex items-center justify-center mb-4">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#063E30] dark:text-white mb-2">
              Living Organic Soil (LOS)
            </h3>
            <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
              Enriched with compost teas, volcanic rock dust, and beneficial mycorrhizae to stimulate vibrant natural terpene expression without salt buildup.
            </p>
          </div>

          <div className="bg-white dark:bg-[#073B2E]/60 p-6 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/20 text-[#F28A19] flex items-center justify-center mb-4">
              <Sun className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#063E30] dark:text-white mb-2">
              Broad-Spectrum LED Canopies
            </h3>
            <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
              Precision high-PPFD photoperiod lighting replicating solar spectra with supplemental UV and far-red wavelengths for dense glandular trichome development.
            </p>
          </div>

          <div className="bg-white dark:bg-[#073B2E]/60 p-6 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-4">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-[#063E30] dark:text-white mb-2">
              21-Day Cold Glass Curing
            </h3>
            <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
              Patiently cured at 15°C and 60% relative humidity, allowing chlorophyll to gently degrade while locking in delicate volatile monoterpenes.
            </p>
          </div>
        </div>

        {/* Featured Flower Farm Brands */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
                MEGA MENU COLUMN 3 PARTNERS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white">
                Indexed Craft Cultivators
              </h2>
            </div>
            <span className="text-xs text-[#68756F] dark:text-gray-400">{flowerBrands.length} Verified Farms</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flowerBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-white dark:bg-[#073B2E]/50 rounded-2xl p-6 border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/40 dark:hover:border-emerald-500/50 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono text-[#68756F] dark:text-gray-400">{brand.location}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 font-semibold text-[10px]">
                      EU-GMP Aligned
                    </span>
                  </div>

                  <h3
                    onClick={() => navigateTo('brand-detail', brand.id)}
                    className="font-extrabold text-xl text-[#063E30] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300 cursor-pointer mb-2 transition-colors"
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
                    <span>View Farm Profile & Strains</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Flower Cultivars Showcase */}
        <div>
          <div className="mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
              CURATED WHOLE FLOWER
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white">
              Signature Flower Monographs
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {flowerProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white dark:bg-[#073B2E]/50 rounded-2xl border border-[#E9EDE7] dark:border-white/10 overflow-hidden p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4 relative">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-3 left-3 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                      {prod.strainType}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[#F28A19] uppercase tracking-wider block mb-1">
                    {prod.brand}
                  </span>

                  <h3 className="font-bold text-base text-[#063E30] dark:text-white mb-1.5">
                    {prod.name}
                  </h3>

                  <p className="text-xs text-[#68756F] dark:text-gray-300 line-clamp-2 mb-3">
                    {prod.description}
                  </p>

                  <div className="text-xs space-y-1.5 pt-2 border-t border-[#E9EDE7] dark:border-white/10">
                    <div className="flex justify-between">
                      <span className="text-[#68756F] dark:text-gray-400">THC Potency:</span>
                      <span className="font-bold text-[#07543F] dark:text-emerald-400">{prod.thc}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#68756F] dark:text-gray-400">Terpenes:</span>
                      <span className="font-medium truncate max-w-[150px] dark:text-gray-200">{prod.terpenes.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-2">
                  <button
                    onClick={() => toggleSaveItem(prod.id)}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold transition-colors ${
                      isItemSaved(prod.id)
                        ? 'bg-[#F28A19] text-white'
                        : 'bg-[#07543F] dark:bg-emerald-600 text-white hover:bg-[#063E30] dark:hover:bg-emerald-700'
                    }`}
                  >
                    {isItemSaved(prod.id) ? 'Saved in Wishlist' : 'Save Cultivar Spec'}
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

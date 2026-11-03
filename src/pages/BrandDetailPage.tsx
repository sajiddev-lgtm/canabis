/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { BRANDS_DIRECTORY, PRODUCTS_DATA } from '../data/cannabisData';
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Sprout,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FlaskConical,
  Award,
  Bookmark,
  CheckCircle,
} from 'lucide-react';

export const BrandDetailPage: React.FC = () => {
  const { pageParam, navigateTo, isItemSaved, toggleSaveItem } = useApp();

  // Find brand by id or slug
  const brandSlug = pageParam || 'albatross';
  const brand =
    BRANDS_DIRECTORY.find((b) => b.id === brandSlug) ||
    BRANDS_DIRECTORY.find((b) => b.id.toLowerCase() === brandSlug.toLowerCase()) ||
    BRANDS_DIRECTORY[0];

  // Associated products
  const relatedProducts = PRODUCTS_DATA.filter(
    (p) => p.brandSlug === brand.id || p.brand.toLowerCase() === brand.name.toLowerCase()
  );

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-12 text-[#263A36] dark:text-[#E2E8F0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <button
            onClick={() => navigateTo('brands')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#07543F] dark:text-emerald-400 hover:text-[#F28A19] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Brands Directory
          </button>
        </div>

        {/* Brand Hero Banner */}
        <div className="bg-white dark:bg-[#073B2E]/60 rounded-3xl p-8 sm:p-12 border border-[#E9EDE7] dark:border-white/10 shadow-sm mb-12 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-md bg-[#F28A19]/10 text-[#F28A19] text-xs font-bold uppercase tracking-wider">
                {brand.categoryLabel}
              </span>
              <span className="px-3 py-1 rounded-md bg-[#07543F]/10 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-300 text-xs font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ISO/IEC 17025 Certified
              </span>
              {brand.organicCertified && (
                <span className="px-3 py-1 rounded-md bg-emerald-50 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center gap-1">
                  <Sprout className="w-3.5 h-3.5" /> Living Soil / Organic
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight">
              {brand.name}
            </h1>

            <p className="text-lg font-medium text-[#F28A19] italic">
              &ldquo;{brand.tagline}&rdquo;
            </p>

            <p className="text-sm sm:text-base text-[#68756F] dark:text-gray-300 leading-relaxed pt-2">
              {brand.description}
            </p>

            {/* Quick Metrics */}
            <div className="pt-6 border-t border-[#E9EDE7] dark:border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-[#68756F] dark:text-gray-400 block">Operations Hub</span>
                <span className="font-bold text-[#063E30] dark:text-white text-sm flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F28A19]" />
                  {brand.location}
                </span>
              </div>
              <div>
                <span className="text-[#68756F] dark:text-gray-400 block">Founded Year</span>
                <span className="font-bold text-[#063E30] dark:text-white text-sm flex items-center gap-1 mt-0.5 font-mono">
                  <Calendar className="w-3.5 h-3.5 text-[#07543F] dark:text-emerald-400" />
                  {brand.founded}
                </span>
              </div>
              <div>
                <span className="text-[#68756F] dark:text-gray-400 block">Primary Focus</span>
                <span className="font-bold text-[#063E30] dark:text-white text-sm block mt-0.5 truncate">
                  {brand.specialty}
                </span>
              </div>
              <div>
                <span className="text-[#68756F] dark:text-gray-400 block">Compliance Standard</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm block mt-0.5">
                  German CanG
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Signature Cultivars & Lab Monograph Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
                PORTFOLIO MONOGRAPHS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white">
                Verified Products by {brand.name}
              </h2>
            </div>
            <button
              onClick={() => navigateTo('shop')}
              className="text-xs font-bold text-[#07543F] dark:text-emerald-400 hover:text-[#F28A19] flex items-center gap-1"
            >
              Browse Full Catalog →
            </button>
          </div>

          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white dark:bg-[#073B2E]/50 rounded-2xl border border-[#E9EDE7] dark:border-white/10 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
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

                    <div className="text-[11px] font-bold text-[#F28A19] uppercase tracking-wider mb-1">
                      {prod.category}
                    </div>

                    <h3 className="font-bold text-base text-[#063E30] dark:text-white mb-1.5">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-[#68756F] dark:text-gray-300 line-clamp-2 mb-3">
                      {prod.description}
                    </p>

                    <div className="text-xs text-[#263A36] dark:text-gray-200 space-y-1 pt-2 border-t border-[#E9EDE7] dark:border-white/10">
                      <div className="flex justify-between">
                        <span className="text-[#68756F] dark:text-gray-400">THC:</span>
                        <span className="font-semibold text-[#07543F] dark:text-emerald-400">{prod.thc}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#68756F] dark:text-gray-400">Terpenes:</span>
                        <span className="font-medium truncate max-w-[150px]">{prod.terpenes.join(', ')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#68756F] dark:text-gray-400">Lab Batch:</span>
                        <span className="font-mono text-[10px] text-[#68756F] dark:text-gray-400">{prod.labBatch}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-2">
                    <button
                      onClick={() => toggleSaveItem(prod.id)}
                      className={`w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                        isItemSaved(prod.id)
                          ? 'bg-[#F28A19] text-white'
                          : 'bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 text-[#063E30] dark:text-white hover:bg-[#07543F] hover:text-white'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                      {isItemSaved(prod.id) ? 'Saved' : 'Save to Reference List'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-[#073B2E]/60 rounded-2xl border border-[#E9EDE7] dark:border-white/10 p-8 text-center">
              <FlaskConical className="w-10 h-10 text-slate-300 dark:text-emerald-500/40 mx-auto mb-2" />
              <h4 className="font-bold text-base text-[#063E30] dark:text-white mb-1">
                Curated Monographs Coming Soon
              </h4>
              <p className="text-xs text-[#68756F] dark:text-gray-300 max-w-sm mx-auto mb-4">
                Signature cultivars for {brand.name} are currently undergoing laboratory HPLC cannabinoid profiling.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {brand.signatureProducts.map((p, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 text-xs font-medium text-[#263A36] dark:text-gray-300"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quality Commitment Section */}
        <div className="mt-16 bg-[#073B2E] dark:bg-[#073B2E]/90 text-white rounded-3xl p-8 sm:p-10 border border-white/10 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-xl sm:text-2xl font-bold">
                Verification & Traceability Assurance
              </h3>
              <p className="text-xs sm:text-sm text-[#FFFDF8]/80 leading-relaxed">
                All production batches from {brand.name} are logged in the Canabis Hub Central Registry with tamper-evident batch authentication, confirming origin compliance and pesticide-free purity.
              </p>
            </div>
            <div className="text-left md:text-right">
              <button
                onClick={() => navigateTo('contact')}
                className="px-6 py-3 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white text-xs font-bold transition-all shadow-md"
              >
                Request Facility Audit Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

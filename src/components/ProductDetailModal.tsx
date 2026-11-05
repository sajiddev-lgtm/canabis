/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShieldCheck,
  Bookmark,
  Share2,
  FileText,
  MapPin,
  Sparkles,
  ShoppingBag,
  CheckCircle2,
  Leaf,
  Layers,
  Activity,
} from 'lucide-react';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    closeProductModal,
    savedProductIds,
    toggleSaveProduct,
    addToCart,
    navigateTo,
  } = useApp();

  if (!selectedProduct) return null;

  const isSaved = savedProductIds.includes(selectedProduct.id);
  const isShopItem = selectedProduct.type === 'permitted_merchandise';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Close button */}
        <button
          onClick={closeProductModal}
          className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 dark:bg-emerald-950/80 text-[#263A36] dark:text-emerald-100 hover:bg-white dark:hover:bg-emerald-900 shadow-md transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image & Badges */}
          <div className="p-6 md:p-8 flex flex-col justify-between bg-emerald-50/50 dark:bg-emerald-950/30 rounded-t-3xl md:rounded-tr-none md:rounded-l-3xl border-b md:border-b-0 md:border-r border-[#E9EDE7] dark:border-emerald-800/60">
            <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-white dark:bg-emerald-900/40 shadow-inner mb-6 border border-[#E9EDE7] dark:border-emerald-800">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#07543F] text-emerald-100 shadow-xs">
                  {selectedProduct.category}
                </span>
                {isShopItem && (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#F28A19] text-white shadow-xs">
                    Permitted Hardware
                  </span>
                )}
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-white dark:bg-emerald-900/40 border border-[#E9EDE7] dark:border-emerald-800">
                <span className="block text-[10px] uppercase font-bold text-[#68756F] dark:text-emerald-200/60">
                  Total Cannabinoids
                </span>
                <span className="text-xl font-extrabold text-[#07543F] dark:text-emerald-300">
                  {selectedProduct.thc}
                </span>
                <span className="text-[10px] text-slate-500">THC Content</span>
              </div>
              <div className="p-3 rounded-xl bg-white dark:bg-emerald-900/40 border border-[#E9EDE7] dark:border-emerald-800">
                <span className="block text-[10px] uppercase font-bold text-[#68756F] dark:text-emerald-200/60">
                  Secondary Cannabinoids
                </span>
                <span className="text-xl font-extrabold text-[#F28A19]">
                  {selectedProduct.cbd}
                </span>
                <span className="text-[10px] text-slate-500">CBD Content</span>
              </div>
            </div>

            {/* Lab batch verification */}
            <div className="mt-4 p-3 rounded-xl bg-emerald-100/60 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-700/60 flex items-center gap-2.5 text-xs text-[#063E30] dark:text-emerald-100">
              <ShieldCheck className="w-4 h-4 text-[#07543F] dark:text-[#F28A19] shrink-0" />
              <div className="text-[11px]">
                <span className="font-bold">Verified Lab Batch: </span>
                <span className="font-mono">{selectedProduct.lab_batch || 'DE-LAB-2026-9041'}</span>
              </div>
            </div>
          </div>

          {/* Right: Detailed Monograph Info */}
          <div className="p-6 md:p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <button
                  onClick={() => {
                    closeProductModal();
                    navigateTo('brands', selectedProduct.brand_slug);
                  }}
                  className="text-xs font-bold uppercase tracking-wider text-[#F28A19] hover:underline flex items-center gap-1"
                >
                  {selectedProduct.brand}
                </button>
                <h3 className="text-2xl font-extrabold text-[#063E30] dark:text-white font-['Outfit'] mt-1">
                  {selectedProduct.name}
                </h3>
                <p className="text-xs font-medium text-[#68756F] dark:text-emerald-200/70 mt-1">
                  {selectedProduct.short_description}
                </p>
              </div>

              {/* Monograph Description */}
              <div className="text-xs text-[#263A36] dark:text-emerald-100/90 leading-relaxed space-y-2">
                <p>{selectedProduct.description}</p>
              </div>

              {/* Terpene Profile */}
              {selectedProduct.terpenes && selectedProduct.terpenes.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#68756F] dark:text-emerald-200/60 block mb-1.5 flex items-center gap-1">
                    <Leaf className="w-3.5 h-3.5 text-[#07543F] dark:text-[#F28A19]" />
                    Dominant Terpene Profile:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.terpenes.map((terp, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-100 dark:bg-emerald-900/60 text-[#07543F] dark:text-emerald-200 border border-emerald-200 dark:border-emerald-700/50"
                      >
                        {terp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Reported Effects */}
              {selectedProduct.effects && selectedProduct.effects.length > 0 && (
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#68756F] dark:text-emerald-200/60 block mb-1.5 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-[#F28A19]" />
                    Synergistic Effects:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedProduct.effects.map((eff, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-100 dark:bg-orange-950/60 text-amber-900 dark:text-amber-200 border border-orange-200 dark:border-orange-800/60"
                      >
                        {eff}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cultivation Facility & Origin */}
              {selectedProduct.origin && (
                <div className="flex items-center gap-2 text-xs text-[#68756F] dark:text-emerald-200/70 pt-2 border-t border-[#E9EDE7] dark:border-emerald-800/60">
                  <MapPin className="w-4 h-4 text-[#07543F] dark:text-[#F28A19]" />
                  <span>Origin: {selectedProduct.origin}</span>
                </div>
              )}
            </div>

            {/* Actions: Save Monograph or Buy Lawful Accessory */}
            <div className="mt-6 pt-4 border-t border-[#E9EDE7] dark:border-emerald-800/60 flex items-center justify-between gap-3">
              <button
                onClick={() => toggleSaveProduct(selectedProduct.id)}
                className={`p-3 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  isSaved
                    ? 'bg-emerald-100 dark:bg-emerald-900 text-[#07543F] dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                    : 'border-slate-300 dark:border-emerald-800 text-slate-700 dark:text-emerald-200 hover:bg-slate-100 dark:hover:bg-emerald-900/40'
                }`}
                title={isSaved ? 'Saved to bookmarks' : 'Bookmark monograph'}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {isShopItem ? (
                <button
                  onClick={() => {
                    addToCart(selectedProduct);
                    closeProductModal();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-[#F28A19] hover:bg-[#d9770e] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart (€{(selectedProduct.price ?? 0).toFixed(2)})</span>
                </button>
              ) : (
                <div className="flex-1 flex items-center justify-end text-xs text-emerald-700 dark:text-emerald-300 font-semibold gap-1">
                  <FileText className="w-4 h-4 text-[#07543F] dark:text-[#F28A19]" />
                  <span>CanG Certified Botanical Monograph</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

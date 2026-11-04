/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Trash2, ExternalLink, Bookmark, Sparkles, Share2 } from 'lucide-react';

export const SavedItemsDrawer: React.FC = () => {
  const {
    isSavedDrawerOpen,
    closeSavedDrawer,
    savedProducts,
    toggleSaveItem,
    clearSavedItems,
    navigateTo,
  } = useApp();

  const [copied, setCopied] = React.useState(false);

  if (!isSavedDrawerOpen) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeSavedDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#073B2E] shadow-2xl flex flex-col border-l border-[#E9EDE7] dark:border-white/10 transition-colors">
          {/* Header */}
          <div className="p-6 border-b border-[#E9EDE7] dark:border-white/10 flex items-center justify-between bg-[#FFFDF8] dark:bg-[#041F18]">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#07543F]/10 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-300 flex items-center justify-center">
                <Bookmark className="w-5 h-5 fill-[#07543F] dark:fill-emerald-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#063E30] dark:text-white">Saved Reference List</h3>
                <p className="text-xs text-[#68756F] dark:text-gray-400">
                  {savedProducts.length} {savedProducts.length === 1 ? 'item' : 'items'} bookmarked
                </p>
              </div>
            </div>

            <button
              onClick={closeSavedDrawer}
              className="p-2 rounded-xl text-[#68756F] dark:text-gray-300 hover:text-[#263A36] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {savedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#68756F] dark:text-gray-400">
                <Bookmark className="w-12 h-12 stroke-[1.5] text-slate-300 dark:text-emerald-800 mb-3" />
                <h4 className="font-semibold text-base text-[#263A36] dark:text-white mb-1">
                  Your reference list is empty
                </h4>
                <p className="text-xs max-w-xs mb-6">
                  Bookmark botanical cultivars, extracts, and vaporizers while exploring the catalog for fast reference.
                </p>
                <button
                  onClick={() => {
                    closeSavedDrawer();
                    navigateTo('shop');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#07543F] dark:bg-emerald-600 text-white text-xs font-bold hover:bg-[#063E30] transition-colors"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              savedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="p-4 rounded-2xl border border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#041F18]/80 hover:border-[#07543F]/40 dark:hover:border-emerald-500/40 transition-all flex gap-3.5 group"
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-16 h-16 rounded-xl object-cover border border-[#E9EDE7] dark:border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-[#F28A19] uppercase tracking-wider block">
                      {prod.brand}
                    </span>
                    <h5
                      onClick={() => {
                        closeSavedDrawer();
                        navigateTo('product-detail', prod.id);
                      }}
                      className="font-bold text-sm text-[#263A36] dark:text-white truncate hover:text-[#07543F] dark:hover:text-[#F28A19] cursor-pointer"
                    >
                      {prod.name}
                    </h5>
                    <div className="flex items-center gap-2 text-xs text-[#68756F] dark:text-gray-300 mt-1">
                      {prod.type === 'permitted_merchandise' ? (
                        <span className="font-mono font-bold text-[#07543F] dark:text-emerald-400">
                          €{prod.price?.toFixed(2)}
                        </span>
                      ) : (
                        <>
                          <span>THC: {prod.thc}</span>
                          <span>·</span>
                          <span>{prod.strainType || 'Cannabis'}</span>
                        </>
                      )}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs pt-1 border-t border-[#E9EDE7]/60 dark:border-white/10">
                      <button
                        onClick={() => {
                          closeSavedDrawer();
                          navigateTo('product-detail', prod.id);
                        }}
                        className="text-[#07543F] dark:text-[#F28A19] font-bold text-xs hover:underline flex items-center gap-1"
                      >
                        View Product <ExternalLink className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => toggleSaveItem(prod.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Actions */}
          {savedProducts.length > 0 && (
            <div className="p-6 border-t border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#041F18] space-y-3">
              <div className="flex items-center justify-between text-xs text-[#68756F] dark:text-gray-400 mb-1">
                <span>Informational Wishlist</span>
                <span className="text-[#07543F] dark:text-emerald-400 font-semibold">Non-Transactional</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-[#E9EDE7] dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 text-[#263A36] dark:text-gray-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" /> {copied ? 'Link Copied!' : 'Share List'}
                </button>
                <button
                  onClick={clearSavedItems}
                  className="py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 font-semibold text-xs transition-colors"
                >
                  Clear All
                </button>
              </div>
              <button
                onClick={() => {
                  closeSavedDrawer();
                  navigateTo('shop');
                }}
                className="w-full py-3 rounded-xl bg-[#07543F] dark:bg-emerald-600 hover:bg-[#063E30] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
              >
                Inspect All Products in Catalog
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

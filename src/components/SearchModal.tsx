/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { BRANDS_DIRECTORY, PRODUCTS_DATA, BLOG_POSTS, FAQ_ITEMS } from '../data/cannabisData';
import { Search, X, Tag, BookOpen, Layers, HelpCircle, ArrowRight } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, closeSearch, openSearch, navigateTo } = useApp();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isSearchOpen) closeSearch();
        else openSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch, openSearch]);

  if (!isSearchOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  const matchedBrands = BRANDS_DIRECTORY.filter(
    (b) =>
      b.name.toLowerCase().includes(cleanQuery) ||
      b.specialty.toLowerCase().includes(cleanQuery) ||
      b.tagline.toLowerCase().includes(cleanQuery)
  ).slice(0, 5);

  const matchedProducts = PRODUCTS_DATA.filter(
    (p) =>
      p.name.toLowerCase().includes(cleanQuery) ||
      p.brand.toLowerCase().includes(cleanQuery) ||
      p.category.toLowerCase().includes(cleanQuery) ||
      (p.terpenes && p.terpenes.some((t) => t.toLowerCase().includes(cleanQuery)))
  ).slice(0, 5);

  const matchedPosts = BLOG_POSTS.filter(
    (post) =>
      post.title.toLowerCase().includes(cleanQuery) ||
      post.excerpt.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  const matchedFaqs = FAQ_ITEMS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(cleanQuery) ||
      faq.answer.toLowerCase().includes(cleanQuery)
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#073B2E] rounded-3xl shadow-2xl border border-[#E9EDE7] dark:border-white/10 overflow-hidden transition-colors">
        {/* Search Input Bar */}
        <div className="relative border-b border-[#E9EDE7] dark:border-white/10 p-4 flex items-center gap-3 bg-[#FFFDF8] dark:bg-[#041F18]">
          <Search className="w-5 h-5 text-[#07543F] dark:text-emerald-400 shrink-0" />
          <input
            type="text"
            placeholder="Search brands (e.g. Albatross, Cosmic), cultivars, terpenes, or articles..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-base text-[#263A36] dark:text-white placeholder-[#68756F]/60 dark:placeholder-gray-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-[#68756F] dark:text-gray-300 hover:text-[#263A36] dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-[#68756F] dark:text-gray-300 bg-slate-100 dark:bg-[#073B2E] rounded border border-slate-200 dark:border-white/10">
              ESC
            </kbd>
          )}
        </div>

        {/* Results Area */}
        <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-[#F4F6F2] dark:divide-white/5 space-y-4">
          {cleanQuery === '' ? (
            <div className="py-6 text-center text-xs text-[#68756F] dark:text-gray-300">
              <p className="font-semibold text-sm text-[#063E30] dark:text-white mb-1">
                Quick Directory Exploration
              </p>
              <p className="mb-4">Try searching for popular German cultivars, brands, or extraction methods:</p>
              <div className="flex flex-wrap gap-2 justify-center max-w-md mx-auto">
                {['Albatross', 'Solventless Rosin', 'Burn Ceramic', 'Live Resin', 'Gelato #33', 'CanG Law'].map(
                  (term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="px-2.5 py-1 rounded-lg bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 text-[11px] font-medium text-[#263A36] dark:text-gray-200 hover:border-[#07543F] dark:hover:border-emerald-400 hover:text-[#07543F] dark:hover:text-emerald-300 transition-colors"
                    >
                      {term}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Brands */}
              {matchedBrands.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#07543F] dark:text-emerald-400 mb-2">
                    <Tag className="w-3.5 h-3.5" /> Brands ({matchedBrands.length})
                  </div>
                  <div className="space-y-1">
                    {matchedBrands.map((brand) => (
                      <button
                        key={brand.id}
                        onClick={() => {
                          closeSearch();
                          navigateTo('brand-detail', brand.id);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FFFDF8] dark:hover:bg-[#041F18] border border-transparent hover:border-[#E9EDE7] dark:hover:border-white/10 flex items-center justify-between group transition-all"
                      >
                        <div>
                          <div className="font-bold text-sm text-[#263A36] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300">
                            {brand.name}
                          </div>
                          <div className="text-xs text-[#68756F] dark:text-gray-400">
                            {brand.specialty} · {brand.location}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-[#68756F] dark:text-gray-400 group-hover:text-[#F28A19] group-hover:translate-x-0.5 transition-all" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Products */}
              {matchedProducts.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#07543F] dark:text-emerald-400 mb-2">
                    <Layers className="w-3.5 h-3.5" /> Cultivars & Products ({matchedProducts.length})
                  </div>
                  <div className="space-y-1">
                    {matchedProducts.map((prod) => (
                      <button
                        key={prod.id}
                        onClick={() => {
                          closeSearch();
                          navigateTo('product-detail', prod.id);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FFFDF8] dark:hover:bg-[#041F18] border border-transparent hover:border-[#E9EDE7] dark:hover:border-white/10 flex items-center gap-3 group transition-all"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-cover border border-[#E9EDE7] dark:border-white/10"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm text-[#263A36] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300 truncate">
                            {prod.name}
                          </div>
                          <div className="text-xs text-[#68756F] dark:text-gray-400">
                            {prod.brand} · THC: {prod.thc} · {prod.strainType}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-slate-100 dark:bg-[#041F18] text-[#68756F] dark:text-gray-400 px-2 py-0.5 rounded border border-transparent dark:border-white/10">
                          {prod.labBatch}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Articles */}
              {matchedPosts.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#07543F] dark:text-emerald-400 mb-2">
                    <BookOpen className="w-3.5 h-3.5" /> Articles & Insights ({matchedPosts.length})
                  </div>
                  <div className="space-y-1">
                    {matchedPosts.map((post) => (
                      <button
                        key={post.id}
                        onClick={() => {
                          closeSearch();
                          navigateTo('blog-post', post.slug);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FFFDF8] dark:hover:bg-[#041F18] border border-transparent hover:border-[#E9EDE7] dark:hover:border-white/10 block group transition-all"
                      >
                        <div className="font-bold text-sm text-[#263A36] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300">
                          {post.title}
                        </div>
                        <div className="text-xs text-[#68756F] dark:text-gray-400 line-clamp-1">
                          {post.excerpt}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs */}
              {matchedFaqs.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#07543F] dark:text-emerald-400 mb-2">
                    <HelpCircle className="w-3.5 h-3.5" /> FAQ Answers ({matchedFaqs.length})
                  </div>
                  <div className="space-y-1">
                    {matchedFaqs.map((faq, fIdx) => (
                      <button
                        key={fIdx}
                        onClick={() => {
                          closeSearch();
                          navigateTo('faq');
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-[#FFFDF8] dark:hover:bg-[#041F18] border border-transparent hover:border-[#E9EDE7] dark:hover:border-white/10 block group transition-all"
                      >
                        <div className="font-semibold text-xs text-[#263A36] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300">
                          {faq.question}
                        </div>
                        <div className="text-xs text-[#68756F] dark:text-gray-400 line-clamp-1">
                          {faq.answer}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {matchedBrands.length === 0 &&
                matchedProducts.length === 0 &&
                matchedPosts.length === 0 &&
                matchedFaqs.length === 0 && (
                  <div className="py-8 text-center text-sm text-[#68756F] dark:text-gray-400">
                    No directory matches found for &ldquo;{query}&rdquo;. Check spelling or try a different keyword.
                  </div>
                )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FFFDF8] dark:bg-[#041F18] border-t border-[#E9EDE7] dark:border-white/10 flex items-center justify-between text-[11px] text-[#68756F] dark:text-gray-400">
          <span>Canabis Hub Central Registry</span>
          <button
            onClick={closeSearch}
            className="hover:text-[#263A36] dark:hover:text-white font-medium"
          >
            Close Search (ESC)
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRANDS_DIRECTORY, BrandItem } from '../data/cannabisData';
import {
  Tag,
  MapPin,
  ShieldCheck,
  Sprout,
  ArrowRight,
  Search,
  SlidersHorizontal,
} from 'lucide-react';

export const BrandDirectoryPage: React.FC = () => {
  const { navigateTo, pageParam } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>(
    pageParam || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');

  const categoryTabs = [
    { id: 'all', label: 'All Brands (30+)' },
    { id: 'new_brands', label: 'New Brands!' },
    { id: 'staff_picks', label: 'Staff Picks' },
    { id: 'flower_farms', label: 'Flower Farms' },
    { id: 'edibles_more', label: 'Edibles & More' },
    { id: 'vapes', label: 'Vapes' },
  ];

  const filteredBrands = BRANDS_DIRECTORY.filter((brand) => {
    const matchCat = selectedCategory === 'all' || brand.category === selectedCategory;
    const matchSearch =
      !searchQuery ||
      brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      brand.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

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
            <span className="text-[#07543F] dark:text-emerald-400 font-semibold">Brand Directory</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            OFFICIAL PARTNER INDEX
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-4">
            Curated German & European Brands
          </h1>
          <p className="text-sm sm:text-base text-[#68756F] dark:text-gray-300 max-w-3xl leading-relaxed">
            Every cultivator, extraction laboratory, and confectioner indexed on Canabis Hub undergoes rigorous third-party verification, compliance checks under German CanG laws, and heavy-metal purity validation.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categoryTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === tab.id
                    ? 'bg-[#07543F] text-white shadow-sm dark:bg-emerald-600'
                    : 'bg-white dark:bg-[#073B2E]/60 text-[#263A36] dark:text-gray-200 border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F] dark:hover:border-emerald-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#68756F] dark:text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search brands or specialties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-[#073B2E]/60 border border-[#E9EDE7] dark:border-white/10 rounded-xl text-xs text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F] dark:focus:border-emerald-400 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Brand Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white dark:bg-[#073B2E]/50 rounded-2xl p-6 border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/40 dark:hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Top Badge Strip */}
                <div className="flex items-center justify-between mb-3 text-xs">
                  <span className="font-bold text-[11px] text-[#F28A19] uppercase tracking-wider">
                    {brand.categoryLabel}
                  </span>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#07543F] dark:text-emerald-400 font-semibold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Lab Verified</span>
                  </div>
                </div>

                <h3
                  onClick={() => navigateTo('brand-detail', brand.id)}
                  className="font-extrabold text-xl text-[#063E30] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-emerald-300 cursor-pointer mb-1 transition-colors"
                >
                  {brand.name}
                </h3>

                <p className="text-xs font-medium text-[#68756F] dark:text-gray-300 italic mb-3">
                  &ldquo;{brand.tagline}&rdquo;
                </p>

                <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed mb-4 line-clamp-3">
                  {brand.description}
                </p>

                {/* Details list */}
                <div className="space-y-1.5 pt-3 border-t border-[#E9EDE7] dark:border-white/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#68756F] dark:text-gray-400">Specialty:</span>
                    <span className="font-medium text-[#263A36] dark:text-gray-200 text-right truncate max-w-[170px]">
                      {brand.specialty}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#68756F] dark:text-gray-400">Facility:</span>
                    <span className="font-medium text-[#263A36] dark:text-gray-200">{brand.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#68756F] dark:text-gray-400">Established:</span>
                    <span className="font-mono text-[#063E30] dark:text-emerald-400">{brand.founded}</span>
                  </div>
                </div>

                {/* Signature Cultivars */}
                <div className="mt-4 pt-3 border-t border-[#E9EDE7]/60 dark:border-white/10">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#68756F] dark:text-gray-400 block mb-1.5">
                    Signature Products:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {brand.signatureProducts.map((p, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 text-[10px] text-[#263A36] dark:text-gray-300"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-3">
                <button
                  onClick={() => navigateTo('brand-detail', brand.id)}
                  className="w-full py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#041F18]/80 hover:bg-[#07543F] dark:hover:bg-emerald-600 hover:text-white border border-[#E9EDE7] dark:border-white/10 hover:border-transparent text-xs font-bold text-[#063E30] dark:text-white transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Explore Brand Heritage & Cultivars</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

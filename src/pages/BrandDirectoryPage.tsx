/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CannabisBrand } from '../data/cannabisData';
import {
  ShieldCheck,
  Award,
  Flame,
  Heart,
  Droplets,
  Layers,
  Search,
  CheckCircle2,
  MapPin,
  Calendar,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const BrandDirectoryPage: React.FC = () => {
  const { brands, pageParam, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeBrandModal, setActiveBrandModal] = useState<CannabisBrand | null>(() => {
    if (pageParam) {
      return brands.find((b) => b.slug === pageParam || b.id === pageParam) || null;
    }
    return null;
  });

  const categories = [
    { key: 'all', label: 'All 30 Brands' },
    { key: 'new_brands', label: 'New Brands!', icon: Flame, color: 'text-[#F28A19]' },
    { key: 'flower_farms', label: 'Flower Farms', icon: Award, color: 'text-emerald-600' },
    { key: 'staff_picks', label: 'Staff Picks', icon: Heart, color: 'text-rose-500' },
    { key: 'edibles_more', label: 'Edibles & More', icon: Droplets, color: 'text-amber-500' },
    { key: 'vapes', label: 'Vapes', icon: Layers, color: 'text-cyan-500' },
  ];

  const filteredBrands = brands.filter((b) => {
    const matchesCat = selectedCategory === 'all' || b.category_key === selectedCategory;
    const clean = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !clean ||
      b.name.toLowerCase().includes(clean) ||
      b.specialty.toLowerCase().includes(clean) ||
      b.location.toLowerCase().includes(clean) ||
      b.tagline.toLowerCase().includes(clean);
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 inline-block">
          Official Accreditation Registry
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#063E30] dark:text-white font-['Outfit']">
          Verified Brands & Strains Directory
        </h1>
        <p className="text-xs sm:text-sm text-[#68756F] dark:text-emerald-200/80 leading-relaxed">
          Explore certified European craft producers, licensed German flower cultivation facilities, solventless extraction labs, and medical vaporizer engineers.
        </p>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4 p-4 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {categories.map((c) => {
            const isSelected = selectedCategory === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#07543F] text-white shadow-sm'
                    : 'text-[#263A36] dark:text-emerald-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/40'
                }`}
              >
                {c.icon && <c.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-[#F28A19]' : c.color}`} />}
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand, location or format..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40 text-xs font-medium text-[#263A36] dark:text-white focus:outline-hidden"
          />
        </div>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBrands.map((brand) => (
          <div
            key={brand.id}
            onClick={() => setActiveBrandModal(brand)}
            className="group p-6 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800/80 shadow-xs hover:shadow-xl hover:border-[#07543F] dark:hover:border-[#F28A19] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-3">
                <span className="font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-[#07543F] dark:text-emerald-200">
                  {brand.category_label}
                </span>
                <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-300 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F28A19]" />
                  <span>Verified</span>
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#063E30] dark:text-white group-hover:text-[#07543F] dark:group-hover:text-[#F28A19] transition-colors font-['Outfit']">
                {brand.name}
              </h3>

              <p className="text-xs font-semibold text-[#F28A19] mt-0.5">
                {brand.tagline}
              </p>

              <p className="text-xs text-[#68756F] dark:text-emerald-200/70 mt-2 line-clamp-3 leading-relaxed">
                {brand.description}
              </p>

              {/* Signature Products Preview */}
              {brand.signature_products && brand.signature_products.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E9EDE7] dark:border-emerald-800/60 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Flagship Formats:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {brand.signature_products.map((sig, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-100 dark:bg-emerald-900/40 text-slate-700 dark:text-emerald-200"
                      >
                        {sig}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-3 border-t border-[#E9EDE7] dark:border-emerald-800/60 flex items-center justify-between text-xs text-[#68756F] dark:text-emerald-200/70">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#07543F] dark:text-[#F28A19]" />
                {brand.location}
              </span>
              <span className="font-bold text-[#07543F] dark:text-[#F28A19]">Inspect Profile →</span>
            </div>
          </div>
        ))}
      </div>

      {/* Brand Detailed Modal */}
      {activeBrandModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative">
            <button
              onClick={() => setActiveBrandModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-emerald-900 text-slate-600 dark:text-white"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#07543F] text-white">
                  {activeBrandModal.category_label}
                </span>
                {activeBrandModal.lab_verified && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                    <ShieldCheck className="w-4 h-4 text-[#F28A19]" />
                    Ph. Eur. Lab Certified
                  </span>
                )}
              </div>

              <h3 className="text-2xl font-extrabold text-[#063E30] dark:text-white font-['Outfit']">
                {activeBrandModal.name}
              </h3>

              <p className="text-sm font-semibold text-[#F28A19]">
                {activeBrandModal.tagline}
              </p>

              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#07543F] dark:text-[#F28A19]" />
                  <span><strong>Headquarters:</strong> {activeBrandModal.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#07543F] dark:text-[#F28A19]" />
                  <span><strong>Established:</strong> {activeBrandModal.founded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#07543F] dark:text-[#F28A19]" />
                  <span><strong>Core Specialty:</strong> {activeBrandModal.specialty}</span>
                </div>
              </div>

              <p className="text-xs text-[#263A36] dark:text-emerald-100/90 leading-relaxed">
                {activeBrandModal.description}
              </p>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-2">
                  Signature Cultivars & Formulations:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeBrandModal.signature_products.map((p, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl text-xs font-medium bg-white dark:bg-emerald-900 border border-[#E9EDE7] dark:border-emerald-800 text-[#07543F] dark:text-emerald-200"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#E9EDE7] dark:border-emerald-800 flex justify-end">
                <button
                  onClick={() => setActiveBrandModal(null)}
                  className="py-2.5 px-6 rounded-xl bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30]"
                >
                  Close Monograph
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

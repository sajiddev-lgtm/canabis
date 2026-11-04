/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { ProductItem } from '../data/cannabisData';
import {
  Search,
  Filter,
  Bookmark,
  ShoppingBag,
  ArrowRight,
  FlaskConical,
  X,
  ShieldCheck,
  Check,
  Share2,
  SlidersHorizontal,
  ChevronDown,
  Sparkles,
  Eye,
  MessageCircle,
  Grid3X3,
  Grid2X2,
  CheckCircle2,
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const {
    navigateTo,
    allProducts,
    isItemSaved,
    toggleSaveItem,
    addToCart,
    recentlyViewedIds,
  } = useApp();

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStrain, setSelectedStrain] = useState<string>('all');
  const [selectedBadge, setSelectedBadge] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortOption, setSortOption] = useState<string>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [gridColumns, setGridColumns] = useState<'3' | '4'>('3');

  // Quick suggestion queries
  const popularSearches = [
    'Miron Violet Glass',
    'AeroPrecision Grinder',
    'Boveda 62%',
    'Carbon Travel Case',
    'Albatross Gelato',
    'Solventless Rosin',
    'Digital Scale',
    'Hemp Papers',
  ];

  // Distinct categories and brands calculated dynamically from loaded products
  const categoriesWithCounts = useMemo(() => {
    const map = new Map<string, number>();
    allProducts.forEach((p) => {
      map.set(p.category, (map.get(p.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [allProducts]);

  const brands = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.brand));
    return ['all', ...Array.from(set)];
  }, [allProducts]);

  // Featured Spotlight products
  const featuredSpotlight = useMemo(() => {
    return allProducts.filter((p) => p.isFeatured || p.badge === 'Featured').slice(0, 3);
  }, [allProducts]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((item) => {
        const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
        const matchBrand = selectedBrand === 'all' || item.brand === selectedBrand;
        const matchType = selectedType === 'all' || item.type === selectedType;
        const matchStrain =
          selectedStrain === 'all' ||
          (item.strainType && item.strainType === selectedStrain);
        const matchBadge = selectedBadge === 'all' || item.badge === selectedBadge;
        const matchStock = !inStockOnly || item.inStock !== false;
        const matchPrice = item.type !== 'permitted_merchandise' || (item.price || 0) <= maxPrice;
        const matchQuery =
          !searchQuery ||
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.sku && item.sku.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchCat && matchBrand && matchType && matchStrain && matchBadge && matchStock && matchPrice && matchQuery;
      })
      .sort((a, b) => {
        if (sortOption === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return 0;
        }
        if (sortOption === 'price_asc') return (a.price || 0) - (b.price || 0);
        if (sortOption === 'price_desc') return (b.price || 0) - (a.price || 0);
        if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
        return 0;
      });
  }, [
    allProducts,
    selectedCategory,
    selectedBrand,
    selectedType,
    selectedStrain,
    selectedBadge,
    inStockOnly,
    maxPrice,
    searchQuery,
    sortOption,
  ]);

  // Recently viewed products
  const recentProducts = useMemo(() => {
    return allProducts
      .filter((p) => recentlyViewedIds.includes(p.id))
      .slice(0, 4);
  }, [allProducts, recentlyViewedIds]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedType('all');
    setSelectedStrain('all');
    setSelectedBadge('all');
    setInStockOnly(false);
    setMaxPrice(100);
    setSearchQuery('');
    setSortOption('featured');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedType !== 'all' ||
    selectedStrain !== 'all' ||
    selectedBadge !== 'all' ||
    inStockOnly ||
    searchQuery !== '';

  // WhatsApp quick contact generator
  const getCardWhatsAppUrl = (p: ProductItem) => {
    const isPermitted = p.type === 'permitted_merchandise';
    const originUrl = typeof window !== 'undefined' ? `${window.location.origin}/?product=${p.id}` : '';
    let text = '';
    if (isPermitted) {
      text = `Hello Canabis Hub Support, I would like more information regarding the botanical accessory "${p.name}" (SKU: ${p.sku || 'N/A'}, Price: €${p.price?.toFixed(2)}). Product link: ${originUrl}`;
    } else {
      text = `Hello Canabis Hub Support, I have a general customer service question regarding the educational monograph "${p.name}" (Batch: ${p.labBatch || 'DE-LAB'}).`;
    }
    return `https://wa.me/493089204401?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-8 sm:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Main Header */}
        <div className="mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#68756F] dark:text-white/60 mb-3">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-[#07543F] dark:text-[#F28A19] font-semibold">
              Botanical Catalog & Store
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-[#E9EDE7] dark:border-white/10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1.5">
                VERIFIED GERMAN BOTANICAL HUB
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight">
                Botanical Monographs & Lawful Accessories
              </h1>
            </div>

            <div className="flex items-center gap-6 text-xs text-[#68756F] dark:text-white/70">
              <div>
                <span className="block font-mono text-xl font-extrabold text-[#063E30] dark:text-white">
                  {allProducts.length}
                </span>
                <span>Total Catalog Items</span>
              </div>
              <div className="w-px h-8 bg-[#E9EDE7] dark:bg-white/10" />
              <div>
                <span className="block font-mono text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  {allProducts.filter((p) => p.type === 'permitted_merchandise').length}
                </span>
                <span>Permitted Accessories</span>
              </div>
              <div className="w-px h-8 bg-[#E9EDE7] dark:bg-white/10" />
              <div>
                <span className="block font-mono text-xl font-extrabold text-[#F28A19]">
                  100%
                </span>
                <span>CanG Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Spotlight Bar */}
        {featuredSpotlight.length > 0 && !hasActiveFilters && (
          <div className="mb-10 bg-gradient-to-br from-[#063E30] to-[#041F18] text-white rounded-3xl p-6 sm:p-8 border border-white/10 shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F28A19]">
                <Sparkles className="w-4 h-4 text-[#F28A19]" />
                FEATURED SPOTLIGHT SELECTION
              </div>
              <span className="text-xs text-white/60 hidden sm:block">
                Hand-picked botanical essentials and certified monographs
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
              {featuredSpotlight.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigateTo('product-detail', item.id)}
                  className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/10 hover:border-[#F28A19]/50 transition-all cursor-pointer flex gap-4 group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-24 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex flex-col justify-between min-w-0">
                    <div>
                      <span className="text-[10px] font-bold text-[#F28A19] uppercase tracking-wider block">
                        {item.brand}
                      </span>
                      <h4 className="font-bold text-sm text-white truncate group-hover:text-[#F28A19] transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-[11px] text-white/70 line-clamp-1 mt-1">
                        {item.short_description || item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="font-mono text-sm font-bold text-emerald-300">
                        {item.type === 'permitted_merchandise' ? `€${item.price?.toFixed(2)}` : 'Monograph'}
                      </span>
                      <span className="text-[11px] font-semibold text-white/80 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Details <ArrowRight className="w-3 h-3 text-[#F28A19]" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search & Suggestions Bar */}
        <div className="bg-white dark:bg-[#063E30] rounded-2xl p-4 border border-[#E9EDE7] dark:border-white/10 shadow-sm mb-6 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-[#07543F] dark:text-[#F28A19] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by cultivar name, SKU (e.g. ACC-GRIND-AERO-63), brand, or material..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F] dark:focus:border-[#F28A19]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                aria-label="Clear search query"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Suggestion Search Chips */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs scrollbar-none pt-1">
            <span className="text-[11px] font-bold text-[#68756F] dark:text-white/50 shrink-0">
              Popular Searches:
            </span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-2.5 py-1 rounded-lg bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-[11px] text-[#263A36] dark:text-white/80 hover:border-[#07543F] dark:hover:border-[#F28A19] whitespace-nowrap transition-colors"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Category Filter Horizontal Segment */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#07543F] text-white shadow-sm'
                : 'bg-white dark:bg-[#063E30] text-[#263A36] dark:text-white/80 border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]'
            }`}
          >
            All Categories ({allProducts.length})
          </button>
          {categoriesWithCounts.map(({ name, count }) => (
            <button
              key={name}
              onClick={() => setSelectedCategory(name)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === name
                  ? 'bg-[#07543F] text-white shadow-sm'
                  : 'bg-white dark:bg-[#063E30] text-[#263A36] dark:text-white/80 border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]'
              }`}
            >
              {name} ({count})
            </button>
          ))}
        </div>

        {/* Toolbar: Mobile Filters Toggle, Active Filter Chips, Sorting, Grid Density */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#E9EDE7] dark:border-white/10">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-white dark:bg-[#063E30] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5 text-[#F28A19]" />
              Filter Catalog
            </button>

            {/* Active Chips */}
            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] text-xs font-bold flex items-center gap-1.5">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')} aria-label="Remove category filter">✕</button>
              </span>
            )}

            {selectedType !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] text-xs font-bold flex items-center gap-1.5">
                {selectedType === 'permitted_merchandise' ? 'Permitted Accessories' : 'Cannabis Monographs'}
                <button onClick={() => setSelectedType('all')} aria-label="Remove type filter">✕</button>
              </span>
            )}

            {selectedBadge !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] text-xs font-bold flex items-center gap-1.5">
                Badge: {selectedBadge}
                <button onClick={() => setSelectedBadge('all')} aria-label="Remove badge filter">✕</button>
              </span>
            )}

            {selectedBrand !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] text-xs font-bold flex items-center gap-1.5">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand('all')} aria-label="Remove brand filter">✕</button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-500 hover:underline ml-2"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="text-[#68756F] dark:text-white/60">
              Showing <strong className="text-[#063E30] dark:text-white">{filteredProducts.length}</strong> items
            </span>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-[#68756F] dark:text-white/50 hidden sm:inline">Sort:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#063E30] border border-[#E9EDE7] dark:border-white/10 text-xs font-semibold text-[#263A36] dark:text-white focus:outline-none"
              >
                <option value="featured">Featured First</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name_asc">Alphabetical: A to Z</option>
              </select>
            </div>

            {/* Grid Density Toggle (Desktop) */}
            <div className="hidden sm:flex items-center gap-1 p-1 bg-white dark:bg-[#063E30] rounded-xl border border-[#E9EDE7] dark:border-white/10">
              <button
                onClick={() => setGridColumns('3')}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridColumns === '3' ? 'bg-[#07543F] text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="3 Columns Grid"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns('4')}
                className={`p-1.5 rounded-lg transition-colors ${
                  gridColumns === '4' ? 'bg-[#07543F] text-white' : 'text-slate-400 hover:text-slate-700'
                }`}
                title="4 Columns Grid"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Layout Grid: Desktop Sidebar Filter (3 cols) + Product Cards (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-[#063E30] p-6 rounded-3xl border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EDE7] dark:border-white/10">
              <span className="font-bold text-xs uppercase tracking-wider text-[#063E30] dark:text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#F28A19]" />
                Filter Catalog
              </span>
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#F28A19] font-bold hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Classification Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-2.5">
                Classification Type
              </label>
              <div className="space-y-2 text-xs text-[#263A36] dark:text-white/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === 'all'}
                    onChange={() => setSelectedType('all')}
                    className="text-[#07543F]"
                  />
                  <span>All Catalog Items ({allProducts.length})</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === 'permitted_merchandise'}
                    onChange={() => setSelectedType('permitted_merchandise')}
                    className="text-[#07543F]"
                  />
                  <span className="text-[#07543F] dark:text-emerald-400 font-semibold">
                    Permitted Accessories (24)
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === 'informational'}
                    onChange={() => setSelectedType('informational')}
                    className="text-[#07543F]"
                  />
                  <span>Cannabis Monographs (8)</span>
                </label>
              </div>
            </div>

            {/* Badges / Highlights */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-2.5">
                Product Badges
              </label>
              <div className="flex flex-wrap gap-1.5 text-xs">
                {['all', 'Featured', 'Popular', 'New'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBadge(b)}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition-all ${
                      selectedBadge === b
                        ? 'bg-[#07543F] text-white border-transparent'
                        : 'border-[#E9EDE7] dark:border-white/10 text-[#263A36] dark:text-white/80 hover:border-[#07543F]'
                    }`}
                  >
                    {b === 'all' ? 'All Badges' : b}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-2">
                Brand / Manufacturer
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-xs text-[#263A36] dark:text-white"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'All Brands & Cultivators' : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Slider for Accessories */}
            <div>
              <div className="flex justify-between items-center mb-1 text-xs">
                <label className="font-bold uppercase tracking-wider text-[#063E30] dark:text-white">
                  Max Accessory Price
                </label>
                <span className="font-mono font-bold text-[#07543F] dark:text-emerald-400">
                  €{maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#07543F]"
              />
              <span className="text-[10px] text-[#68756F] dark:text-white/50 block mt-1">
                Applies only to permitted hardware & storage items
              </span>
            </div>

            {/* In Stock Filter */}
            <div className="pt-3 border-t border-[#E9EDE7] dark:border-white/10">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#263A36] dark:text-white/80">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#07543F] focus:ring-0"
                />
                <span className="font-semibold">In Stock & Verified Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area (9 cols) */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <div className="py-20 bg-white dark:bg-[#063E30] rounded-3xl border border-[#E9EDE7] dark:border-white/10 p-8 text-center space-y-4">
                <FlaskConical className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto" />
                <h3 className="font-bold text-lg text-[#063E30] dark:text-white">
                  No Matching Products Found
                </h3>
                <p className="text-xs text-[#68756F] dark:text-white/60 max-w-sm mx-auto">
                  Adjust your search terms or reset filters to explore our full botanical directory.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#07543F] text-white text-xs font-bold rounded-xl"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-6 ${
                  gridColumns === '4' ? 'lg:grid-cols-3 xl:grid-cols-4' : 'lg:grid-cols-3'
                }`}
              >
                {filteredProducts.map((p) => {
                  const saved = isItemSaved(p.id);
                  const isPermitted = p.type === 'permitted_merchandise';

                  return (
                    <article
                      key={p.id}
                      className="bg-white dark:bg-[#063E30] rounded-3xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/50 dark:hover:border-[#F28A19]/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Container with Consistent Aspect Ratio */}
                        <div className="aspect-square bg-[#F4F6F2] dark:bg-[#073B2E]/50 p-5 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={p.image}
                            alt={p.name}
                            loading="lazy"
                            className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                          />

                          {/* Top Badges */}
                          <div className="absolute top-5 left-5 flex flex-col gap-1.5 pointer-events-none">
                            {p.badge && (
                              <span className="px-2.5 py-0.5 rounded-md bg-[#F28A19] text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                                {p.badge}
                              </span>
                            )}
                            <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-md ${
                              isPermitted
                                ? 'bg-[#07543F]/90 text-white'
                                : 'bg-[#041F18]/85 text-white'
                            }`}>
                              {isPermitted ? 'Permitted Accessory' : (p.strainType || 'Monograph')}
                            </span>
                          </div>

                          {/* Interactive Wishlist Button (Immediate Feedback) */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSaveItem(p.id);
                            }}
                            className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${
                              saved
                                ? 'bg-[#F28A19] text-white scale-110 shadow-lg'
                                : 'bg-white/90 dark:bg-[#063E30]/90 text-[#263A36] dark:text-white hover:text-[#07543F] dark:hover:text-[#F28A19]'
                            }`}
                            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
                            title={saved ? 'Remove from wishlist' : 'Save to wishlist'}
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                          </button>
                        </div>

                        {/* Card Content */}
                        <div className="p-5">
                          {/* Unboxed Metadata Line (anti-slop rule) */}
                          <div className="flex items-center justify-between text-xs mb-1.5 text-[#68756F] dark:text-white/60">
                            <span className="font-bold text-[11px] text-[#F28A19] uppercase tracking-wider">
                              {p.brand}
                            </span>
                            <span className="font-mono text-[10px]">
                              {p.sku || p.labBatch}
                            </span>
                          </div>

                          <h3
                            onClick={() => navigateTo('product-detail', p.id)}
                            className="font-extrabold text-base text-[#063E30] dark:text-white hover:text-[#07543F] dark:hover:text-[#F28A19] cursor-pointer mb-2 line-clamp-1 transition-colors"
                          >
                            {p.name}
                          </h3>

                          <p className="text-xs text-[#68756F] dark:text-white/70 line-clamp-2 leading-relaxed mb-4">
                            {p.short_description || p.description}
                          </p>

                          {/* Pricing or Monograph Notice */}
                          <div className="pt-3 border-t border-[#E9EDE7] dark:border-white/10 flex items-baseline justify-between">
                            {isPermitted ? (
                              <>
                                <span className="text-xs text-[#68756F] dark:text-white/60">
                                  Retail Price:
                                </span>
                                <span className="font-mono text-lg font-extrabold text-[#07543F] dark:text-emerald-400">
                                  €{p.price?.toFixed(2)}
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="text-xs text-[#68756F] dark:text-white/60">
                                  THC: <strong className="text-[#07543F] dark:text-emerald-400">{p.thc}</strong>
                                </span>
                                <span className="text-[10px] font-bold text-[#F28A19] uppercase tracking-wider">
                                  Non-Commercial
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Interactive Footer CTAs */}
                      <div className="px-5 pb-5 pt-0 space-y-2">
                        {isPermitted ? (
                          <div className="flex items-center gap-2">
                            {/* Add to Bag Button */}
                            <button
                              onClick={() => addToCart(p, 1)}
                              className="flex-1 py-2.5 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Bag</span>
                            </button>

                            {/* View Full Product Page */}
                            <button
                              onClick={() => navigateTo('product-detail', p.id)}
                              className="px-3 py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F] text-xs font-bold text-[#063E30] dark:text-white transition-all"
                              title="View dedicated product details"
                            >
                              Details
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            {/* View Monograph Button */}
                            <button
                              onClick={() => navigateTo('product-detail', p.id)}
                              className="flex-1 py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] hover:bg-[#07543F] dark:hover:bg-[#07543F] hover:text-white border border-[#E9EDE7] dark:border-white/10 text-xs font-bold text-[#063E30] dark:text-white transition-all flex items-center justify-center gap-1.5"
                            >
                              <span>View Monograph</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>

                            {/* WhatsApp Inquiry Button */}
                            <a
                              href={getCardWhatsAppUrl(p)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-[#25D366] hover:bg-[#25D366] hover:text-white border border-emerald-200 dark:border-emerald-800 transition-all flex items-center justify-center"
                              title="Ask about this monograph on WhatsApp"
                            >
                              <MessageCircle className="w-4 h-4 fill-current" />
                            </a>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recently Viewed Products Section */}
        {recentProducts.length > 0 && (
          <section aria-labelledby="recently-viewed-heading" className="mt-16 pt-10 border-t border-[#E9EDE7] dark:border-white/10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
                  BROWSING HISTORY
                </span>
                <h2 id="recently-viewed-heading" className="text-xl sm:text-2xl font-extrabold text-[#063E30] dark:text-white">
                  Recently Viewed Products
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigateTo('product-detail', item.id)}
                  className="p-3 bg-white dark:bg-[#063E30] rounded-2xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F] cursor-pointer flex items-center gap-3 transition-all group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-[#063E30] dark:text-white truncate group-hover:text-[#F28A19] transition-colors">
                      {item.name}
                    </p>
                    <span className="text-[11px] font-semibold text-[#07543F] dark:text-emerald-400">
                      {item.type === 'permitted_merchandise' ? `€${item.price?.toFixed(2)}` : 'Monograph'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden animate-fadeIn">
          <div className="bg-white dark:bg-[#063E30] w-full max-w-sm h-full p-6 overflow-y-auto space-y-6 text-[#263A36] dark:text-white">
            <div className="flex items-center justify-between pb-4 border-b border-[#E9EDE7] dark:border-white/10">
              <h3 className="font-extrabold text-base">Filter Catalog</h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Classification */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Classification Type
              </label>
              <div className="space-y-2 text-xs">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mobile-type"
                    checked={selectedType === 'all'}
                    onChange={() => setSelectedType('all')}
                  />
                  <span>All Catalog Items</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mobile-type"
                    checked={selectedType === 'permitted_merchandise'}
                    onChange={() => setSelectedType('permitted_merchandise')}
                  />
                  <span>Permitted Accessories</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="mobile-type"
                    checked={selectedType === 'informational'}
                    onChange={() => setSelectedType('informational')}
                  />
                  <span>Cannabis Monographs</span>
                </label>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-xs"
              >
                <option value="all">All Categories</option>
                {categoriesWithCounts.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brands */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Brand
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-xs"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'All Brands' : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Badges */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2">
                Badges
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {['all', 'Featured', 'Popular', 'New'].map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBadge(b)}
                    className={`py-2 px-3 rounded-xl border text-xs font-medium ${
                      selectedBadge === b ? 'bg-[#07543F] text-white' : 'border-[#E9EDE7] dark:border-white/10'
                    }`}
                  >
                    {b === 'all' ? 'All' : b}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-[#E9EDE7] dark:border-white/10 flex gap-3">
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="flex-1 py-3 border border-[#E9EDE7] dark:border-white/10 text-xs font-bold rounded-xl"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#07543F] text-white text-xs font-bold rounded-xl"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

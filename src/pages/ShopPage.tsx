/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PRODUCTS_DATA, ProductItem } from '../data/cannabisData';
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
} from 'lucide-react';

export const ShopPage: React.FC = () => {
  const { navigateTo, isItemSaved, toggleSaveItem, addToCart } = useApp();

  // Database-backed products
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStrain, setSelectedStrain] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(100);
  const [sortOption, setSortOption] = useState<string>('default');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [activeModalProduct, setActiveModalProduct] = useState<any | null>(null);

  // Recent & Popular searches
  const popularSearches = ['Albatross', 'Solventless Rosin', 'Miron Glass Jars', 'Boveda 62%', 'Burn Ceramic Pod', 'Gelato #33'];
  const [recentSearches, setRecentSearches] = useState<string[]>(['Albatross', 'Live Rosin']);

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAllProducts(data);
        } else {
          setAllProducts(PRODUCTS_DATA);
        }
        setIsLoading(false);
      })
      .catch(() => {
        setAllProducts(PRODUCTS_DATA);
        setIsLoading(false);
      });
  }, []);

  // Distinct categories and brands
  const categories = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.category));
    return ['all', ...Array.from(set)];
  }, [allProducts]);

  const brands = useMemo(() => {
    const set = new Set(allProducts.map((p) => p.brand));
    return ['all', ...Array.from(set)];
  }, [allProducts]);

  // Dynamic filtered products
  const filteredProducts = useMemo(() => {
    return allProducts.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchBrand = selectedBrand === 'all' || item.brand === selectedBrand;
      const matchType = selectedType === 'all' || item.type === selectedType;
      const matchStrain =
        selectedStrain === 'all' ||
        (item.strainType && item.strainType === selectedStrain);
      const matchStock = !inStockOnly || item.in_stock || item.inStock;
      const matchPrice = item.type !== 'permitted_merchandise' || (item.price || 0) <= maxPrice;
      const matchQuery =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchBrand && matchType && matchStrain && matchStock && matchPrice && matchQuery;
    }).sort((a, b) => {
      if (sortOption === 'price_asc') return (a.price || 0) - (b.price || 0);
      if (sortOption === 'price_desc') return (b.price || 0) - (a.price || 0);
      if (sortOption === 'name_asc') return a.name.localeCompare(b.name);
      return 0;
    });
  }, [allProducts, selectedCategory, selectedBrand, selectedType, selectedStrain, inStockOnly, maxPrice, searchQuery, sortOption]);

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSelectedType('all');
    setSelectedStrain('all');
    setInStockOnly(false);
    setMaxPrice(100);
    setSearchQuery('');
    setSortOption('default');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrand !== 'all' ||
    selectedType !== 'all' ||
    selectedStrain !== 'all' ||
    inStockOnly ||
    searchQuery !== '';

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-[#68756F] dark:text-white/60 mb-2">
            <button onClick={() => navigateTo('home')} className="hover:text-[#07543F] dark:hover:text-[#F28A19]">
              Home
            </button>
            <span>/</span>
            <span className="text-[#07543F] dark:text-[#F28A19] font-semibold">Catalog & Marketplace</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
                DISCOVERY & ACCREDITATION HUB
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight">
                Botanical Monographs & Lawful Accessories
              </h1>
            </div>
            <p className="text-xs text-[#68756F] dark:text-white/60 max-w-md">
              Explore lab-verified cultivars (strictly non-transactional) and order lawful botanical equipment & storage accessories.
            </p>
          </div>
        </div>

        {/* Large Search Bar with Instant Suggestions */}
        <div className="bg-white dark:bg-[#063E30] rounded-2xl p-4 border border-[#E9EDE7] dark:border-white/10 shadow-sm mb-8 space-y-3">
          <div className="relative">
            <Search className="w-5 h-5 text-[#07543F] dark:text-[#F28A19] absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by cultivar, extraction method, brand, or accessory SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs scrollbar-none pt-1">
            <span className="text-[11px] font-bold text-[#68756F] dark:text-white/50 shrink-0">
              Popular Searches:
            </span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => setSearchQuery(term)}
                className="px-2.5 py-1 rounded-lg bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-[11px] text-[#263A36] dark:text-white/80 hover:border-[#07543F] whitespace-nowrap"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filter Chips & Sorting Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-white dark:bg-[#063E30] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-xs font-bold flex items-center gap-2"
            >
              <Filter className="w-3.5 h-3.5 text-[#F28A19]" />
              Filters
            </button>

            {/* Active Chips */}
            {selectedCategory !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] text-xs font-bold flex items-center gap-1">
                Cat: {selectedCategory}
                <button onClick={() => setSelectedCategory('all')}>✕</button>
              </span>
            )}
            {selectedBrand !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] text-xs font-bold flex items-center gap-1">
                Brand: {selectedBrand}
                <button onClick={() => setSelectedBrand('all')}>✕</button>
              </span>
            )}
            {selectedType !== 'all' && (
              <span className="px-2.5 py-1 rounded-lg bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] text-xs font-bold flex items-center gap-1">
                {selectedType === 'informational' ? 'Informational Only' : 'Permitted Merchandise'}
                <button onClick={() => setSelectedType('all')}>✕</button>
              </span>
            )}

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-500 hover:underline ml-1"
              >
                Reset All Filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="text-[#68756F] dark:text-white/60">
              Showing <strong className="text-[#063E30] dark:text-white">{filteredProducts.length}</strong> listings
            </span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#063E30] border border-[#E9EDE7] dark:border-white/10 text-xs font-semibold text-[#263A36] dark:text-white focus:outline-none"
            >
              <option value="default">Sort: Default Order</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Main Layout Grid: Desktop Sidebar Filter (3 cols) + Product Cards (9 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 bg-white dark:bg-[#063E30] p-6 rounded-3xl border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-6 sticky top-28">
            <div className="flex items-center justify-between pb-3 border-b border-[#E9EDE7] dark:border-white/10">
              <span className="font-bold text-sm uppercase tracking-wider text-[#063E30] dark:text-white">
                Filter Catalog
              </span>
              {hasActiveFilters && (
                <button onClick={clearAllFilters} className="text-xs text-[#F28A19] font-bold hover:underline">
                  Clear All
                </button>
              )}
            </div>

            {/* Classification Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-2">
                Classification Type
              </label>
              <div className="space-y-1.5 text-xs text-[#263A36] dark:text-white/80">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === 'all'}
                    onChange={() => setSelectedType('all')}
                    className="text-[#07543F]"
                  />
                  <span>All Catalog Items</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === 'informational'}
                    onChange={() => setSelectedType('informational')}
                    className="text-[#07543F]"
                  />
                  <span>Cannabis Monographs (Non-Sale)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="type"
                    checked={selectedType === 'permitted_merchandise'}
                    onChange={() => setSelectedType('permitted_merchandise')}
                    className="text-[#07543F]"
                  />
                  <span>Permitted Botanical Accessories</span>
                </label>
              </div>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-2">
                Categories
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-xs text-[#263A36] dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c === 'all' ? 'All Categories' : c}
                  </option>
                ))}
              </select>
            </div>

            {/* Brands */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-2">
                Brands & Cultivators
              </label>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-xs text-[#263A36] dark:text-white"
              >
                {brands.map((b) => (
                  <option key={b} value={b}>
                    {b === 'all' ? 'All Brands' : b}
                  </option>
                ))}
              </select>
            </div>

            {/* Strain Filter */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-2">
                Genetics (Cannabis)
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {['all', 'Sativa', 'Indica', 'Hybrid'].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedStrain(s)}
                    className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      selectedStrain === s
                        ? 'bg-[#07543F] text-white border-transparent'
                        : 'border-[#E9EDE7] dark:border-white/10 text-[#263A36] dark:text-white/80'
                    }`}
                  >
                    {s === 'all' ? 'All' : s}
                  </button>
                ))}
              </div>
            </div>

            {/* In Stock Toggle */}
            <div className="pt-2 border-t border-[#E9EDE7] dark:border-white/10">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-[#263A36] dark:text-white/80">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="rounded text-[#07543F] focus:ring-0"
                />
                <span className="font-semibold">In Stock Only</span>
              </label>
            </div>
          </aside>

          {/* Product Grid Area (9 cols) */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <div className="py-20 text-center text-xs text-[#68756F] dark:text-white/60">
                Loading authentic monograph database...
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 bg-white dark:bg-[#063E30] rounded-3xl border border-[#E9EDE7] dark:border-white/10 p-8 text-center space-y-4">
                <FlaskConical className="w-12 h-12 text-slate-300 dark:text-white/20 mx-auto" />
                <h3 className="font-bold text-lg text-[#063E30] dark:text-white">
                  No Matching Records Found
                </h3>
                <p className="text-xs text-[#68756F] dark:text-white/60 max-w-sm mx-auto">
                  Adjust your search terms or reset filters to explore our full directory.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-[#07543F] text-white text-xs font-bold rounded-xl"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((p) => {
                  const saved = isItemSaved(p.id);
                  const isPermitted = p.type === 'permitted_merchandise';

                  return (
                    <div
                      key={p.id}
                      className="bg-white dark:bg-[#063E30] rounded-2xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/50 dark:hover:border-[#F28A19]/50 hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Container */}
                        <div className="aspect-square bg-[#F4F6F2] dark:bg-[#073B2E]/50 p-4 relative overflow-hidden flex items-center justify-center">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                          />
                          <button
                            onClick={() => toggleSaveItem(p.id)}
                            className={`absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                              saved
                                ? 'bg-[#F28A19] text-white'
                                : 'bg-white/90 dark:bg-[#063E30]/90 text-[#263A36] dark:text-white hover:text-[#07543F]'
                            }`}
                            title={saved ? 'Remove from Wishlist' : 'Save Monograph'}
                          >
                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                          </button>

                          <span className={`absolute bottom-6 left-6 px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm ${
                            isPermitted
                              ? 'bg-[#07543F]/85 text-white'
                              : 'bg-black/60 text-white'
                          }`}>
                            {isPermitted ? 'Permitted Accessory' : (p.strainType || 'Cannabis')}
                          </span>
                        </div>

                        {/* Details */}
                        <div className="p-5">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-bold text-[10px] text-[#F28A19] uppercase tracking-wider">
                              {p.brand}
                            </span>
                            <span className="text-[10px] font-mono text-[#68756F] dark:text-white/50">
                              {p.labBatch || p.lab_batch || p.sku}
                            </span>
                          </div>

                          <h3
                            onClick={() => setActiveModalProduct(p)}
                            className="font-bold text-sm sm:text-base text-[#063E30] dark:text-white hover:text-[#07543F] dark:hover:text-[#F28A19] cursor-pointer mb-2 line-clamp-1"
                          >
                            {p.name}
                          </h3>

                          <p className="text-xs text-[#68756F] dark:text-white/70 line-clamp-2 leading-relaxed mb-4">
                            {p.description}
                          </p>

                          {/* Technical Attributes */}
                          <div className="pt-3 border-t border-[#E9EDE7] dark:border-white/10 text-xs space-y-1">
                            {isPermitted ? (
                              <div className="flex justify-between items-center">
                                <span className="text-[#68756F] dark:text-white/60">Retail Price:</span>
                                <span className="font-mono text-base font-extrabold text-[#07543F] dark:text-emerald-400">
                                  €{p.price?.toFixed(2)}
                                </span>
                              </div>
                            ) : (
                              <>
                                <div className="flex justify-between">
                                  <span className="text-[#68756F] dark:text-white/60">Potency:</span>
                                  <span className="font-semibold text-[#07543F] dark:text-emerald-400">
                                    THC {p.thc} {p.cbd ? `· CBD ${p.cbd}` : ''}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-[#68756F] dark:text-white/60">Notice:</span>
                                  <span className="text-[10px] text-[#F28A19] font-bold">
                                    Non-Commercial Listing
                                  </span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Bottom CTA */}
                      <div className="px-5 pb-5 pt-0">
                        {isPermitted ? (
                          <button
                            onClick={() => addToCart(p, 1)}
                            className="w-full py-2.5 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            <span>Add to Bag (€{p.price?.toFixed(2)})</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveModalProduct(p)}
                            className="w-full py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] hover:bg-[#07543F] dark:hover:bg-[#07543F] hover:text-white border border-[#E9EDE7] dark:border-white/10 text-xs font-bold text-[#063E30] dark:text-white transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Inspect Lab Monograph</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Detail Modal */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#063E30] text-[#263A36] dark:text-white rounded-3xl max-w-2xl w-full p-8 border border-[#E9EDE7] dark:border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-start">
              <div className="sm:col-span-5">
                <img
                  src={activeModalProduct.image}
                  alt={activeModalProduct.name}
                  className="w-full aspect-square rounded-2xl object-cover border border-[#E9EDE7] dark:border-white/10 shadow-sm"
                />
                <div className="mt-3 p-3 bg-[#FFFDF8] dark:bg-[#073B2E] rounded-xl border border-[#E9EDE7] dark:border-white/10 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-[#68756F] dark:text-white/60">Batch ID:</span>
                    <span className="font-mono font-semibold text-[#063E30] dark:text-white">
                      {activeModalProduct.labBatch || activeModalProduct.lab_batch || 'DE-LAB-2026'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#68756F] dark:text-white/60">Standard:</span>
                    <span className="font-semibold text-emerald-600">ISO/IEC 17025</span>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-7 space-y-4">
                <div>
                  <span className="text-xs font-bold text-[#F28A19] uppercase tracking-wider">
                    {activeModalProduct.brand} · {activeModalProduct.category}
                  </span>
                  <h2 className="text-2xl font-extrabold text-[#063E30] dark:text-white mt-1">
                    {activeModalProduct.name}
                  </h2>
                </div>

                <p className="text-sm text-[#68756F] dark:text-white/80 leading-relaxed">
                  {activeModalProduct.description}
                </p>

                {activeModalProduct.type === 'permitted_merchandise' ? (
                  <div className="p-4 bg-[#FFFDF8] dark:bg-[#073B2E] rounded-xl border border-[#E9EDE7] dark:border-white/10 flex items-center justify-between">
                    <span className="text-xs font-bold">Authorized Price:</span>
                    <span className="font-mono text-xl font-extrabold text-[#07543F] dark:text-emerald-400">
                      €{activeModalProduct.price?.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#FFFDF8] dark:bg-[#073B2E] rounded-xl border border-[#E9EDE7] dark:border-white/10 text-xs">
                    <div>
                      <span className="text-[#68756F] dark:text-white/60 block">THC Level</span>
                      <span className="font-bold text-[#063E30] dark:text-white text-sm">{activeModalProduct.thc}</span>
                    </div>
                    <div>
                      <span className="text-[#68756F] dark:text-white/60 block">CBD Level</span>
                      <span className="font-bold text-[#063E30] dark:text-white text-sm">{activeModalProduct.cbd}</span>
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-3">
                  {activeModalProduct.type === 'permitted_merchandise' ? (
                    <button
                      onClick={() => {
                        addToCart(activeModalProduct, 1);
                        setActiveModalProduct(null);
                      }}
                      className="flex-1 py-3 bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold text-xs uppercase rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add to Accessories Bag
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleSaveItem(activeModalProduct.id)}
                      className={`flex-1 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                        isItemSaved(activeModalProduct.id)
                          ? 'bg-[#F28A19] text-white'
                          : 'bg-[#07543F] text-white hover:bg-[#063E30]'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" />
                      {isItemSaved(activeModalProduct.id) ? 'Saved to Wishlist' : 'Save Monograph'}
                    </button>
                  )}
                  <button
                    onClick={() => setActiveModalProduct(null)}
                    className="px-5 py-3 border border-[#E9EDE7] dark:border-white/10 text-xs font-semibold rounded-xl"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

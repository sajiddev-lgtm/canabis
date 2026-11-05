/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp, PageRoute } from '../context/AppContext';
import {
  Search,
  ShoppingBag,
  Moon,
  Sun,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
  Menu,
  X,
  Bookmark,
  ExternalLink,
  Flame,
  Award,
  Layers,
  Heart,
  Droplets,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    theme,
    toggleTheme,
    cart,
    openCart,
    openSearch,
    currentUser,
    logout,
    savedProductIds,
    brands,
  } = useApp();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter 5 columns
  const newBrands = brands.filter((b) => b.category_key === 'new_brands');
  const flowerFarms = brands.filter((b) => b.category_key === 'flower_farms');
  const staffPicks = brands.filter((b) => b.category_key === 'staff_picks');
  const ediblesMore = brands.filter((b) => b.category_key === 'edibles_more');
  const vapes = brands.filter((b) => b.category_key === 'vapes');

  const handleBrandClick = (brandSlug: string) => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigateTo('brands', brandSlug);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-colors">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#063E30] text-emerald-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F28A19] text-[#063E30] text-[10px] font-bold">
              ✓
            </span>
            <span className="font-medium tracking-wide">
              Offizielles deutsches Cannabis-Informationsportal & CanG-zertifiziertes Verzeichnis · 21+ Nur für Erwachsene
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-emerald-200/80">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F28A19]" />
              Ph. Eur. Laborzertifiziert
            </span>
            <span>·</span>
            <span>Berlin HQ · CanG § 5 Konform</span>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="bg-[#FFFDF8]/95 dark:bg-[#063E30]/95 backdrop-blur-md border-b border-[#E9EDE7] dark:border-emerald-900/60 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-3 text-left group focus:outline-hidden"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#07543F] to-[#063E30] text-emerald-400 p-2 shadow-md group-hover:shadow-[#07543F]/20 transition-all flex items-center justify-center border border-emerald-500/20">
              {/* Stylized Cannabis Leaf Emblem */}
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#F28A19]">
                <path d="M12 2C12 2 13.5 6.5 15.5 8C17.5 9.5 21 8.5 21 8.5C21 8.5 19 12 17.5 13.5C16 15 17 19 17 19C17 19 13.5 17.5 12 18.5C10.5 17.5 7 19 7 19C7 19 8 15 6.5 13.5C5 12 3 8.5 3 8.5C3 8.5 6.5 9.5 8.5 8C10.5 6.5 12 2 12 2Z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-[#07543F] dark:text-emerald-400 font-['Outfit']">
                  CANABIS
                </span>
                <span className="text-xl font-bold tracking-tight text-[#F28A19] font-['Outfit']">
                  HUB
                </span>
                <span className="ml-1 text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/80 text-[#07543F] dark:text-emerald-300 uppercase">
                  DE
                </span>
              </div>
              <p className="text-[10px] tracking-wider uppercase text-[#68756F] dark:text-emerald-200/60 font-medium">
                German Cannabis Authority
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1" ref={megaMenuRef}>
            {/* Mega Menu Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isMegaMenuOpen || currentPage === 'brands'
                    ? 'text-[#07543F] dark:text-[#F28A19] bg-emerald-50 dark:bg-emerald-900/40'
                    : 'text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19]'
                }`}
              >
                <span>Brands & Strains</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-[#F28A19]' : ''}`} />
              </button>

              {/* 5-Column Mega Menu Dropdown */}
              {isMegaMenuOpen && (
                <div className="absolute top-full -left-20 w-[940px] mt-3 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 rounded-2xl shadow-2xl p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E9EDE7] dark:border-emerald-800/80">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#F28A19]" />
                      <span className="font-bold text-base text-[#063E30] dark:text-white">
                        Curated German & European Cannabis Catalog
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        navigateTo('brands');
                      }}
                      className="text-xs font-semibold text-[#07543F] dark:text-[#F28A19] hover:underline flex items-center gap-1"
                    >
                      View All 30 Brands
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* 5-Column Grid */}
                  <div className="grid grid-cols-5 gap-6 text-sm">
                    {/* Col 1: New Brands */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#F28A19] pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Flame className="w-3.5 h-3.5" />
                        New Brands!
                      </div>
                      <ul className="space-y-2">
                        {newBrands.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#F28A19] dark:hover:text-[#F28A19] transition-colors py-0.5 block w-full truncate"
                            >
                              {b.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 2: Flower Farms */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#07543F] dark:text-emerald-300 pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Award className="w-3.5 h-3.5" />
                        Flower Farms
                      </div>
                      <ul className="space-y-2">
                        {flowerFarms.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors py-0.5 block w-full truncate"
                            >
                              {b.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 3: Staff Picks */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300 pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Staff Picks
                      </div>
                      <ul className="space-y-2">
                        {staffPicks.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors py-0.5 block w-full truncate"
                            >
                              {b.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 4: Edibles & More */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Droplets className="w-3.5 h-3.5" />
                        Edibles & More
                      </div>
                      <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {ediblesMore.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors py-0.5 block w-full truncate"
                            >
                              {b.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 5: Vapes */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-cyan-700 dark:text-cyan-400 pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Layers className="w-3.5 h-3.5" />
                        Vapes & Hardware
                      </div>
                      <ul className="space-y-2">
                        {vapes.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors py-0.5 block w-full truncate"
                            >
                              {b.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Mega Menu Footer Banner */}
                  <div className="mt-6 pt-4 border-t border-[#E9EDE7] dark:border-emerald-800/80 flex items-center justify-between text-xs text-[#68756F] dark:text-emerald-200/70">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>All listed cultivators adhere to Ph. Eur. monograph thresholds with verifiable analytical COAs.</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        navigateTo('legal');
                      }}
                      className="font-semibold text-[#07543F] dark:text-[#F28A19] hover:underline"
                    >
                      CanG Regulatory Compliance Guide →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Category Links */}
            <button
              onClick={() => navigateTo('flower')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === 'flower'
                  ? 'text-[#07543F] dark:text-[#F28A19] bg-emerald-50 dark:bg-emerald-900/40'
                  : 'text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19]'
              }`}
            >
              Flower Farms
            </button>

            <button
              onClick={() => navigateTo('edibles')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === 'edibles'
                  ? 'text-[#07543F] dark:text-[#F28A19] bg-emerald-50 dark:bg-emerald-900/40'
                  : 'text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19]'
              }`}
            >
              Edibles
            </button>

            <button
              onClick={() => navigateTo('vapes')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === 'vapes'
                  ? 'text-[#07543F] dark:text-[#F28A19] bg-emerald-50 dark:bg-emerald-900/40'
                  : 'text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19]'
              }`}
            >
              Vapes
            </button>

            <button
              onClick={() => navigateTo('legal')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                currentPage === 'legal'
                  ? 'text-[#07543F] dark:text-[#F28A19] bg-emerald-50 dark:bg-emerald-900/40'
                  : 'text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19]'
              }`}
            >
              Legal & CanG
            </button>

            {/* Hardware & Accessories Shop Link */}
            <button
              onClick={() => navigateTo('shop')}
              className={`relative px-3.5 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-1.5 ${
                currentPage === 'shop'
                  ? 'bg-[#F28A19] text-white shadow-sm'
                  : 'text-[#F28A19] hover:bg-orange-50 dark:hover:bg-orange-950/30'
              }`}
            >
              <span>Storage & Accessories</span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-[#07543F] text-emerald-200 px-1.5 py-0.2 rounded-full">
                Shop
              </span>
            </button>
          </nav>

          {/* Right Utility Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Trigger */}
            <button
              onClick={openSearch}
              className="p-2.5 rounded-xl text-[#263A36] dark:text-emerald-100 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors"
              title="Search cultivars, terpenes & brands"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-[#263A36] dark:text-emerald-100 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Saved Monographs Bookmark */}
            <button
              onClick={() => {
                if (currentUser) {
                  navigateTo('dashboard');
                } else {
                  navigateTo('login');
                }
              }}
              className="p-2.5 rounded-xl text-[#263A36] dark:text-emerald-100 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors relative"
              title="Saved Monographs"
            >
              <Bookmark className="w-5 h-5" />
              {savedProductIds.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#07543F] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {savedProductIds.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="p-2.5 rounded-xl text-[#263A36] dark:text-emerald-100 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40 transition-colors relative"
              title="Permitted Accessories Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#F28A19] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Account / Login / Admin Menu */}
            <div className="relative" ref={userMenuRef}>
              {currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-900/60 border border-emerald-200 dark:border-emerald-700/60 text-xs font-semibold text-[#07543F] dark:text-emerald-200 hover:border-[#07543F] transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#07543F] text-emerald-200 flex items-center justify-center font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline-block max-w-[100px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60" />
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('login')}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-56 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 rounded-xl shadow-xl p-2 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                    <p className="font-bold text-[#063E30] dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[#68756F] dark:text-emerald-200/60 truncate">{currentUser.email}</p>
                    <span className="mt-1 inline-block px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/80 text-[#07543F] dark:text-emerald-300 font-bold uppercase text-[9px]">
                      {currentUser.role}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-[#263A36] dark:text-emerald-100 font-medium flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-emerald-600" />
                      Member Dashboard
                    </button>

                    {['super_admin', 'admin', 'content_manager'].includes(currentUser.role) && (
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          navigateTo('admin');
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 text-[#F28A19] font-bold flex items-center gap-2 mt-1"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#F28A19]" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2 mt-1 border-t border-[#E9EDE7] dark:border-emerald-800/40"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-[#263A36] dark:text-emerald-100 hover:bg-emerald-100/60 dark:hover:bg-emerald-900/40"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF8] dark:bg-[#073B2E] border-b border-[#E9EDE7] dark:border-emerald-800 px-4 pt-3 pb-6 shadow-xl animate-in fade-in slide-in-from-top duration-150">
          <div className="space-y-1">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('brands');
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-[#07543F] dark:text-[#F28A19] hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
            >
              Brands & Strains Directory (30 Verified Brands)
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('flower');
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#263A36] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
            >
              Flower Farms & Craft Cultivars
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('edibles');
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#263A36] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
            >
              Artisanal Edibles & Lozenges
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('vapes');
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#263A36] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
            >
              Medical-Grade Vapes & Hardware
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('legal');
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#263A36] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
            >
              German Cannabis Act (CanG) Legal Guide
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('shop');
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold text-[#F28A19] hover:bg-orange-50 dark:hover:bg-orange-950/30 flex items-center justify-between"
            >
              <span>Lawful Botanical Storage & Accessories</span>
              <span className="text-[10px] bg-[#07543F] text-white px-2 py-0.5 rounded-full">SHOP</span>
            </button>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('contact');
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-[#263A36] dark:text-emerald-100 hover:bg-emerald-50 dark:hover:bg-emerald-900/40"
            >
              Cultivator Application & Inquiries
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-[#E9EDE7] dark:border-emerald-800/60 flex items-center justify-between">
            {currentUser ? (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('dashboard');
                }}
                className="text-xs font-bold text-[#07543F] dark:text-emerald-300"
              >
                Go to Member Profile ({currentUser.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('login');
                }}
                className="w-full py-2.5 rounded-xl bg-[#07543F] text-white text-xs font-bold text-center"
              >
                Sign In to Member Portal
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

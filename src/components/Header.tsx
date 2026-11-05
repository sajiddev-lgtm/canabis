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
  Flame,
  Award,
  Layers,
  Heart,
  Droplets,
  BookOpen,
  HelpCircle,
  Mail,
  Info,
  Scale,
  ExternalLink,
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
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const megaMenuRef = useRef<HTMLDivElement>(null);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setIsMegaMenuOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(e.target as Node)) {
        setIsMoreMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter 5 columns for Mega Menu
  const newBrands = brands.filter((b) => b.category_key === 'new_brands' || b.category === 'new_brands');
  const flowerFarms = brands.filter((b) => b.category_key === 'flower_farms' || b.category === 'flower_farms');
  const staffPicks = brands.filter((b) => b.category_key === 'staff_picks' || b.category === 'staff_picks');
  const ediblesMore = brands.filter((b) => b.category_key === 'edibles_more' || b.category === 'edibles_more');
  const vapes = brands.filter((b) => b.category_key === 'vapes' || b.category === 'vapes');

  const handleBrandClick = (brandSlug: string) => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigateTo('brands', brandSlug);
  };

  // Active page state detection (Persistent glow)
  const isHomeActive = currentPage === 'home';
  const isBrandsActive = currentPage === 'brands' || currentPage === 'brand-detail' || isMegaMenuOpen;
  const isFlowerActive = currentPage === 'flower' || currentPage === 'flower-farms';
  const isEdiblesActive = currentPage === 'edibles';
  const isVapesActive = currentPage === 'vapes';
  const isShopActive = currentPage === 'shop' || currentPage === 'product-detail';
  const isLegalActive = ['legal', 'privacy', 'terms', 'cookies', 'responsible-use'].includes(currentPage);
  const isJournalActive = currentPage === 'blog' || currentPage === 'blog-post';
  const isAboutActive = currentPage === 'about';
  const isFaqActive = currentPage === 'faq';
  const isContactActive = currentPage === 'contact';
  const isMoreActive = isJournalActive || isAboutActive || isFaqActive || isContactActive || isMoreMenuOpen;

  return (
    <header className="sticky top-0 z-40 w-full transition-colors">
      {/* 1. Top Announcement & Compliance Bar (Full-Width) */}
      <div className="w-full bg-[#063E30] text-emerald-100 text-xs py-1.5 px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-emerald-900/60">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-[#F28A19] text-[#063E30] text-[10px] font-extrabold shadow-[0_0_8px_#F28A19]">
              ✓
            </span>
            <span className="font-medium tracking-wide truncate">
              Offizielles deutsches Cannabis-Informationsportal & CanG-zertifiziertes Verzeichnis · 21+ Nur für Erwachsene
            </span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-[11px] text-emerald-200/80 shrink-0">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-300">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F28A19]" />
              Ph. Eur. Laborzertifiziert
            </span>
            <span className="opacity-40">|</span>
            <span>Berlin HQ · CanG § 5 Konform</span>
          </div>
        </div>
      </div>

      {/* 2. Main Glowing Box Navigation Bar (100% Full-Width) */}
      <div className="w-full bg-[#FFFDF8]/95 dark:bg-[#063E30]/95 backdrop-blur-md border-b border-[#E9EDE7] dark:border-emerald-900/70 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* ================= LEFT SECTION: Original Logo ================= */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => navigateTo('home')}
              className="flex items-center gap-3 text-left group focus:outline-hidden"
              title="Canabis Hub Germany – Home"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#07543F] to-[#063E30] text-emerald-400 p-2 shadow-md group-hover:shadow-[0_0_16px_rgba(7,84,63,0.35)] transition-all flex items-center justify-center border border-emerald-500/20 group-hover:border-emerald-400/40">
                {/* Stylized Cannabis Leaf Emblem */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7 text-[#F28A19] group-hover:scale-105 transition-transform">
                  <path d="M12 2C12 2 13.5 6.5 15.5 8C17.5 9.5 21 8.5 21 8.5C21 8.5 19 12 17.5 13.5C16 15 17 19 17 19C17 19 13.5 17.5 12 18.5C10.5 17.5 7 19 7 19C7 19 8 15 6.5 13.5C5 12 3 8.5 3 8.5C3 8.5 6.5 9.5 8.5 8C10.5 6.5 12 2 12 2Z" />
                </svg>
              </div>
              <div className="leading-tight">
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
          </div>

          {/* ================= CENTER SECTION: Glowing Boxy Navigation ================= */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-2 xl:gap-2.5 2xl:gap-3 mx-2 xl:mx-4" aria-label="Main Navigation">
            
            {/* Box 1: Home */}
            <button
              onClick={() => navigateTo('home')}
              className={`nav-box ${isHomeActive ? 'is-active' : ''}`}
              title="Return to Homepage"
            >
              {isHomeActive && <span className="nav-box-glow-dot mr-1.5" />}
              <span>Home</span>
            </button>

            {/* Box 2: Brands & Strains (Mega-Menu Container) */}
            <div className="relative" ref={megaMenuRef}>
              <button
                type="button"
                onClick={() => setIsMegaMenuOpen(!isMegaMenuOpen)}
                className={`nav-box ${isBrandsActive ? 'is-active' : ''}`}
                title="Browse 30 Verified Brands & Monograph Catalog"
              >
                {isBrandsActive && <span className="nav-box-glow-dot mr-1.5" />}
                <span>Brands & Strains</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isMegaMenuOpen ? 'rotate-180 text-[#F28A19]' : 'opacity-70'}`} />
              </button>

              {/* 5-Column Mega Menu Centered Dropdown */}
              {isMegaMenuOpen && (
                <div className="fixed left-1/2 -translate-x-1/2 top-[80px] w-[980px] max-w-[96vw] max-h-[85vh] overflow-y-auto bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#07543F]/20 dark:border-emerald-600/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3),0_0_30px_rgba(7,84,63,0.15)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_35px_rgba(16,185,129,0.2)] p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E9EDE7] dark:border-emerald-800/80">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-950/60 text-[#F28A19] flex items-center justify-center">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm sm:text-base text-[#063E30] dark:text-white font-['Outfit']">
                          Curated German & European Cannabis Catalog
                        </h4>
                        <p className="text-[11px] text-[#68756F] dark:text-emerald-200/70">
                          Select any monograph category or brand profile verified under German CanG protocols
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        navigateTo('brands');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#07543F] dark:text-[#F28A19] bg-emerald-50 dark:bg-emerald-900/50 hover:bg-emerald-100 border border-emerald-200 dark:border-emerald-800 transition-colors flex items-center gap-1.5"
                    >
                      <span>All 30 Brands Directory</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  {/* 5 Distinct Columns */}
                  <div className="grid grid-cols-5 gap-4">
                    {/* Col 1: New Brands */}
                    <div className="space-y-3 p-2.5 rounded-xl bg-slate-50/60 dark:bg-emerald-950/40 border border-emerald-900/5 dark:border-emerald-800/40">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#F28A19] pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Flame className="w-3.5 h-3.5 text-[#F28A19]" />
                        New Brands!
                      </div>
                      <ul className="space-y-1.5">
                        {newBrands.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#F28A19] dark:hover:text-[#F28A19] transition-colors py-1 px-1.5 rounded hover:bg-white/80 dark:hover:bg-emerald-900/50 block w-full truncate"
                            >
                              {b.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 2: Flower Farms */}
                    <div className="space-y-3 p-2.5 rounded-xl bg-slate-50/60 dark:bg-emerald-950/40 border border-emerald-900/5 dark:border-emerald-800/40">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-[#07543F] dark:text-emerald-300 pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Award className="w-3.5 h-3.5" />
                        Flower Farms
                      </div>
                      <ul className="space-y-1.5">
                        {flowerFarms.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors py-1 px-1.5 rounded hover:bg-white/80 dark:hover:bg-emerald-900/50 block w-full truncate"
                            >
                              {b.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 3: Staff Picks */}
                    <div className="space-y-3 p-2.5 rounded-xl bg-slate-50/60 dark:bg-emerald-950/40 border border-emerald-900/5 dark:border-emerald-800/40">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-emerald-700 dark:text-emerald-300 pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        Staff Picks
                      </div>
                      <ul className="space-y-1.5">
                        {staffPicks.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors py-1 px-1.5 rounded hover:bg-white/80 dark:hover:bg-emerald-900/50 block w-full truncate"
                            >
                              {b.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 4: Edibles & More */}
                    <div className="space-y-3 p-2.5 rounded-xl bg-slate-50/60 dark:bg-emerald-950/40 border border-emerald-900/5 dark:border-emerald-800/40">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-amber-700 dark:text-amber-400 pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Droplets className="w-3.5 h-3.5" />
                        Edibles & More
                      </div>
                      <ul className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                        {ediblesMore.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors py-1 px-1.5 rounded hover:bg-white/80 dark:hover:bg-emerald-900/50 block w-full truncate"
                            >
                              {b.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Col 5: Vapes */}
                    <div className="space-y-3 p-2.5 rounded-xl bg-slate-50/60 dark:bg-emerald-950/40 border border-emerald-900/5 dark:border-emerald-800/40">
                      <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider text-cyan-700 dark:text-cyan-400 pb-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                        <Layers className="w-3.5 h-3.5" />
                        Vapes & Hardware
                      </div>
                      <ul className="space-y-1.5">
                        {vapes.map((b) => (
                          <li key={b.id}>
                            <button
                              onClick={() => handleBrandClick(b.slug || b.id)}
                              className="text-left text-xs font-medium text-[#263A36] dark:text-emerald-100 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors py-1 px-1.5 rounded hover:bg-white/80 dark:hover:bg-emerald-900/50 block w-full truncate"
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
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]"></span>
                      <span>All listed cultivators adhere to Ph. Eur. monograph thresholds with verifiable analytical COAs.</span>
                    </div>
                    <button
                      onClick={() => {
                        setIsMegaMenuOpen(false);
                        navigateTo('legal');
                      }}
                      className="font-semibold text-[#07543F] dark:text-[#F28A19] hover:underline flex items-center gap-1"
                    >
                      <span>CanG Regulatory Compliance Guide</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Box 3: Flower Farms */}
            <button
              onClick={() => navigateTo('flower')}
              className={`nav-box ${isFlowerActive ? 'is-active' : ''}`}
              title="Explore Licensed European Flower Farms"
            >
              {isFlowerActive && <span className="nav-box-glow-dot mr-1.5" />}
              <span>Flower Farms</span>
            </button>

            {/* Box 4: Edibles */}
            <button
              onClick={() => navigateTo('edibles')}
              className={`nav-box ${isEdiblesActive ? 'is-active' : ''}`}
              title="Artisanal Edibles & Lozenges"
            >
              {isEdiblesActive && <span className="nav-box-glow-dot mr-1.5" />}
              <span>Edibles</span>
            </button>

            {/* Box 5: Vapes */}
            <button
              onClick={() => navigateTo('vapes')}
              className={`nav-box ${isVapesActive ? 'is-active' : ''}`}
              title="Medical Ceramic Core Vaporizer Hardware"
            >
              {isVapesActive && <span className="nav-box-glow-dot mr-1.5" />}
              <span>Vapes</span>
            </button>

            {/* Box 6: Storage & Accessories (Shop with Amber Glow Accent) */}
            <button
              onClick={() => navigateTo('shop')}
              className={`nav-box nav-box-amber ${isShopActive ? 'is-active' : ''}`}
              title="Shop Lawful Botanical Storage, Grinders, Scales & Accessories"
            >
              {isShopActive && <span className="nav-box-glow-dot mr-1.5" />}
              <span>Storage & Accessories</span>
              <span className="ml-1 text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-[#07543F] text-emerald-100 dark:bg-emerald-950 dark:text-emerald-300">
                Shop
              </span>
            </button>

            {/* Box 7: Legal & CanG */}
            <button
              onClick={() => navigateTo('legal')}
              className={`nav-box ${isLegalActive ? 'is-active' : ''}`}
              title="German Cannabis Act (CanG) Regulatory Framework"
            >
              {isLegalActive && <span className="nav-box-glow-dot mr-1.5" />}
              <span>Legal & CanG</span>
            </button>

            {/* Box 8: Journal (Visible on 2xl screens, or accessible via More menu) */}
            <button
              onClick={() => navigateTo('blog')}
              className={`nav-box hidden 2xl:inline-flex ${isJournalActive ? 'is-active' : ''}`}
              title="Educational Phytocannabinoid Research & Articles"
            >
              {isJournalActive && <span className="nav-box-glow-dot mr-1.5" />}
              <span>Journal</span>
            </button>

            {/* Box 9: More Dropdown (Contains Journal, About, FAQ, Contact) */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
                className={`nav-box ${isMoreActive ? 'is-active' : ''}`}
                title="More Platform Sections"
              >
                {isMoreActive && <span className="nav-box-glow-dot mr-1.5" />}
                <span>More</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 ${isMoreMenuOpen ? 'rotate-180 text-[#F28A19]' : 'opacity-70'}`} />
              </button>

              {/* More Submenu Dropdown */}
              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#07543F]/20 dark:border-emerald-600/30 rounded-2xl shadow-xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-xl">
                  
                  {/* Journal Link */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      navigateTo('blog');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center justify-between transition-all ${
                      isJournalActive
                        ? 'bg-[#07543F]/15 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-200 border border-[#07543F]/30 dark:border-emerald-500/40 shadow-[0_0_10px_rgba(7,84,63,0.15)] font-bold'
                        : 'text-[#263A36] dark:text-emerald-100 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/40 hover:text-[#07543F]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#07543F] dark:text-emerald-400" />
                      <span>Research Journal</span>
                    </span>
                    {isJournalActive && <span className="nav-box-glow-dot" />}
                  </button>

                  {/* About Link */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      navigateTo('about');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center justify-between transition-all ${
                      isAboutActive
                        ? 'bg-[#07543F]/15 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-200 border border-[#07543F]/30 dark:border-emerald-500/40 shadow-[0_0_10px_rgba(7,84,63,0.15)] font-bold'
                        : 'text-[#263A36] dark:text-emerald-100 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/40 hover:text-[#07543F]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#07543F] dark:text-emerald-400" />
                      <span>About Canabis Hub</span>
                    </span>
                    {isAboutActive && <span className="nav-box-glow-dot" />}
                  </button>

                  {/* FAQ Link */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      navigateTo('faq');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center justify-between transition-all ${
                      isFaqActive
                        ? 'bg-[#07543F]/15 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-200 border border-[#07543F]/30 dark:border-emerald-500/40 shadow-[0_0_10px_rgba(7,84,63,0.15)] font-bold'
                        : 'text-[#263A36] dark:text-emerald-100 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/40 hover:text-[#07543F]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#07543F] dark:text-emerald-400" />
                      <span>Regulatory FAQ</span>
                    </span>
                    {isFaqActive && <span className="nav-box-glow-dot" />}
                  </button>

                  {/* Contact Link */}
                  <button
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      navigateTo('contact');
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl font-semibold flex items-center justify-between transition-all ${
                      isContactActive
                        ? 'bg-[#07543F]/15 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-200 border border-[#07543F]/30 dark:border-emerald-500/40 shadow-[0_0_10px_rgba(7,84,63,0.15)] font-bold'
                        : 'text-[#263A36] dark:text-emerald-100 hover:bg-emerald-50/80 dark:hover:bg-emerald-900/40 hover:text-[#07543F]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#F28A19]" />
                      <span>Contact & Inquiries</span>
                    </span>
                    {isContactActive && <span className="nav-box-glow-dot" />}
                  </button>

                </div>
              )}
            </div>

          </nav>

          {/* ================= RIGHT SECTION: Utility Action Boxes ================= */}
          <div className="flex-shrink-0 flex items-center gap-2 sm:gap-2.5">
            
            {/* Search Box Trigger */}
            <button
              onClick={openSearch}
              className="h-10 px-3 rounded-xl border border-emerald-900/15 dark:border-emerald-500/20 bg-white/70 dark:bg-[#073B2E]/60 text-[#263A36] dark:text-emerald-100 hover:border-[#07543F] dark:hover:border-[#10b981] hover:text-[#07543F] dark:hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(7,84,63,0.22)] dark:hover:shadow-[0_0_16px_rgba(16,185,129,0.35)] transition-all flex items-center gap-1.5 text-xs font-semibold"
              title="Search cultivars, terpenes & brands"
            >
              <Search className="w-4 h-4 text-[#07543F] dark:text-emerald-300" />
              <span className="hidden xl:inline-block">Search</span>
            </button>

            {/* Dark / Light Theme Toggle Box */}
            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-xl border border-emerald-900/15 dark:border-emerald-500/20 bg-white/70 dark:bg-[#073B2E]/60 text-[#263A36] dark:text-emerald-100 hover:border-[#F28A19] hover:text-[#F28A19] hover:shadow-[0_0_15px_rgba(242,138,25,0.3)] transition-all flex items-center justify-center"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Wishlist / Saved Monographs Box */}
            <button
              onClick={() => {
                if (currentUser) {
                  navigateTo('dashboard');
                } else {
                  navigateTo('login');
                }
              }}
              className="h-10 px-2.5 sm:px-3 rounded-xl border border-emerald-900/15 dark:border-emerald-500/20 bg-white/70 dark:bg-[#073B2E]/60 text-[#263A36] dark:text-emerald-100 hover:border-[#07543F] dark:hover:border-[#10b981] hover:text-[#07543F] dark:hover:text-emerald-300 hover:shadow-[0_0_15px_rgba(7,84,63,0.22)] dark:hover:shadow-[0_0_16px_rgba(16,185,129,0.35)] transition-all flex items-center gap-1.5 text-xs font-semibold relative"
              title="View Wishlist & Saved Monographs"
            >
              <Bookmark className="w-4 h-4 text-[#07543F] dark:text-emerald-300" />
              <span className="hidden xl:inline-block">Wishlist</span>
              {savedProductIds.length > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-extrabold bg-[#07543F] text-white rounded-full shadow-[0_0_8px_rgba(7,84,63,0.5)]">
                  {savedProductIds.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Drawer Trigger Box */}
            <button
              onClick={openCart}
              className="h-10 px-2.5 sm:px-3 rounded-xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 text-[#b45309] dark:text-[#ffedd5] hover:border-[#F28A19] hover:shadow-[0_0_18px_rgba(242,138,25,0.4)] transition-all flex items-center gap-1.5 text-xs font-bold relative"
              title="Shopping Cart (Storage & Accessories)"
            >
              <ShoppingBag className="w-4 h-4 text-[#F28A19]" />
              <span className="hidden xl:inline-block">Cart</span>
              {cartItemCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-extrabold bg-[#F28A19] text-white rounded-full shadow-[0_0_10px_#F28A19]">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Account / Login / Dashboard Profile Menu Box */}
            <div className="relative" ref={userMenuRef}>
              {currentUser ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="h-10 pl-2 pr-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-200 hover:border-[#07543F] dark:hover:border-[#10b981] hover:shadow-[0_0_16px_rgba(16,185,129,0.35)] transition-all flex items-center gap-2 text-xs font-bold"
                  title="Manage Account"
                >
                  <div className="w-6 h-6 rounded-full bg-[#07543F] text-emerald-200 flex items-center justify-center font-extrabold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:inline-block max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
              ) : (
                <button
                  onClick={() => navigateTo('login')}
                  className="h-10 px-3.5 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white text-xs font-bold transition-all shadow-[0_0_14px_rgba(7,84,63,0.3)] hover:shadow-[0_0_20px_rgba(7,84,63,0.5)] flex items-center gap-1.5 border border-emerald-400/30"
                  title="Sign In to Member Portal"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </button>
              )}

              {/* User Dropdown */}
              {isUserMenuOpen && currentUser && (
                <div className="absolute right-0 mt-2 w-60 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 rounded-2xl shadow-2xl p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-xl">
                  <div className="px-3 py-2 border-b border-[#E9EDE7] dark:border-emerald-800/60">
                    <p className="font-bold text-[#063E30] dark:text-white truncate">{currentUser.name}</p>
                    <p className="text-[#68756F] dark:text-emerald-200/60 truncate">{currentUser.email}</p>
                    <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/80 text-[#07543F] dark:text-emerald-300 font-bold uppercase text-[9px]">
                      {currentUser.role}
                    </span>
                  </div>

                  <div className="py-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('dashboard');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/40 text-[#263A36] dark:text-emerald-100 font-semibold flex items-center gap-2"
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
                        className="w-full text-left px-3 py-2 rounded-xl bg-orange-50 dark:bg-orange-950/40 hover:bg-orange-100 text-[#F28A19] font-bold flex items-center gap-2"
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
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium flex items-center gap-2 border-t border-[#E9EDE7] dark:border-emerald-800/40 mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Hamburger Box */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-10 w-10 rounded-xl border border-emerald-900/15 dark:border-emerald-500/20 bg-white/70 dark:bg-[#073B2E]/60 text-[#263A36] dark:text-emerald-100 hover:border-[#07543F] dark:hover:border-[#10b981] flex items-center justify-center transition-all"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-[#F28A19]" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* ================= MOBILE SLIDE-OUT DRAWER WITH GLOWING BOXES ================= */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-[#FFFDF8] dark:bg-[#073B2E] border-b border-[#E9EDE7] dark:border-emerald-800 px-4 py-5 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150 backdrop-blur-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-emerald-400/60 mb-3 px-1">
            Navigation Catalog
          </p>
          <div className="space-y-2">
            
            {/* Mobile Box: Home */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('home');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isHomeActive ? 'is-active' : ''}`}
            >
              <span>Home</span>
              {isHomeActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: Brands */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('brands');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isBrandsActive ? 'is-active' : ''}`}
            >
              <span>Brands & Strains Directory (30 Brands)</span>
              {isBrandsActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: Flower */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('flower');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isFlowerActive ? 'is-active' : ''}`}
            >
              <span>Flower Farms & Craft Cultivars</span>
              {isFlowerActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: Edibles */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('edibles');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isEdiblesActive ? 'is-active' : ''}`}
            >
              <span>Artisanal Edibles & Lozenges</span>
              {isEdiblesActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: Vapes */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('vapes');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isVapesActive ? 'is-active' : ''}`}
            >
              <span>Medical-Grade Vapes & Hardware</span>
              {isVapesActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: Shop */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('shop');
              }}
              className={`nav-box nav-box-amber w-full justify-between h-11 text-sm ${isShopActive ? 'is-active' : ''}`}
            >
              <div className="flex items-center gap-2">
                <span>Storage & Accessories</span>
                <span className="text-[10px] bg-[#07543F] text-white px-2 py-0.5 rounded-full font-bold">
                  SHOP
                </span>
              </div>
              {isShopActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: Legal & CanG */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('legal');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isLegalActive ? 'is-active' : ''}`}
            >
              <span>German Cannabis Act (CanG) Guide</span>
              {isLegalActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: Journal */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('blog');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isJournalActive ? 'is-active' : ''}`}
            >
              <span>Educational Research Journal</span>
              {isJournalActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: About */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('about');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isAboutActive ? 'is-active' : ''}`}
            >
              <span>About Canabis Hub Germany</span>
              {isAboutActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: FAQ */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('faq');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isFaqActive ? 'is-active' : ''}`}
            >
              <span>Frequently Asked Questions</span>
              {isFaqActive && <span className="nav-box-glow-dot" />}
            </button>

            {/* Mobile Box: Contact */}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('contact');
              }}
              className={`nav-box w-full justify-between h-11 text-sm ${isContactActive ? 'is-active' : ''}`}
            >
              <span>Cultivator Application & Inquiries</span>
              {isContactActive && <span className="nav-box-glow-dot" />}
            </button>

          </div>

          <div className="mt-5 pt-4 border-t border-[#E9EDE7] dark:border-emerald-800/60">
            {currentUser ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-[#063E30] dark:text-white">{currentUser.name}</p>
                  <p className="text-[11px] text-[#68756F] dark:text-emerald-200/60">{currentUser.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('dashboard');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#07543F] text-white text-xs font-bold"
                >
                  Dashboard
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  navigateTo('login');
                }}
                className="w-full py-3 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white text-xs font-bold text-center shadow-md flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                <span>Sign In to Member Portal</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

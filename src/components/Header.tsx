/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MEGA_MENU_DATA } from '../data/cannabisData';
import {
  Search,
  Bookmark,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
  ShieldCheck,
  Clock,
  Phone,
  Sparkles,
  LogOut,
  LayoutDashboard,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentPage,
    navigateTo,
    savedItemIds,
    cart,
    openCart,
    openSearch,
    openSavedDrawer,
    currentUser,
    logout,
    theme,
    toggleTheme,
  } = useApp();

  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileExpandedSection, setMobileExpandedSection] = useState<string | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const megaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (megaMenuTimeoutRef.current) {
      clearTimeout(megaMenuTimeoutRef.current);
    }
    setIsMegaMenuOpen(true);
  };

  const handleMouseLeave = () => {
    megaMenuTimeoutRef.current = setTimeout(() => {
      setIsMegaMenuOpen(false);
    }, 220);
  };

  const handleBrandClick = (slug: string) => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    navigateTo('brand-detail', slug);
  };

  const handleCategoryNav = (key: string) => {
    setIsMegaMenuOpen(false);
    setIsMobileMenuOpen(false);
    if (key === 'flower_farms') {
      navigateTo('flower-farms');
    } else if (key === 'edibles_more') {
      navigateTo('edibles');
    } else if (key === 'vapes') {
      navigateTo('vapes');
    } else {
      navigateTo('brands', key);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#063E30]/90 backdrop-blur-md border-b border-[#E9EDE7] dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-colors">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#063E30] dark:bg-[#041C16] text-white py-2 px-4 text-xs font-medium tracking-wide border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F28A19] animate-pulse" />
            <span className="text-[#FFFDF8]/90 text-[11px] sm:text-xs">
              Same-Day Express Courier Dispatch in Berlin & Munich · 100% Lab Verified · CanG Framework
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-[#FFFDF8]/80 text-[11px]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#F28A19]" />
              ISO/IEC 17025 Accredited
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#F28A19]" />
              Mon - Sat: 09:00 - 21:00
            </span>
            <button
              onClick={() => navigateTo('contact')}
              className="hover:text-[#F28A19] transition-colors flex items-center gap-1"
            >
              <Phone className="w-3 h-3" />
              Advisory Desk
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => navigateTo('home')}
          className="flex items-center gap-2.5 text-left group shrink-0 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#07543F] to-[#063E30] dark:from-[#07543F] dark:to-[#F28A19] flex items-center justify-center text-white font-bold shadow-md shadow-[#07543F]/20 group-hover:scale-105 transition-all">
            <svg
              className="w-6 h-6 text-[#FFFDF8]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-2xl tracking-tight text-[#063E30] dark:text-white leading-tight">
              CANABIS<span className="text-[#F28A19] ml-1">HUB</span>
            </span>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#68756F] dark:text-white/60">
              GERMAN BOTANICAL PLATFORM
            </span>
          </div>
        </button>

        {/* Desktop Main Navigation Links */}
        <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-[#263A36] dark:text-white/90">
          <button
            onClick={() => navigateTo('home')}
            className={`transition-colors py-2 hover:text-[#07543F] dark:hover:text-[#F28A19] ${
              currentPage === 'home' ? 'text-[#07543F] dark:text-[#F28A19] font-bold border-b-2 border-[#07543F] dark:border-[#F28A19]' : ''
            }`}
          >
            Home
          </button>

          <button
            onClick={() => navigateTo('about')}
            className={`transition-colors py-2 hover:text-[#07543F] dark:hover:text-[#F28A19] ${
              currentPage === 'about' ? 'text-[#07543F] dark:text-[#F28A19] font-bold border-b-2 border-[#07543F] dark:border-[#F28A19]' : ''
            }`}
          >
            About
          </button>

          {/* Shop with 5-Column Mega Menu Trigger */}
          <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              onClick={() => {
                navigateTo('shop');
                setIsMegaMenuOpen(!isMegaMenuOpen);
              }}
              className={`flex items-center gap-1.5 py-2 transition-colors hover:text-[#07543F] dark:hover:text-[#F28A19] ${
                currentPage === 'shop' || isMegaMenuOpen
                  ? 'text-[#07543F] dark:text-[#F28A19] font-bold border-b-2 border-[#07543F] dark:border-[#F28A19]'
                  : ''
              }`}
            >
              Shop
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  isMegaMenuOpen ? 'rotate-180 text-[#F28A19]' : ''
                }`}
              />
            </button>
          </div>

          <button
            onClick={() => navigateTo('brands')}
            className={`transition-colors py-2 hover:text-[#07543F] dark:hover:text-[#F28A19] ${
              currentPage === 'brands' || currentPage === 'brand-detail'
                ? 'text-[#07543F] dark:text-[#F28A19] font-bold border-b-2 border-[#07543F] dark:border-[#F28A19]'
                : ''
            }`}
          >
            Brands
          </button>

          <button
            onClick={() => navigateTo('flower-farms')}
            className={`transition-colors py-2 hover:text-[#07543F] dark:hover:text-[#F28A19] ${
              currentPage === 'flower-farms' ? 'text-[#07543F] dark:text-[#F28A19] font-bold border-b-2 border-[#07543F] dark:border-[#F28A19]' : ''
            }`}
          >
            Flower Farms
          </button>

          <button
            onClick={() => navigateTo('blog')}
            className={`transition-colors py-2 hover:text-[#07543F] dark:hover:text-[#F28A19] ${
              currentPage === 'blog' || currentPage === 'blog-post'
                ? 'text-[#07543F] dark:text-[#F28A19] font-bold border-b-2 border-[#07543F] dark:border-[#F28A19]'
                : ''
            }`}
          >
            Blog
          </button>

          <button
            onClick={() => navigateTo('faq')}
            className={`transition-colors py-2 hover:text-[#07543F] dark:hover:text-[#F28A19] ${
              currentPage === 'faq' ? 'text-[#07543F] dark:text-[#F28A19] font-bold border-b-2 border-[#07543F] dark:border-[#F28A19]' : ''
            }`}
          >
            FAQ
          </button>

          <button
            onClick={() => navigateTo('contact')}
            className={`transition-colors py-2 hover:text-[#07543F] dark:hover:text-[#F28A19] ${
              currentPage === 'contact' ? 'text-[#07543F] dark:text-[#F28A19] font-bold border-b-2 border-[#07543F] dark:border-[#F28A19]' : ''
            }`}
          >
            Contact
          </button>
        </nav>

        {/* Right Utility Icons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Light / Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#263A36] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light Mode' : 'Dark Mode'}`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5 text-[#F28A19]" />
            ) : (
              <Moon className="w-5 h-5 text-[#07543F]" />
            )}
          </button>

          {/* Quick Search */}
          <button
            onClick={openSearch}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#263A36] dark:text-white hover:bg-[#F28A19]/10 hover:text-[#F28A19] transition-colors"
            title="Search Brands, Cultivars & Articles"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Saved Items (Wishlist) */}
          <button
            onClick={openSavedDrawer}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#263A36] dark:text-white hover:bg-[#07543F]/10 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors relative"
            title="Saved Monographs"
            aria-label="Saved items wishlist"
          >
            <Bookmark className="w-5 h-5" />
            {savedItemIds.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#07543F] dark:bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {savedItemIds.length}
              </span>
            )}
          </button>

          {/* Permitted Merchandise Shopping Bag */}
          <button
            onClick={openCart}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#263A36] dark:text-white hover:bg-[#F28A19]/10 hover:text-[#F28A19] transition-colors relative"
            title="Accessories Bag (Permitted Merchandise)"
            aria-label="Shopping bag"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F28A19] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {cart.length}
              </span>
            )}
          </button>

          {/* Account / User Menu */}
          <div className="relative">
            <button
              onClick={() => {
                if (currentUser) {
                  setIsUserMenuOpen(!isUserMenuOpen);
                } else {
                  navigateTo('login');
                }
              }}
              className="w-10 h-10 rounded-full flex items-center justify-center text-[#263A36] dark:text-white hover:bg-[#07543F]/10 transition-colors relative"
              title={currentUser ? `Account: ${currentUser.name}` : 'Sign In'}
            >
              {currentUser ? (
                <div className="w-8 h-8 rounded-full bg-[#07543F] text-white flex items-center justify-center text-xs font-bold border border-white/20">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {/* Dropdown Menu when signed in */}
            {isUserMenuOpen && currentUser && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-[#063E30] rounded-2xl shadow-xl border border-[#E9EDE7] dark:border-white/10 p-2 text-xs z-50 animate-fadeIn">
                <div className="p-2 border-b border-[#E9EDE7] dark:border-white/10">
                  <div className="font-bold text-[#063E30] dark:text-white truncate">{currentUser.name}</div>
                  <div className="text-[10px] text-[#68756F] dark:text-white/60 truncate">{currentUser.email}</div>
                </div>

                <div className="py-1 space-y-0.5">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      navigateTo('dashboard');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 font-semibold text-[#263A36] dark:text-white flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5 text-[#07543F]" />
                    My Dashboard
                  </button>

                  {['super_admin', 'admin', 'content_manager', 'support_agent'].includes(currentUser.role) && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        navigateTo('admin');
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 font-semibold text-[#F28A19] flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-3.5 h-3.5" />
                      Admin Console
                    </button>
                  )}
                </div>

                <div className="pt-1 border-t border-[#E9EDE7] dark:border-white/10">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 font-semibold flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center text-[#263A36] dark:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Mega Menu — Exact 5-Column Reference Implementation */}
      {isMegaMenuOpen && (
        <div
          className="hidden lg:block absolute left-0 right-0 top-full bg-white dark:bg-[#063E30] border-t border-[#E9EDE7] dark:border-white/10 shadow-2xl z-50 transition-all animate-fadeIn"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div className="max-w-7xl mx-auto px-6 py-10">
            {/* 5 Evenly Distributed Columns */}
            <div className="grid grid-cols-5 gap-8">
              {MEGA_MENU_DATA.map((col, idx) => (
                <div key={idx} className="flex flex-col">
                  {/* Column Header */}
                  <div className="pb-3 border-b border-[#E9EDE7] dark:border-white/10">
                    <button
                      onClick={() => handleCategoryNav(col.categoryKey)}
                      className="text-left font-bold text-sm tracking-wider uppercase text-[#063E30] dark:text-white hover:text-[#F28A19] dark:hover:text-[#F28A19] transition-colors flex items-center justify-between w-full group"
                    >
                      <span>{col.title}</span>
                      <span className="text-[11px] text-[#68756F] dark:text-white/50 font-normal group-hover:text-[#F28A19]">
                        View all
                      </span>
                    </button>
                  </div>

                  {/* Brand Links List */}
                  <div className="flex flex-col divide-y divide-[#F4F6F2] dark:divide-white/5 mt-1">
                    {col.brands.map((brand, bIdx) => (
                      <button
                        key={bIdx}
                        onClick={() => handleBrandClick(brand.slug)}
                        className="py-2.5 text-left text-[14px] text-[#263A36] dark:text-white/80 hover:text-[#07543F] dark:hover:text-[#F28A19] hover:translate-x-1 hover:font-semibold transition-all duration-150 focus:outline-none"
                      >
                        {brand.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Highlight Strip */}
            <div className="mt-8 pt-6 border-t border-[#E9EDE7] dark:border-white/10 flex items-center justify-between text-xs text-[#68756F] dark:text-white/60">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#07543F] dark:text-emerald-400">Cannabis Directory Hub:</span>
                <span>Discover verified European brands, organic terpene genetics & laboratory certificates.</span>
              </div>
              <button
                onClick={() => {
                  setIsMegaMenuOpen(false);
                  navigateTo('shop');
                }}
                className="font-bold text-[#F28A19] hover:underline flex items-center gap-1"
              >
                Explore Full Directory Catalog →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#063E30] border-t border-[#E9EDE7] dark:border-white/10 px-4 py-6 max-h-[80vh] overflow-y-auto shadow-2xl">
          <div className="flex flex-col space-y-4">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('home');
              }}
              className="text-left text-base font-semibold text-[#263A36] dark:text-white hover:text-[#07543F] py-2"
            >
              Home
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('about');
              }}
              className="text-left text-base font-semibold text-[#263A36] dark:text-white hover:text-[#07543F] py-2"
            >
              About
            </button>

            {/* Mobile Accordion for Shop & Mega Menu */}
            <div className="border-t border-b border-[#E9EDE7] dark:border-white/10 py-2">
              <div className="flex items-center justify-between py-2">
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('shop');
                  }}
                  className="text-base font-bold text-[#07543F] dark:text-[#F28A19]"
                >
                  Shop Catalog
                </button>
                <button
                  onClick={() =>
                    setMobileExpandedSection(
                      mobileExpandedSection === 'shop' ? null : 'shop'
                    )
                  }
                  className="p-1 text-[#68756F] dark:text-white/60"
                >
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      mobileExpandedSection === 'shop' ? 'rotate-180 text-[#F28A19]' : ''
                    }`}
                  />
                </button>
              </div>

              {mobileExpandedSection === 'shop' && (
                <div className="pl-3 py-2 space-y-4">
                  {MEGA_MENU_DATA.map((col, idx) => (
                    <div key={idx} className="border-l-2 border-[#07543F]/30 pl-3">
                      <div className="font-bold text-xs uppercase text-[#063E30] dark:text-white mb-2 tracking-wider">
                        {col.title}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {col.brands.map((brand, bIdx) => (
                          <button
                            key={bIdx}
                            onClick={() => handleBrandClick(brand.slug)}
                            className="text-left text-xs text-[#263A36] dark:text-white/80 hover:text-[#07543F] py-1 truncate"
                          >
                            {brand.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('brands');
              }}
              className="text-left text-base font-semibold text-[#263A36] dark:text-white hover:text-[#07543F] py-2"
            >
              Brand Directory
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('flower-farms');
              }}
              className="text-left text-base font-semibold text-[#263A36] dark:text-white hover:text-[#07543F] py-2"
            >
              Flower Farms
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('blog');
              }}
              className="text-left text-base font-semibold text-[#263A36] dark:text-white hover:text-[#07543F] py-2"
            >
              Blog & Insights
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('faq');
              }}
              className="text-left text-base font-semibold text-[#263A36] dark:text-white hover:text-[#07543F] py-2"
            >
              FAQ
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                navigateTo('contact');
              }}
              className="text-left text-base font-semibold text-[#263A36] dark:text-white hover:text-[#07543F] py-2"
            >
              Contact Us
            </button>

            {/* Quick Actions in Mobile Drawer */}
            <div className="pt-4 border-t border-[#E9EDE7] dark:border-white/10 flex flex-col gap-2.5">
              {currentUser ? (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('dashboard');
                  }}
                  className="w-full py-2.5 px-4 bg-[#07543F] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> My Dashboard ({currentUser.name})
                </button>
              ) : (
                <button
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    navigateTo('login');
                  }}
                  className="w-full py-2.5 px-4 bg-[#07543F] text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                >
                  <User className="w-4 h-4" /> Sign In / Register
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

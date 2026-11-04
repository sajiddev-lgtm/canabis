/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  HERO_SLIDES,
  EXPERIENCE_CARDS,
  DELIVERY_FEATURES,
  CATEGORIES_DATA,
  PRODUCTS_DATA,
  WHY_CHOOSE_US_CARDS,
  HOW_TO_EXPLORE_STEPS,
  BLOG_POSTS,
  FAQ_ITEMS,
} from '../data/cannabisData';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Truck,
  Sprout,
  BookOpen,
  ThermometerSnowflake,
  Box,
  Clock,
  UserCheck,
  Bookmark,
  Check,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  FlaskConical,
  Award,
  Star,
  ExternalLink,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigateTo, isItemSaved, toggleSaveItem } = useApp();

  // Hero Slider State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);

  // FAQ Accordion State
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  // Auto-advance hero slides
  useEffect(() => {
    if (!isAutoplay) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoplay]);

  const nextSlide = () => {
    setIsAutoplay(false);
    setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setIsAutoplay(false);
    setCurrentSlideIndex((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const currentSlide = HERO_SLIDES[currentSlideIndex];

  // Helper for dynamic icons
  const renderIcon = (name: string, className: string = 'w-5 h-5') => {
    switch (name) {
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Truck':
        return <Truck className={className} />;
      case 'Sprout':
        return <Sprout className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      case 'ThermometerSnowflake':
        return <ThermometerSnowflake className={className} />;
      case 'Box':
        return <Box className={className} />;
      case 'Clock':
        return <Clock className={className} />;
      case 'UserCheck':
        return <UserCheck className={className} />;
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] transition-colors">
      {/* =========================================================================
          SECTION 1: HERO SLIDER
          Full-width image-based hero section, dark translucent overlay,
          left-aligned heading, orange primary CTA, secondary outlined CTA,
          slider arrows, pagination indicators, 3 trust indicators below buttons.
         ========================================================================= */}
      <section className="relative w-full min-h-[580px] lg:min-h-[660px] bg-[#073B2E] overflow-hidden flex items-center">
        {/* Background Image with smooth transition */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.backgroundImage}
            alt={currentSlide.headline}
            className="w-full h-full object-cover object-center filter brightness-[0.72] transition-all duration-1000 scale-105"
          />
          {/* Dark Translucent Overlay for High Legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#063E30]/95 via-[#073B2E]/80 to-black/40" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl">
            {/* Slide Tag / Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#F28A19]/20 border border-[#F28A19]/30 text-[#F28A19] text-xs font-bold tracking-wider uppercase mb-5 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F28A19]" />
              {currentSlide.tag}
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-5 drop-shadow-sm">
              {currentSlide.headline}
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#FFFDF8]/90 font-normal leading-relaxed mb-8 max-w-xl">
              {currentSlide.subheading}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-10">
              <button
                onClick={() => navigateTo(currentSlide.primaryLink as any)}
                className="px-7 py-3.5 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold text-sm shadow-lg shadow-[#F28A19]/30 transition-all hover:scale-[1.02] active:scale-95"
              >
                {currentSlide.primaryCta}
              </button>

              <button
                onClick={() => navigateTo(currentSlide.secondaryLink as any)}
                className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/25 backdrop-blur-sm transition-all"
              >
                {currentSlide.secondaryCta}
              </button>
            </div>

            {/* 3 Compact Trust / Feature Indicators Below Buttons */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-1 sm:grid-cols-3 gap-4 text-white/90">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#07543F] flex items-center justify-center shrink-0 text-[#F28A19]">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-white">100% Lab Verified</span>
                  <span className="text-white/70 text-[11px]">ISO/IEC 17025 accredited</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#07543F] flex items-center justify-center shrink-0 text-[#F28A19]">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-white">Express Dispatch</span>
                  <span className="text-white/70 text-[11px]">Discreet climate courier</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#07543F] flex items-center justify-center shrink-0 text-[#F28A19]">
                  <Award className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <span className="font-bold block text-white">German Standards</span>
                  <span className="text-white/70 text-[11px]">CanG regulatory compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all focus:outline-none"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/30 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm border border-white/20 transition-all focus:outline-none"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Pagination Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setIsAutoplay(false);
                setCurrentSlideIndex(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentSlideIndex === idx
                  ? 'w-8 bg-[#F28A19]'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: THE CANABIS HUB EXPERIENCE
          Small orange eyebrow, centered title, short description,
          horizontal experience cards, white cards with subtle orange borders,
          small orange icons, compact descriptions, star elements.
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            THE CANABIS HUB EXPERIENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-4">
            Curated Excellence in Every Detail
          </h2>
          <p className="text-sm sm:text-base text-[#68756F] dark:text-white/70 leading-relaxed">
            From alpine living-soil organic harvests to state-of-the-art analytical purity testing, we curate only the highest echelon of European cannabis craftsmanship.
          </p>
        </div>

        {/* Horizontally arranged experience cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERIENCE_CARDS.map((card, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#063E30] rounded-2xl p-6 border border-[#F28A19]/30 dark:border-white/10 hover:border-[#F28A19] shadow-sm hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
            >
              <div>
                {/* Small Orange Icon */}
                <div className="w-12 h-12 rounded-xl bg-[#F28A19]/10 text-[#F28A19] flex items-center justify-center mb-5 group-hover:bg-[#F28A19] group-hover:text-white transition-colors">
                  {renderIcon(card.iconName, 'w-6 h-6')}
                </div>

                <h3 className="text-lg font-bold text-[#063E30] dark:text-white mb-2.5">
                  {card.title}
                </h3>

                <p className="text-xs text-[#68756F] dark:text-white/70 leading-relaxed mb-4">
                  {card.description}
                </p>
              </div>

              {/* Star-style decorative rating badge */}
              <div className="pt-3 border-t border-[#E9EDE7] dark:border-white/10 flex items-center justify-between text-[11px] text-[#68756F] dark:text-white/60">
                <span className="font-semibold text-[#07543F] dark:text-emerald-400">{card.rating}</span>
                <div className="flex items-center text-[#F28A19]">
                  {[...Array(5)].map((_, sIdx) => (
                    <Star key={sIdx} className="w-3 h-3 fill-[#F28A19]" />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: SAME DAY EXPRESS DELIVERY
          Two-column layout:
          Left: Green section heading, short description, 4 feature cards in 2x2 grid.
          Right: Large retail/courier photograph, rounded corners, shadow, caption overlay.
         ========================================================================= */}
      <section className="py-16 bg-[#F4F6F2] dark:bg-[#073B2E]/40 border-y border-[#E9EDE7] dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#F28A19] block mb-2">
                  LOGISTICS & DISPATCH PROTOCOLS
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-3">
                  Same-Day Express Logistics Network
                </h2>
                <p className="text-sm text-[#68756F] dark:text-white/70 leading-relaxed max-w-xl">
                  Designed for pharmaceutical precision and discretion, our distribution infrastructure connects licensed medical patients, registered social clubs, and verified boutique dispensaries across Germany.
                </p>
              </div>

              {/* 2x2 Grid of Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {DELIVERY_FEATURES.map((feat, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-[#063E30] p-5 rounded-xl border border-[#E9EDE7] dark:border-white/10 shadow-sm hover:border-[#07543F]/40 transition-all"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] flex items-center justify-center mb-3">
                      {renderIcon(feat.iconName, 'w-4 h-4')}
                    </div>
                    <h3 className="font-bold text-sm text-[#063E30] dark:text-white mb-1.5">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-[#68756F] dark:text-white/70 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-4">
                <button
                  onClick={() => navigateTo('about')}
                  className="px-6 py-3 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white text-xs font-bold transition-colors shadow-sm"
                >
                  Review Courier Security Standards
                </button>
                <button
                  onClick={() => navigateTo('contact')}
                  className="text-xs font-bold text-[#F28A19] hover:underline flex items-center gap-1"
                >
                  Dispatch Advisory Inquiries →
                </button>
              </div>
            </div>

            {/* Right Column (5 cols): Large Photograph with Caption */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-[#E9EDE7] dark:border-white/10 group">
                <img
                  src="/src/assets/images/delivery_fleet_retail_1793700802596.jpg"
                  alt="Canabis Hub Express Electric Delivery Fleet in Berlin"
                  className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Small dark caption overlay */}
                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-[#063E30] via-[#063E30]/80 to-transparent text-white">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#F28A19] uppercase tracking-wider mb-1">
                    <span className="w-2 h-2 rounded-full bg-[#F28A19]" />
                    Berlin & Munich Active Fleet
                  </div>
                  <p className="text-xs text-[#FFFDF8]/90 font-medium leading-relaxed">
                    Zero-emission temperature-regulated transport adhering to Good Distribution Practice (GDP) guidelines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: SHOP BY CATEGORY
          Centered category section, horizontal row of image-based tiles,
          square product/category image, thin orange border, rounded corners,
          small category label, subtle hover animation.
         ========================================================================= */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            BOTANICAL PORTFOLIO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-3">
            Shop by Category
          </h2>
          <p className="text-sm text-[#68756F] dark:text-white/70">
            Explore curated formulations categorized by extraction methodology, consumption form, and therapeutic application.
          </p>
        </div>

        {/* Row of Category Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
          {CATEGORIES_DATA.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                if (cat.id === 'flower') navigateTo('flower-farms');
                else if (cat.id === 'edibles') navigateTo('edibles');
                else if (cat.id === 'vapes') navigateTo('vapes');
                else navigateTo('shop');
              }}
              className="group text-center focus:outline-none flex flex-col items-center"
            >
              {/* Square image with thin orange border */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden border border-[#F28A19]/30 dark:border-white/10 group-hover:border-[#F28A19] shadow-sm group-hover:shadow-md transition-all duration-300 relative bg-[#FFFDF8] dark:bg-[#063E30] p-2 flex items-center justify-center">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Small Category Label */}
              <div className="mt-3">
                <h4 className="font-bold text-sm text-[#063E30] dark:text-white group-hover:text-[#F28A19] transition-colors leading-tight">
                  {cat.name}
                </h4>
                <span className="text-[11px] text-[#68756F] dark:text-white/60 mt-0.5 block">
                  {cat.count}
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: FEATURED PRODUCTS (INFORMATIONAL PRODUCT SHOWCASE)
         ========================================================================= */}
      <section className="py-16 bg-[#FFFDF8] dark:bg-[#041F18] border-t border-[#E9EDE7] dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
                VERIFIED CULTIVARS & EXTRACTS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063E30] dark:text-white tracking-tight">
                Featured Product Monographs
              </h2>
            </div>
            <p className="text-xs text-[#68756F] dark:text-white/70 max-w-md">
              Educational product showcase with certified laboratory batch numbers and terpene profiles. Non-transactional informational database.
            </p>
          </div>

          {/* 4-Column Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRODUCTS_DATA.map((product) => {
              const saved = isItemSaved(product.id);
              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-[#063E30] rounded-2xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Image Area with Save Button */}
                    <div className="relative aspect-square overflow-hidden bg-[#F4F6F2] dark:bg-[#073B2E]/50 p-4 flex items-center justify-center">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSaveItem(product.id);
                        }}
                        className={`absolute top-6 right-6 w-9 h-9 rounded-full flex items-center justify-center shadow-md transition-all ${
                          saved
                            ? 'bg-[#F28A19] text-white'
                            : 'bg-white/90 dark:bg-[#063E30]/90 text-[#263A36] dark:text-white hover:text-[#07543F]'
                        }`}
                        title={saved ? 'Remove from Saved' : 'Save for Reference'}
                        aria-label="Save product"
                      >
                        <Bookmark
                          className={`w-4 h-4 ${saved ? 'fill-white' : ''}`}
                        />
                      </button>

                      {/* Small strain tag */}
                      <span className="absolute bottom-6 left-6 px-2.5 py-1 rounded bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white uppercase tracking-wider">
                        {product.strainType}
                      </span>
                    </div>

                    {/* Card Content */}
                    <div className="p-5">
                      {/* Small Category Label */}
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-bold text-[11px] text-[#F28A19] uppercase tracking-wider">
                          {product.category}
                        </span>
                        <span className="text-[10px] font-mono text-[#68756F] dark:text-white/50">
                          {product.labBatch}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => navigateTo('product-detail', product.id)}
                        className="font-bold text-base text-[#063E30] dark:text-white hover:text-[#07543F] dark:hover:text-[#F28A19] cursor-pointer mb-2 line-clamp-1"
                      >
                        {product.name}
                      </h3>

                      {/* Informational description */}
                      <p className="text-xs text-[#68756F] dark:text-white/70 leading-relaxed line-clamp-2 mb-4">
                        {product.description}
                      </p>

                      {/* Informational Product Attributes */}
                      <div className="pt-3 border-t border-[#E9EDE7] dark:border-white/10 space-y-1.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-[#68756F] dark:text-white/60">Potency / Price:</span>
                          <span className="font-semibold text-[#07543F] dark:text-emerald-400">
                            {product.type === 'informational' ? `THC ${product.thc}` : `€${product.price?.toFixed(2)}`}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[#68756F] dark:text-white/60">Profile:</span>
                          <span className="font-medium text-[#263A36] dark:text-white/80 truncate max-w-[140px]">
                            {product.terpenes ? product.terpenes.join(', ') : 'Botanical Standard'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Link */}
                  <div className="px-5 pb-5 pt-0">
                    <button
                      onClick={() => navigateTo('product-detail', product.id)}
                      className="w-full py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] hover:bg-[#07543F] dark:hover:bg-[#07543F] hover:text-white border border-[#E9EDE7] dark:border-white/10 text-xs font-bold text-[#063E30] dark:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>View Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Centered button */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigateTo('shop')}
              className="px-8 py-3.5 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
            >
              <span>Explore All 34+ Monograph Records</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: PURE, CLEAN, CERTIFIED CANNABIS MEDICINE
         ========================================================================= */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#073B2E] rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden shadow-2xl border border-[#063E30]">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#07543F]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#F28A19]/20 text-[#F28A19] text-xs font-bold uppercase tracking-wider">
                <FlaskConical className="w-3.5 h-3.5" />
                ACCREDITED QUALITY SURVEILLANCE
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Pure, Clean, Certified <span className="text-[#F28A19]">Cannabis Standards</span>
              </h2>

              <p className="text-sm sm:text-base text-[#FFFDF8]/85 leading-relaxed max-w-xl">
                Every cultivar, tincture, and concentrate cataloged on Canabis Hub is supported by comprehensive independent analytical screening conforming to European Pharmacopoeia monographs.
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('about')}
                  className="px-7 py-3.5 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
                >
                  <span>Explore Lab Methodology</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-8 border-t border-white/15 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#F28A19] font-mono">
                    99.8%
                  </div>
                  <div className="text-xs text-[#FFFDF8]/75 mt-0.5">
                    Purity Testing Threshold
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#F28A19] font-mono">
                    24h
                  </div>
                  <div className="text-xs text-[#FFFDF8]/75 mt-0.5">
                    Batch Testing Turnaround
                  </div>
                </div>

                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-[#F28A19] font-mono">
                    ISO/IEC
                  </div>
                  <div className="text-xs text-[#FFFDF8]/75 mt-0.5">
                    17025 Accredited Labs
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/20">
                <img
                  src="/src/assets/images/hero_lab_testing_1793700802431.jpg"
                  alt="High-Tech Pharmaceutical Cannabis Analytical Laboratory"
                  className="w-full h-[360px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-5">
                  <span className="text-xs text-white/90 font-medium">
                    State-of-the-art HPLC and GC-MS analytical instrumentation in Berlin, Germany.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: WHY CHOOSE US
         ========================================================================= */}
      <section className="py-20 bg-[#FFFDF8] dark:bg-[#041F18] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
              PLATFORM PILLARS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-3">
              Why Professionals & Consumers Trust Canabis Hub
            </h2>
            <p className="text-sm text-[#68756F] dark:text-white/70">
              Dedicated to transparency, pharmacological rigor, and uncompromised botanical integrity across the German federation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE_US_CARDS.map((card) => (
              <div
                key={card.id}
                className="bg-white dark:bg-[#063E30] rounded-2xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={card.image}
                      alt={card.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  <div className="p-5">
                    <span className="text-[11px] font-bold text-[#F28A19] uppercase tracking-wider block mb-2">
                      {card.category}
                    </span>

                    <h3 className="font-bold text-base text-[#063E30] dark:text-white mb-2 leading-snug">
                      {card.title}
                    </h3>

                    <p className="text-xs text-[#68756F] dark:text-white/70 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <button
                    onClick={() => navigateTo(card.linkSlug as any)}
                    className="text-xs font-bold text-[#07543F] dark:text-[#F28A19] hover:text-[#F28A19] transition-colors flex items-center gap-1 group/btn"
                  >
                    <span>{card.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: HOW TO EXPLORE CANABIS HUB
         ========================================================================= */}
      <section className="py-20 bg-[#073B2E] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
              STEP-BY-STEP PLATFORM GUIDE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              HOW TO EXPLORE CANABIS HUB
            </h2>
            <p className="text-sm text-[#FFFDF8]/80">
              Navigate verified European genetics, analytical chemistry reports, and harm-reduction education in three intuitive steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_TO_EXPLORE_STEPS.map((stepItem, idx) => (
              <div
                key={idx}
                className="bg-[#063E30] rounded-2xl p-8 border border-white/10 hover:border-[#F28A19]/50 transition-all flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-3xl font-extrabold text-[#F28A19]">
                      {stepItem.step}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[#F28A19]">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-3">
                    {stepItem.title}
                  </h3>

                  <p className="text-sm text-[#FFFDF8]/75 leading-relaxed mb-6">
                    {stepItem.description}
                  </p>
                </div>

                <button
                  onClick={() => navigateTo(stepItem.targetPage as any)}
                  className="w-full py-3 rounded-xl bg-white/10 hover:bg-[#F28A19] hover:text-white text-[#FFFDF8] font-bold text-xs uppercase tracking-wider transition-all"
                >
                  {stepItem.actionText} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 9: LATEST BLOG POSTS
         ========================================================================= */}
      <section className="py-20 bg-white dark:bg-[#073B2E]/40 border-b border-[#E9EDE7] dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
              BOTANICAL INTELLIGENCE
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-3">
              Latest Insights & Industry News
            </h2>
            <p className="text-sm text-[#68756F] dark:text-white/70">
              Scientific analyses, extraction protocols, and legal developments reviewed by pharmacological authorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {BLOG_POSTS.map((post) => (
              <article
                key={post.id}
                className="bg-[#FFFDF8] dark:bg-[#063E30] rounded-2xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/40 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="h-44 w-full overflow-hidden bg-slate-100 relative">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-3 left-3 bg-[#063E30]/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded uppercase">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-[#68756F] dark:text-white/60 mb-2">
                      <span>{post.date}</span>
                      <span>·</span>
                      <span>{post.readTime}</span>
                    </div>

                    <h3
                      onClick={() => navigateTo('blog-post', post.slug)}
                      className="font-bold text-base text-[#063E30] dark:text-white hover:text-[#07543F] dark:hover:text-[#F28A19] cursor-pointer mb-2.5 leading-snug line-clamp-2"
                    >
                      {post.title}
                    </h3>

                    <p className="text-xs text-[#68756F] dark:text-white/70 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-2">
                  <button
                    onClick={() => navigateTo('blog-post', post.slug)}
                    className="text-xs font-bold text-[#F28A19] hover:text-[#d9750d] transition-colors flex items-center gap-1 group/link"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              onClick={() => navigateTo('blog')}
              className="px-8 py-3 rounded-xl border border-[#07543F] text-[#07543F] dark:text-white dark:border-white/30 hover:bg-[#07543F] hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
            >
              Explore Full Editorial Library
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 10: FREQUENTLY ASKED QUESTIONS
         ========================================================================= */}
      <section className="py-20 bg-[#FFFDF8] dark:bg-[#041F18] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-3">
              Clear Answers on Standards & Compliance
            </h2>
            <p className="text-sm text-[#68756F] dark:text-white/70">
              Everything you need to know regarding Canabis Hub, legal frameworks, and botanical vetting.
            </p>
          </div>

          <div className="divide-y divide-[#E9EDE7] dark:divide-white/10 border-y border-[#E9EDE7] dark:border-white/10 bg-white dark:bg-[#063E30] rounded-2xl shadow-sm px-6">
            {FAQ_ITEMS.map((faq, index) => {
              const isOpen = expandedFaqIndex === index;
              return (
                <div key={index} className="py-5">
                  <button
                    onClick={() => setExpandedFaqIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left group focus:outline-none"
                  >
                    <span className="font-bold text-base sm:text-lg text-[#063E30] dark:text-white group-hover:text-[#07543F] transition-colors pr-4">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-[#F28A19] flex items-center justify-center shrink-0 group-hover:bg-[#F28A19] group-hover:text-white transition-colors">
                      {isOpen ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="pt-3 pb-2 text-sm text-[#68756F] dark:text-white/70 leading-relaxed animate-fadeIn">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-8 text-center text-xs text-[#68756F] dark:text-white/60">
            Have a question not addressed here?{' '}
            <button
              onClick={() => navigateTo('contact')}
              className="text-[#F28A19] font-bold hover:underline"
            >
              Contact our Berlin Compliance Desk
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 11: ORANGE CTA BANNER
         ========================================================================= */}
      <section className="bg-[#F28A19] text-white py-16 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-black/10 rounded-full blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Have Questions or Need Guidance?
            </h2>

            <p className="text-base sm:text-lg text-white/95 leading-relaxed max-w-2xl mx-auto">
              Our multidisciplinary team of pharmacologists, agricultural specialists, and compliance advisors is available to guide licensed facilities, clinicians, and adult consumers.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('contact')}
                className="px-8 py-3.5 rounded-full bg-white text-[#F28A19] font-bold text-sm shadow-lg hover:bg-[#FFFDF8] hover:scale-105 active:scale-95 transition-all"
              >
                Contact Advisory Desk
              </button>

              <button
                onClick={() => navigateTo('faq')}
                className="px-8 py-3.5 rounded-full bg-transparent hover:bg-white/15 text-white font-bold text-sm border-2 border-white transition-all"
              >
                Explore Full FAQ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

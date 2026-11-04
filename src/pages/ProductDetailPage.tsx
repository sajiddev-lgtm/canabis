/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductItem } from '../data/cannabisData';
import {
  Bookmark,
  ShoppingBag,
  ArrowLeft,
  Share2,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Info,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  FlaskConical,
  HelpCircle,
  Eye,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const {
    pageParam,
    navigateTo,
    allProducts,
    isItemSaved,
    toggleSaveItem,
    addToCart,
    addRecentlyViewed,
    recentlyViewedIds,
    currentUser,
  } = useApp();

  // Find product by id from param or fallback to first product
  const product: ProductItem | undefined =
    allProducts.find((p) => p.id === pageParam) || allProducts[0];

  const [activeImage, setActiveImage] = useState<string>(product?.image || '');
  const [quantity, setQuantity] = useState<number>(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Sync active image when product changes
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      addRecentlyViewed(product.id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [product?.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-20 text-center">
        <h2 className="text-xl font-bold text-[#063E30] dark:text-white mb-4">
          Product Listing Not Found
        </h2>
        <button
          onClick={() => navigateTo('shop')}
          className="px-6 py-2.5 bg-[#07543F] text-white rounded-xl text-xs font-bold"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const isPermitted = product.type === 'permitted_merchandise';
  const saved = isItemSaved(product.id);

  // Gallery images list
  const galleryImages = product.gallery && product.gallery.length > 0
    ? product.gallery
    : [product.image];

  // Related products from same category or brand
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.brand === product.brand))
    .slice(0, 4);

  // Recently viewed products (excluding current)
  const recentProducts = allProducts
    .filter((p) => p.id !== product.id && recentlyViewedIds.includes(p.id))
    .slice(0, 4);

  // Pre-configured WhatsApp query URL
  const WHATSAPP_NUMBER = '493089204401';
  const getWhatsAppProductUrl = () => {
    let text = '';
    const originUrl = typeof window !== 'undefined' ? `${window.location.origin}/?product=${product.id}` : '';
    if (isPermitted) {
      text = `Hello Canabis Hub Support, I would like more information regarding the botanical accessory "${product.name}" (SKU: ${product.sku || 'N/A'}, Price: €${product.price?.toFixed(2)}). Product URL: ${originUrl}. Could you please advise on specifications and availability?`;
    } else {
      text = `Hello Canabis Hub Support, I have a general customer service question regarding the educational monograph "${product.name}" (Batch: ${product.labBatch || product.sku || 'DE-LAB'}).`;
    }
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  };

  const handleShare = () => {
    const url = `${window.location.origin}/?product=${product.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Default FAQs if product does not have custom ones
  const faqs = product.faq && product.faq.length > 0 ? product.faq : [
    {
      question: isPermitted
        ? 'What materials and quality standards are used for this accessory?'
        : 'How is analytical laboratory testing conducted for this monograph?',
      answer: isPermitted
        ? 'All Canabis Hub hardware and storage accessories are manufactured from certified non-toxic materials, including aerospace-grade anodized aluminum, biophotonic Miron violet glass, and food-grade silicone compliant with EU LFGB standards.'
        : 'All cataloged cultivars undergo comprehensive testing in ISO/IEC 17025 accredited European analytical laboratories, auditing potency (HPLC-UV), pesticide residues (LC-MS/MS), heavy metals (ICP-MS), and foreign matter under German pharmacopoeia standards.'
    },
    {
      question: isPermitted
        ? 'What are the delivery and shipping policies in Germany?'
        : 'Can this cannabis cultivar be purchased online or delivered?',
      answer: isPermitted
        ? 'Botanical hardware and storage accessories are dispatched within 24 business hours from our Berlin fulfillment center. Standard delivery across Germany takes 2-3 business days via carbon-neutral DHL GoGreen.'
        : 'No. In compliance with the German Cannabis Act (CanG) and federal drug regulations, whole-flower cannabis monographs are strictly non-commercial educational records. Online ordering and mail-order commercial delivery of controlled cannabis substances are legally prohibited.'
    },
    {
      question: 'What is the recommended storage temperature and humidity?',
      answer: 'Botanicals and organic materials should ideally be stored between 15°C and 20°C in an airtight biophotonic violet glass vessel paired with a 58% or 62% RH terpene shield humidity pack to prevent photochemical oxidation and volatile mono-terpene evaporation.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-8 sm:py-12 text-[#263A36] dark:text-[#E2E8F0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Return Nav */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#68756F] dark:text-white/60">
            <button
              onClick={() => navigateTo('home')}
              className="hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors"
            >
              Home
            </button>
            <span aria-hidden="true">/</span>
            <button
              onClick={() => navigateTo('shop')}
              className="hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors"
            >
              Catalog & Shop
            </button>
            <span aria-hidden="true">/</span>
            <span className="text-[#68756F] dark:text-white/50">{product.category}</span>
            <span aria-hidden="true">/</span>
            <span className="text-[#07543F] dark:text-[#F28A19] font-semibold truncate max-w-xs">
              {product.name}
            </span>
          </nav>

          <button
            onClick={() => navigateTo('shop')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#063E30] dark:text-white/90 hover:text-[#07543F] dark:hover:text-[#F28A19] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Listings</span>
          </button>
        </div>

        {/* Main Product Showcase Section (2-Column Desktop Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start mb-16">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Large Image Container */}
            <div className="aspect-square bg-white dark:bg-[#063E30] rounded-3xl p-6 border border-[#E9EDE7] dark:border-white/10 shadow-sm relative overflow-hidden flex items-center justify-center group">
              <img
                src={activeImage}
                alt={product.name}
                loading="eager"
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500 ease-out"
              />

              {/* Status / Badge Overlay */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                {product.badge && (
                  <span className="px-3 py-1 rounded-lg bg-[#F28A19] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
                <span className={`px-3 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider backdrop-blur-md shadow-sm ${
                  isPermitted
                    ? 'bg-[#07543F]/90 text-white'
                    : 'bg-[#041F18]/85 text-white border border-white/20'
                }`}>
                  {isPermitted ? 'Permitted Accessory' : (product.strainType || 'Monograph')}
                </span>
              </div>

              {/* Floating Quick Action: Wishlist */}
              <button
                onClick={() => toggleSaveItem(product.id)}
                className={`absolute top-6 right-6 w-11 h-11 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
                  saved
                    ? 'bg-[#F28A19] text-white scale-110'
                    : 'bg-white/90 dark:bg-[#073B2E]/90 text-[#263A36] dark:text-white hover:text-[#07543F] dark:hover:text-[#F28A19]'
                }`}
                aria-label={saved ? 'Remove from Wishlist' : 'Add to Wishlist'}
                title={saved ? 'Remove from Wishlist' : 'Save to Wishlist'}
              >
                <Bookmark className={`w-5 h-5 ${saved ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Gallery Bar (if multiple images) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 p-1 bg-white dark:bg-[#063E30] ${
                      activeImage === img
                        ? 'border-[#07543F] dark:border-[#F28A19] shadow-md'
                        : 'border-[#E9EDE7] dark:border-white/10 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Quality Standards Guarantee Strip */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-white dark:bg-[#063E30] rounded-2xl border border-[#E9EDE7] dark:border-white/10 text-center text-xs">
              <div className="space-y-1">
                <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <span className="font-bold block text-[11px] text-[#063E30] dark:text-white">
                  {isPermitted ? 'Certified Materials' : 'ISO/IEC 17025'}
                </span>
                <span className="text-[10px] text-[#68756F] dark:text-white/50 block">
                  {isPermitted ? 'LFGB & EU Food-Grade' : 'Accredited Lab Audit'}
                </span>
              </div>
              <div className="space-y-1 border-x border-[#E9EDE7] dark:border-white/10">
                <Truck className="w-5 h-5 text-[#F28A19] mx-auto" />
                <span className="font-bold block text-[11px] text-[#063E30] dark:text-white">
                  {isPermitted ? 'Fast DE Dispatch' : 'Verified Monograph'}
                </span>
                <span className="text-[10px] text-[#68756F] dark:text-white/50 block">
                  {isPermitted ? 'Discreet 24h Packaging' : 'Official Central Index'}
                </span>
              </div>
              <div className="space-y-1">
                <RotateCcw className="w-5 h-5 text-[#07543F] dark:text-emerald-400 mx-auto" />
                <span className="font-bold block text-[11px] text-[#063E30] dark:text-white">
                  {isPermitted ? '14-Day Returns' : 'Harm Reduction'}
                </span>
                <span className="text-[10px] text-[#68756F] dark:text-white/50 block">
                  {isPermitted ? 'Unopened Hardware' : 'Responsible Use 18+'}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Information & Controls (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Header: Brand & Title */}
            <div>
              <div className="flex items-center justify-between gap-2 text-xs mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-widest text-[#F28A19]">
                    {product.brand}
                  </span>
                  <span className="text-[#68756F] dark:text-white/40">·</span>
                  <span className="text-xs text-[#68756F] dark:text-white/60">
                    {product.category}
                  </span>
                </div>

                {product.sku && (
                  <span className="font-mono text-[11px] text-[#68756F] dark:text-white/50">
                    SKU: {product.sku}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#063E30] dark:text-white tracking-tight leading-tight mb-3">
                {product.name}
              </h1>

              {product.short_description && (
                <p className="text-sm text-[#07543F] dark:text-emerald-300 font-medium leading-relaxed">
                  {product.short_description}
                </p>
              )}
            </div>

            {/* Pricing or Legal Compliance Notice */}
            {isPermitted ? (
              <div className="p-5 bg-white dark:bg-[#063E30] rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-2">
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold font-mono text-[#07543F] dark:text-emerald-400">
                      €{product.price?.toFixed(2)}
                    </span>
                    <span className="text-xs text-[#68756F] dark:text-white/60">
                      incl. 19% German VAT
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    In Stock
                  </span>
                </div>
                <p className="text-xs text-[#68756F] dark:text-white/60">
                  Ready to dispatch from Berlin. Delivery within Germany: 2–3 business days. Free shipping on orders over €50.
                </p>
              </div>
            ) : (
              <div className="p-5 bg-amber-50/70 dark:bg-[#073B2E] rounded-2xl border border-amber-200/80 dark:border-amber-500/30 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#F28A19]">
                  <Info className="w-4 h-4 text-[#F28A19]" />
                  CANNA-ACT (CANG) REGULATORY MONOGRAPH NOTICE
                </div>
                <p className="text-xs text-[#263A36] dark:text-white/80 leading-relaxed">
                  This page represents a verified botanical monograph for laboratory documentation and cultivar education under the German Cannabis Act. <strong>Online consumer purchasing, commercial payment, or mail delivery of controlled cannabis flowers is prohibited by law.</strong>
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs pt-1 text-[#063E30] dark:text-white font-mono font-medium">
                  {product.thc && <span>THC: <strong>{product.thc}</strong></span>}
                  {product.cbd && <span>CBD: <strong>{product.cbd}</strong></span>}
                  {product.labBatch && <span>Batch: <strong>{product.labBatch}</strong></span>}
                </div>
              </div>
            )}

            {/* Product Full Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white">
                Product Description
              </h3>
              <p className="text-sm text-[#263A36]/80 dark:text-white/80 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Interactive Purchase / Inquiry CTA Bar */}
            <div className="space-y-3 pt-2">
              {isPermitted ? (
                <div className="flex flex-col sm:flex-row items-stretch gap-3">
                  {/* Quantity Selector */}
                  <div className="flex items-center justify-between border border-[#E9EDE7] dark:border-white/10 rounded-2xl bg-white dark:bg-[#063E30] px-4 py-3 shrink-0 sm:w-36">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="text-lg font-bold text-slate-500 hover:text-[#07543F] dark:hover:text-white transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-sm text-[#063E30] dark:text-white">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="text-lg font-bold text-slate-500 hover:text-[#07543F] dark:hover:text-white transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => addToCart(product, quantity)}
                    className="flex-1 py-4 px-6 rounded-2xl bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold text-sm uppercase tracking-wider transition-all shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>Add to Bag · €{( (product.price || 0) * quantity ).toFixed(2)}</span>
                  </button>
                </div>
              ) : null}

              {/* Action Buttons: Wishlist, WhatsApp Consultation & Share */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Wishlist Toggle Button with Immediate Feedback */}
                <button
                  onClick={() => toggleSaveItem(product.id)}
                  className={`py-3.5 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                    saved
                      ? 'bg-[#F28A19] text-white border-transparent shadow-md'
                      : 'bg-white dark:bg-[#063E30] border-[#E9EDE7] dark:border-white/10 text-[#063E30] dark:text-white hover:border-[#07543F]'
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? 'fill-white' : ''}`} />
                  <span>{saved ? 'Saved to Your Wishlist' : 'Save to Wishlist'}</span>
                </button>

                {/* WhatsApp Product Information Button */}
                <a
                  href={getWhatsAppProductUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>
                    {isPermitted ? 'WhatsApp Product Inquiry' : 'Ask Monograph Support'}
                  </span>
                </a>
              </div>

              {/* Share & Account Sync note */}
              <div className="flex items-center justify-between text-xs text-[#68756F] dark:text-white/60 pt-1">
                <span>
                  {currentUser
                    ? `Synced to ${currentUser.name}'s account`
                    : 'Log in to permanently sync wishlist across devices'}
                </span>

                <button
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-[#07543F] dark:hover:text-[#F28A19] font-medium"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedLink ? 'Link Copied!' : 'Share Page'}</span>
                </button>
              </div>
            </div>

            {/* Quick Monograph Attributes if Cannabis */}
            {!isPermitted && product.terpenes && product.terpenes.length > 0 && (
              <div className="p-4 bg-white dark:bg-[#063E30] rounded-2xl border border-[#E9EDE7] dark:border-white/10 text-xs space-y-2">
                <span className="font-bold text-xs uppercase tracking-wider text-[#063E30] dark:text-white block">
                  Dominant Terpene Profile
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.terpenes.map((terp) => (
                    <span
                      key={terp}
                      className="px-2.5 py-1 rounded-lg bg-[#F4F6F2] dark:bg-[#073B2E] text-[#07543F] dark:text-emerald-300 font-semibold text-[11px] border border-[#E9EDE7] dark:border-white/10"
                    >
                      {terp}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Technical Specifications Section */}
        <div className="mb-16 bg-white dark:bg-[#063E30] rounded-3xl p-6 sm:p-10 border border-[#E9EDE7] dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F28A19] mb-2">
            <FlaskConical className="w-4 h-4" />
            TECHNICAL MONOGRAPH & SPECIFICATIONS
          </div>
          <h2 className="text-2xl font-extrabold text-[#063E30] dark:text-white mb-6">
            Detailed Product Specifications
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.specifications && Object.keys(product.specifications).length > 0 ? (
              Object.entries(product.specifications).map(([key, val]) => (
                <div
                  key={key}
                  className="p-4 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 flex justify-between items-center text-xs"
                >
                  <span className="font-semibold text-[#68756F] dark:text-white/60">{key}</span>
                  <span className="font-bold text-[#063E30] dark:text-white text-right max-w-xs">{val}</span>
                </div>
              ))
            ) : (
              <>
                <div className="p-4 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#68756F] dark:text-white/60">Category</span>
                  <span className="font-bold text-[#063E30] dark:text-white">{product.category}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#68756F] dark:text-white/60">Brand</span>
                  <span className="font-bold text-[#063E30] dark:text-white">{product.brand}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#68756F] dark:text-white/60">Country of Origin</span>
                  <span className="font-bold text-[#063E30] dark:text-white">{product.origin || 'Germany'}</span>
                </div>
                <div className="p-4 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 flex justify-between items-center text-xs">
                  <span className="font-semibold text-[#68756F] dark:text-white/60">Batch Reference</span>
                  <span className="font-bold font-mono text-[#063E30] dark:text-white">{product.labBatch || product.sku}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Informational FAQ Accordion Section */}
        <div className="mb-16 bg-white dark:bg-[#063E30] rounded-3xl p-6 sm:p-10 border border-[#E9EDE7] dark:border-white/10 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#F28A19] mb-2">
            <HelpCircle className="w-4 h-4" />
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="text-2xl font-extrabold text-[#063E30] dark:text-white mb-6">
            Everything You Need to Know
          </h2>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-[#E9EDE7] dark:border-white/10 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 bg-[#FFFDF8] dark:bg-[#073B2E] hover:bg-[#F4F6F2] dark:hover:bg-[#084b3b] transition-colors"
                  >
                    <span className="font-bold text-sm text-[#063E30] dark:text-white">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-[#F28A19] shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="p-5 bg-white dark:bg-[#063E30] text-xs text-[#263A36]/80 dark:text-white/80 leading-relaxed border-t border-[#E9EDE7] dark:border-white/10">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
                  CURATED SELECTION
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white">
                  Related Products & Equipment
                </h2>
              </div>
              <button
                onClick={() => navigateTo('shop')}
                className="text-xs font-bold text-[#07543F] dark:text-[#F28A19] hover:underline"
              >
                View Full Catalog →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((item) => {
                const itemSaved = isItemSaved(item.id);
                const itemPermitted = item.type === 'permitted_merchandise';

                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-[#063E30] rounded-2xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F]/50 dark:hover:border-[#F28A19]/50 hover:shadow-lg transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    <div>
                      {/* Image container */}
                      <div className="aspect-square bg-[#F4F6F2] dark:bg-[#073B2E]/50 p-4 relative overflow-hidden flex items-center justify-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          loading="lazy"
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-300"
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveItem(item.id);
                          }}
                          className={`absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all ${
                            itemSaved
                              ? 'bg-[#F28A19] text-white'
                              : 'bg-white/90 dark:bg-[#063E30]/90 text-[#263A36] dark:text-white hover:text-[#07543F]'
                          }`}
                          aria-label={itemSaved ? 'Remove from wishlist' : 'Save to wishlist'}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${itemSaved ? 'fill-white' : ''}`} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28A19] block mb-1">
                          {item.brand}
                        </span>
                        <h3
                          onClick={() => navigateTo('product-detail', item.id)}
                          className="font-bold text-sm text-[#063E30] dark:text-white hover:text-[#07543F] dark:hover:text-[#F28A19] cursor-pointer line-clamp-1 mb-1.5"
                        >
                          {item.name}
                        </h3>
                        <p className="text-xs text-[#68756F] dark:text-white/60 line-clamp-2 mb-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0">
                      <div className="pt-2 border-t border-[#E9EDE7] dark:border-white/10 flex items-center justify-between mb-3">
                        <span className="text-[11px] text-[#68756F] dark:text-white/60">
                          {itemPermitted ? 'Price:' : 'Type:'}
                        </span>
                        <span className="font-bold text-xs text-[#07543F] dark:text-emerald-400">
                          {itemPermitted ? `€${item.price?.toFixed(2)}` : (item.strainType || 'Monograph')}
                        </span>
                      </div>

                      <button
                        onClick={() => navigateTo('product-detail', item.id)}
                        className="w-full py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] hover:bg-[#07543F] dark:hover:bg-[#07543F] hover:text-white text-xs font-bold text-[#063E30] dark:text-white border border-[#E9EDE7] dark:border-white/10 transition-all text-center"
                      >
                        View Full Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recently Viewed Products */}
        {recentProducts.length > 0 && (
          <div className="pt-8 border-t border-[#E9EDE7] dark:border-white/10">
            <h3 className="text-xs font-bold uppercase tracking-widest text-[#68756F] dark:text-white/60 mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-[#F28A19]" />
              RECENTLY VIEWED MONOGRAPHS & ACCESSORIES
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {recentProducts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigateTo('product-detail', item.id)}
                  className="p-3 bg-white dark:bg-[#063E30] rounded-xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F] cursor-pointer flex items-center gap-3 group transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-[#063E30] dark:text-white truncate group-hover:text-[#F28A19] transition-colors">
                      {item.name}
                    </p>
                    <span className="text-[10px] text-[#68756F] dark:text-white/60">
                      {item.type === 'permitted_merchandise' ? `€${item.price?.toFixed(2)}` : item.brand}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

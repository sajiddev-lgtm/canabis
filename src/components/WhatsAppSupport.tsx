/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageCircle,
  X,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export const WhatsAppSupport: React.FC = () => {
  const { currentPage, pageParam, allProducts } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Verified contact number from project configuration
  const WHATSAPP_NUMBER = '493089204401';

  // Determine current active product if viewing product-detail
  const activeProduct =
    currentPage === 'product-detail' && pageParam
      ? allProducts.find((p) => p.id === pageParam)
      : null;

  const isPermitted = activeProduct?.type === 'permitted_merchandise';

  // Construct context-specific compliant messages
  const getWhatsAppUrl = (customTopic?: string) => {
    let messageText = '';

    if (customTopic) {
      messageText = `Hello Canabis Hub Support, I have an inquiry regarding: ${customTopic}.`;
    } else if (activeProduct) {
      if (isPermitted) {
        // Permitted non-controlled merchandise
        const skuPart = activeProduct.sku ? ` (SKU: ${activeProduct.sku})` : '';
        const pricePart = activeProduct.price ? `, €${activeProduct.price.toFixed(2)}` : '';
        const originUrl = typeof window !== 'undefined' ? `${window.location.origin}/?product=${activeProduct.id}` : '';
        messageText = `Hello Canabis Hub Support, I would like more information regarding the botanical accessory "${activeProduct.name}"${skuPart}${pricePart}. Product URL: ${originUrl}. Could you please provide further details on product specifications and maintenance?`;
      } else {
        // Cannabis monograph: strictly neutral general customer-support inquiry, no transaction/order/delivery
        const batchPart = activeProduct.labBatch ? ` (Batch: ${activeProduct.labBatch})` : '';
        messageText = `Hello Canabis Hub Support, I have a general customer service question regarding the educational monograph "${activeProduct.name}"${batchPart}.`;
      }
    } else {
      messageText = 'Hello Canabis Hub Support, I have an inquiry regarding the Canabis Hub Germany platform and botanical catalog.';
    }

    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
  };

  return (
    <aside aria-label="Customer Support" className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Interactive Expandable Support Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 bg-white dark:bg-[#063E30] text-[#263A36] dark:text-white rounded-3xl p-5 shadow-2xl border border-[#E9EDE7] dark:border-white/10 animate-fadeIn space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between pb-3 border-b border-[#E9EDE7] dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-md">
                <MessageCircle className="w-6 h-6 fill-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-extrabold text-sm text-[#063E30] dark:text-white">
                    Canabis Hub Support
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-[#68756F] dark:text-white/60">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Berlin Advisory Desk · Online</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Contextual Notice */}
          {activeProduct ? (
            <div className="p-3 bg-[#F4F6F2] dark:bg-[#073B2E] rounded-2xl border border-[#E9EDE7] dark:border-white/10 text-xs space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F28A19] block">
                {isPermitted ? 'Product Information Desk' : 'Monograph Advisory'}
              </span>
              <p className="font-bold text-[#063E30] dark:text-white line-clamp-1">
                {activeProduct.name}
              </p>
              {isPermitted ? (
                <div className="flex items-center justify-between text-[11px] text-[#68756F] dark:text-white/70 pt-0.5">
                  <span>SKU: {activeProduct.sku || 'ACC-STD'}</span>
                  <span className="font-mono font-bold text-[#07543F] dark:text-emerald-400">
                    €{activeProduct.price?.toFixed(2)}
                  </span>
                </div>
              ) : (
                <p className="text-[11px] text-[#68756F] dark:text-white/60 leading-tight">
                  Educational Monograph · Non-commercial general inquiries only under German CanG.
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-[#68756F] dark:text-white/75 leading-relaxed">
              Have questions regarding botanical equipment, ISO/IEC 17025 lab verification, or catalog listings? Our Berlin support specialists are ready to help.
            </p>
          )}

          {/* Quick Support Option Buttons */}
          <div className="space-y-2">
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs flex items-center justify-between transition-all shadow-md group"
            >
              <span className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 fill-white" />
                {activeProduct
                  ? isPermitted
                    ? 'Ask About This Product'
                    : 'Inquire Regarding Monograph'
                  : 'Start WhatsApp Chat'}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {!activeProduct && (
              <div className="grid grid-cols-2 gap-2 text-xs">
                <a
                  href={getWhatsAppUrl('Botanical Hardware & Storage Specifications')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F] dark:hover:border-[#F28A19] text-[11px] text-[#263A36] dark:text-white/90 font-medium text-center transition-all block"
                >
                  Hardware Specs
                </a>
                <a
                  href={getWhatsAppUrl('Laboratory Certificate of Analysis (COA) Audits')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F] dark:hover:border-[#F28A19] text-[11px] text-[#263A36] dark:text-white/90 font-medium text-center transition-all block"
                >
                  Lab Testing Info
                </a>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="pt-2 border-t border-[#E9EDE7] dark:border-white/10 flex items-center justify-between text-[10px] text-[#68756F] dark:text-white/50">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#F28A19]" />
              Mon–Sat: 09:00–21:00 CET
            </span>
            <span>+49 (0) 30 8920 4401</span>
          </div>
        </div>
      )}

      {/* Floating Action Launcher Button */}
      <div className="flex items-center">
        {!isOpen && showTooltip && (
          <div className="mr-3 bg-white dark:bg-[#063E30] text-[#263A36] dark:text-white px-3.5 py-2 rounded-2xl shadow-xl text-xs font-semibold border border-[#E9EDE7] dark:border-white/10 whitespace-nowrap animate-fadeIn">
            {activeProduct
              ? isPermitted
                ? `Need info on ${activeProduct.name.slice(0, 22)}...?`
                : 'Questions on this monograph?'
              : 'Chat with our Berlin Support Desk'}
          </div>
        )}

        <button
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 ${
            isOpen
              ? 'bg-[#063E30] dark:bg-[#FFFDF8] text-white dark:text-[#063E30] rotate-90 scale-95'
              : 'bg-[#25D366] text-white hover:scale-105 active:scale-95'
          }`}
          aria-label="Toggle WhatsApp Customer Support Desk"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-7 h-7 fill-white" />
          )}
        </button>
      </div>
    </aside>
  );
};

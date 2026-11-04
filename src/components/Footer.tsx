/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Mail,
  Phone,
  MapPin,
  Clock,
  ArrowUpRight,
  ExternalLink,
  MessageCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { navigateTo, setIsAgeModalOpen } = useApp();
  const [showWhatsAppTooltip, setShowWhatsAppTooltip] = useState(false);

  return (
    <footer className="bg-[#073B2E] text-white pt-16 pb-12 border-t border-[#063E30] relative overflow-hidden">
      {/* Decorative subtle botanical line art background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#07543F]/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F28A19]/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* 4-Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Column 1: Brand & Overview */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#07543F] flex items-center justify-center text-white font-bold border border-white/20">
                <svg
                  className="w-5 h-5 text-[#FFFDF8]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M12 2a10 10 0 0 0-10 10c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                </svg>
              </div>
              <span className="font-extrabold text-2xl tracking-tight text-white">
                CANABIS<span className="text-[#F28A19] ml-1">HUB</span>
              </span>
            </div>

            <p className="text-sm text-[#FFFDF8]/75 leading-relaxed">
              Germany’s leading informational botanical hub, cataloging certified cannabis cultivars, artisanal flower farms, and third-party laboratory purity analytics under the German CanG framework.
            </p>

            <div className="pt-2 flex items-center gap-3">
              {[
                { name: 'LinkedIn', href: 'https://linkedin.com' },
                { name: 'Instagram', href: 'https://instagram.com' },
                { name: 'X (Twitter)', href: 'https://x.com' },
                { name: 'Telegram', href: 'https://telegram.org' },
              ].map((net) => (
                <a
                  key={net.name}
                  href={net.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs font-medium rounded bg-white/10 text-white/80 hover:bg-[#F28A19] hover:text-white transition-colors"
                >
                  {net.name}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation & Directories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F28A19] mb-4">
              Directory & Showcase
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FFFDF8]/80">
              <li>
                <button
                  onClick={() => navigateTo('shop')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  Product Directory
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('brands')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  All Brands Index
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('flower-farms')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  Flower Farms
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('edibles')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  Edibles & Confectionery
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('vapes')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  Ceramic Vapes & Hardware
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('about')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  About Our Standards
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('blog')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  Scientific Blog & Insights
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Compliance */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F28A19] mb-4">
              Compliance & Legal
            </h4>
            <ul className="space-y-2.5 text-sm text-[#FFFDF8]/80">
              <li>
                <button
                  onClick={() => navigateTo('privacy')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  Privacy Policy (DSGVO)
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('terms')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('cookies')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  Cookie Policy & Consent
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('responsible-use')}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
                  Responsible Use & Harm Reduction
                </button>
              </li>
              <li>
                <button
                  onClick={() => setIsAgeModalOpen(true)}
                  className="hover:text-[#F28A19] transition-colors flex items-center gap-1.5"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-[#F28A19]" />
                  Age Verification Status (18+)
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Locations */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#F28A19] mb-4">
              Regional Operations
            </h4>

            <div className="flex items-start gap-2.5 text-sm text-[#FFFDF8]/80">
              <MapPin className="w-4 h-4 text-[#F28A19] shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white">Berlin Innovation Hub</p>
                <p className="text-xs text-[#FFFDF8]/70">Friedrichstraße 120, 10117 Berlin, Germany</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 text-sm text-[#FFFDF8]/80">
              <MapPin className="w-4 h-4 text-[#F28A19] shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-white">Munich Logistics & Lab</p>
                <p className="text-xs text-[#FFFDF8]/70">Maximilianstraße 35, 80539 München, Germany</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-[#FFFDF8]/80 pt-1">
              <Clock className="w-4 h-4 text-[#F28A19] shrink-0" />
              <span className="text-xs">Mon – Sat: 09:00 – 21:00 CET</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-[#FFFDF8]/80">
              <Mail className="w-4 h-4 text-[#F28A19] shrink-0" />
              <span className="text-xs">compliance@canabishub.de</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm text-[#FFFDF8]/80">
              <Phone className="w-4 h-4 text-[#F28A19] shrink-0" />
              <span className="text-xs">+49 (0) 30 8920 4401</span>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Payment Logos (Non-transactional informational assurance) */}
        <div className="py-8 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#FFFDF8]/60">
          <p className="max-w-3xl leading-relaxed">
            <strong>Legal Information & Disclaimers:</strong> Canabis Hub is an informational directory and educational portal. In accordance with the German Cannabis Act (KCanG) and federal health mandates, we do not engage in online transactions, direct commercial sales, or mail-order distribution of controlled botanical substances. All product pages represent educational monographs and lab test records. Access is restricted to persons aged 18 and older.
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] uppercase tracking-wider text-white/40 mr-1">
              Compliant Systems:
            </span>
            {['SEPA', 'Giropay', 'SSL 256-bit', 'ISO/IEC 17025'].map((badge) => (
              <span
                key={badge}
                className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-white/80 font-mono"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FFFDF8]/60 gap-4">
          <div>
            © {new Date().getFullYear()} Canabis Hub Germany GmbH. All rights reserved. Registered under Amtsgericht Charlottenburg.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigateTo('privacy')} className="hover:text-white transition-colors">
              Datenschutz
            </button>
            <span>·</span>
            <button onClick={() => navigateTo('terms')} className="hover:text-white transition-colors">
              Impressum & AGB
            </button>
            <span>·</span>
            <button onClick={() => navigateTo('responsible-use')} className="hover:text-white transition-colors">
              Jugendschutz (18+)
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

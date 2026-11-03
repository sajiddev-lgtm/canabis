/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp, PageRoute } from '../context/AppContext';
import { ShieldCheck, Lock, FileText, AlertTriangle, ArrowLeft } from 'lucide-react';

export const LegalPage: React.FC = () => {
  const { currentPage, navigateTo } = useApp();

  const getInitialTab = (): 'privacy' | 'terms' | 'cookies' | 'responsible-use' => {
    if (currentPage === 'terms') return 'terms';
    if (currentPage === 'cookies') return 'cookies';
    if (currentPage === 'responsible-use') return 'responsible-use';
    return 'privacy';
  };

  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'cookies' | 'responsible-use'>(
    getInitialTab()
  );

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-12 text-[#263A36] dark:text-[#E2E8F0] transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-8">
          <button
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#07543F] dark:text-emerald-400 hover:text-[#F28A19] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-[#E9EDE7] dark:border-white/10 pb-4 mb-8 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'privacy'
                ? 'bg-[#07543F] text-white shadow-sm dark:bg-emerald-600'
                : 'text-[#68756F] dark:text-gray-300 hover:text-[#063E30] dark:hover:text-white hover:bg-white dark:hover:bg-[#073B2E]/60'
            }`}
          >
            Privacy Policy (DSGVO)
          </button>

          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'terms'
                ? 'bg-[#07543F] text-white shadow-sm dark:bg-emerald-600'
                : 'text-[#68756F] dark:text-gray-300 hover:text-[#063E30] dark:hover:text-white hover:bg-white dark:hover:bg-[#073B2E]/60'
            }`}
          >
            Terms & Conditions
          </button>

          <button
            onClick={() => setActiveTab('cookies')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'cookies'
                ? 'bg-[#07543F] text-white shadow-sm dark:bg-emerald-600'
                : 'text-[#68756F] dark:text-gray-300 hover:text-[#063E30] dark:hover:text-white hover:bg-white dark:hover:bg-[#073B2E]/60'
            }`}
          >
            Cookie Policy
          </button>

          <button
            onClick={() => setActiveTab('responsible-use')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === 'responsible-use'
                ? 'bg-[#07543F] text-white shadow-sm dark:bg-emerald-600'
                : 'text-[#68756F] dark:text-gray-300 hover:text-[#063E30] dark:hover:text-white hover:bg-white dark:hover:bg-[#073B2E]/60'
            }`}
          >
            Responsible Use & CanG Compliance
          </button>
        </div>

        {/* Tab Contents */}
        <div className="bg-white dark:bg-[#073B2E]/60 rounded-3xl p-8 sm:p-12 border border-[#E9EDE7] dark:border-white/10 shadow-sm">
          {activeTab === 'privacy' && (
            <div className="space-y-6 text-[#263A36] dark:text-gray-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F28A19] uppercase tracking-wider">
                <Lock className="w-4 h-4" />
                GENERAL DATA PROTECTION REGULATION (GDPR / DSGVO)
              </div>
              <h1 className="text-3xl font-extrabold text-[#063E30] dark:text-white">
                Datenschutzerklärung (Privacy Policy)
              </h1>
              <p className="text-xs text-[#68756F] dark:text-gray-400">Last updated: February 2026</p>

              <div className="space-y-4 text-sm leading-relaxed text-[#68756F] dark:text-gray-300">
                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  1. Controller Information
                </h3>
                <p>
                  Responsible controller within the meaning of Article 4(7) GDPR is Canabis Hub Germany GmbH, Friedrichstraße 120, 10117 Berlin, represented by its management board.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  2. Collection of Data for Informational Directory Services
                </h3>
                <p>
                  Canabis Hub is a non-commercial informational directory and educational portal. Cannabis listings remain non-transactional monographs. Any permitted non-cannabis botanical accessory orders and user credentials are encrypted and stored under secure server database security standards.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  3. Contact Forms & Inquiries
                </h3>
                <p>
                  If you contact us via our contact form or advisory email, your submitted data (name, email, message) is processed strictly pursuant to Art. 6(1)(b) and (f) GDPR for replying to your inquiry. We do not sell or transfer this information to third-party marketing brokers.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  4. Your Rights as a Data Subject
                </h3>
                <p>
                  You have the right to request information (Art. 15 GDPR), rectification (Art. 16 GDPR), erasure (Art. 17 GDPR), restriction of processing (Art. 18 GDPR), and data portability (Art. 20 GDPR). Please direct all data protection requests to our Data Protection Officer at privacy@canabishub.de.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-6 text-[#263A36] dark:text-gray-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F28A19] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                TERMS OF SERVICE & IMPRESSUM
              </div>
              <h1 className="text-3xl font-extrabold text-[#063E30] dark:text-white">
                Allgemeine Geschäftsbedingungen (Terms of Service)
              </h1>
              <p className="text-xs text-[#68756F] dark:text-gray-400">Effective: January 2026</p>

              <div className="space-y-4 text-sm leading-relaxed text-[#68756F] dark:text-gray-300">
                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  1. Scope of Application & Informational Purpose
                </h3>
                <p>
                  These Terms govern the use of the Canabis Hub website and directory services. Canabis Hub is an educational intelligence and catalog platform. We do not sell, distribute, or broker sales of controlled botanical substances.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  2. Age Restriction (18+)
                </h3>
                <p>
                  Access to Canabis Hub is exclusively permitted to natural persons who have attained 18 years of age. By accessing the site, users confirm their compliance with German age-of-majority regulations.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  3. Accuracy of Independent Laboratory Reports
                </h3>
                <p>
                  Monographs and batch Certificates of Analysis (COAs) displayed on the platform are provided by independent ISO/IEC 17025 accredited laboratories. While Canabis Hub exercises highest diligence in indexing verified records, we do not provide medical warranties or pharmaceutical advice.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  4. Intellectual Property
                </h3>
                <p>
                  All editorial articles, graphical interfaces, botanical diagrams, and database arrangements are protected by copyright law and remain the property of Canabis Hub Germany GmbH or its licensed brand partners.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'cookies' && (
            <div className="space-y-6 text-[#263A36] dark:text-gray-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F28A19] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                COOKIE USAGE & CONSENT MANAGEMENT
              </div>
              <h1 className="text-3xl font-extrabold text-[#063E30] dark:text-white">
                Cookie & Local Storage Policy
              </h1>
              <p className="text-xs text-[#68756F] dark:text-gray-400">Compliance with TTDSG & ePrivacy Directive</p>

              <div className="space-y-4 text-sm leading-relaxed text-[#68756F] dark:text-gray-300">
                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  1. What Are Cookies and Local Storage?
                </h3>
                <p>
                  Our platform utilizes technically essential browser local storage keys to store your age-verification confirmation (`canabis_hub_age_verified`), your selected theme preference, and your selected bookmark list.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  2. Zero Third-Party Advertising Trackers
                </h3>
                <p>
                  Canabis Hub strictly avoids behavioral cross-site advertising pixels or surveillance trackers. Your viewing history is not monetized or sold to third-party ad networks.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  3. Managing Your Browser Storage
                </h3>
                <p>
                  You can clear your local storage and cookies at any time via your browser settings. Note that clearing storage will require age re-verification on your next visit.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'responsible-use' && (
            <div className="space-y-6 text-[#263A36] dark:text-gray-200">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F28A19] uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                GERMAN CANG COMPLIANCE & HARM REDUCTION
              </div>
              <h1 className="text-3xl font-extrabold text-[#063E30] dark:text-white">
                Responsible Use & Health Guidelines
              </h1>
              <p className="text-xs text-[#68756F] dark:text-gray-400">Federal Ministry of Health (BMG) Harm Reduction Principles</p>

              <div className="space-y-4 text-sm leading-relaxed text-[#68756F] dark:text-gray-300">
                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  1. Youth Protection & Cognitive Health
                </h3>
                <p>
                  Cannabis consumption during adolescent brain development carries substantial cognitive risks. Under the German Cannabis Act (CanG), cannabis access is strictly restricted to adults aged 18 and older, with special potency guidelines for young adults aged 18 to 21.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  2. Driving & Road Safety (StVG § 24a)
                </h3>
                <p>
                  Do not operate motor vehicles, machinery, or participate in road traffic under the influence of THC. German traffic law enforces strict per-se limit concentrations in blood serum.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  3. Ingestion Safety & Delays
                </h3>
                <p>
                  Oral consumption via confectionery or baked goods entails delayed onset times (often 60 to 90 minutes). Never consume additional doses before evaluating initial effects. Keep all products in child-resistant containers out of reach of minors and pets.
                </p>

                <h3 className="text-base font-bold text-[#063E30] dark:text-white">
                  4. Free Support & Addiction Counseling Resources
                </h3>
                <p>
                  If you or someone you know requires confidential support regarding cannabis consumption patterns, contact the German Federal Centre for Health Education (BZgA):
                </p>
                <div className="p-4 bg-[#FFFDF8] dark:bg-[#041F18] rounded-xl border border-[#E9EDE7] dark:border-white/10 text-xs space-y-1">
                  <div><strong>BZgA Info-Telefon:</strong> 0221 89 20 31</div>
                  <div><strong>Quit the Shit Counseling:</strong> www.drugcom.de</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

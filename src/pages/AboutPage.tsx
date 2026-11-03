/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  Award,
  Sprout,
  Users,
  Building2,
  FileText,
  CheckCircle,
  ArrowRight,
  FlaskConical,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-12 text-[#263A36] dark:text-[#E2E8F0] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb & Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-xs text-[#68756F] dark:text-gray-400 mb-3">
            <button onClick={() => navigateTo('home')} className="hover:text-[#07543F] dark:hover:text-emerald-400">
              Home
            </button>
            <span>/</span>
            <span className="text-[#07543F] dark:text-emerald-400 font-semibold">About Us</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            OUR MISSION & STANDARDS
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-4">
            Setting the Benchmark for German Cannabis Transparency
          </h1>
          <p className="text-sm sm:text-base text-[#68756F] dark:text-gray-300 max-w-3xl leading-relaxed">
            Founded following Germany’s progressive cannabis legislation, Canabis Hub operates as an independent informational authority, connecting adult consumers, clinicians, and cultivation associations with verified scientific monographs and accredited laboratory analytics.
          </p>
        </div>

        {/* Hero Image / Mission Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white">
              Promoting Public Health Through Scientific Rigor
            </h2>
            <p className="text-sm text-[#68756F] dark:text-gray-300 leading-relaxed">
              For decades, illicit cannabis distribution subjected consumers to unpredictable cannabinoid concentrations, toxic chemical adulterants, and artificial terpenes. Under Germany’s Cannabis Act (CanG), legal clarity now demands accountability.
            </p>
            <p className="text-sm text-[#68756F] dark:text-gray-300 leading-relaxed">
              At Canabis Hub, our mandate is strictly non-commercial. We do not participate in controlled substance transactions. Instead, we function as Germany’s premier botanical repository, providing public access to independent Certificates of Analysis (COAs), terpene profiles, and harm-reduction research.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white dark:bg-[#073B2E]/60 border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                <div className="font-extrabold text-2xl text-[#07543F] dark:text-emerald-400 font-mono">100%</div>
                <div className="text-xs text-[#68756F] dark:text-gray-300 mt-1">Independent Laboratory Batch Verification</div>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#073B2E]/60 border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                <div className="font-extrabold text-2xl text-[#F28A19] font-mono">30+</div>
                <div className="text-xs text-[#68756F] dark:text-gray-300 mt-1">Audited German & European Brand Partners</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl overflow-hidden shadow-xl border border-[#E9EDE7] dark:border-white/10">
              <img
                src="/src/assets/images/hero_cannabis_dispensary_1793700801902.jpg"
                alt="Canabis Hub Apothecary Showroom in Berlin"
                className="w-full h-[400px] object-cover"
              />
            </div>
          </div>
        </div>

        {/* Core Pillars */}
        <div className="mb-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
              THE PILLARS OF OUR PLATFORM
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white">
              Integrity, Harm Reduction & Verification
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#073B2E]/60 p-8 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#07543F]/10 dark:bg-emerald-500/20 text-[#07543F] dark:text-emerald-300 flex items-center justify-center mb-5">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#063E30] dark:text-white mb-2">
                  ISO/IEC 17025 Accreditations
                </h3>
                <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
                  Every product listed on our directory is tied to verified analytical chromatography data conducted by certified testing laboratories in Berlin, Munich, and Leipzig.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E9EDE7] dark:border-white/10 text-xs font-semibold text-[#07543F] dark:text-emerald-400">
                Pharmacopoeia Compliant
              </div>
            </div>

            <div className="bg-white dark:bg-[#073B2E]/60 p-8 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-[#F28A19]/10 text-[#F28A19] flex items-center justify-center mb-5">
                  <Sprout className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#063E30] dark:text-white mb-2">
                  Regenerative Cultivation
                </h3>
                <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
                  We prioritize producers adhering to living organic soils, cold glass curing, and biological pest management without harmful chemical sprays.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E9EDE7] dark:border-white/10 text-xs font-semibold text-[#F28A19]">
                Zero Heavy Metals & Pesticides
              </div>
            </div>

            <div className="bg-white dark:bg-[#073B2E]/60 p-8 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 flex items-center justify-center mb-5">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-[#063E30] dark:text-white mb-2">
                  Legal CanG Compliance
                </h3>
                <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
                  All platform educational materials are continuously audited by regulatory attorneys to adhere to German federal directives, youth protection, and advertising standards.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E9EDE7] dark:border-white/10 text-xs font-semibold text-blue-700 dark:text-blue-300">
                100% German Law Aligned
              </div>
            </div>
          </div>
        </div>

        {/* Scientific Advisory Board */}
        <div className="bg-white dark:bg-[#073B2E]/60 rounded-3xl p-8 sm:p-12 border border-[#E9EDE7] dark:border-white/10 shadow-sm mb-16">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-1">
              EXPERTISE & OVERSIGHT
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white">
              Scientific Advisory Board
            </h2>
            <p className="text-xs text-[#68756F] dark:text-gray-300 mt-1">
              Independent pharmacists, biochemists, and agronomy researchers providing editorial integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#041F18]/60 border border-[#E9EDE7] dark:border-white/10">
              <div className="w-12 h-12 rounded-full bg-[#07543F] text-white flex items-center justify-center font-bold text-sm mb-3">
                FW
              </div>
              <h4 className="font-bold text-sm text-[#063E30] dark:text-white">Dr. Florian Weber, PharmD</h4>
              <p className="text-xs text-[#F28A19] font-medium mb-2">Head of Analytical Toxicology</p>
              <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
                Specialist in supercritical fluid extraction and HPLC cannabinoid quantification with 14 years in pharmaceutical testing.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#041F18]/60 border border-[#E9EDE7] dark:border-white/10">
              <div className="w-12 h-12 rounded-full bg-[#F28A19] text-white flex items-center justify-center font-bold text-sm mb-3">
                ER
              </div>
              <h4 className="font-bold text-sm text-[#063E30] dark:text-white">Elena Reinhardt, MSc</h4>
              <p className="text-xs text-[#F28A19] font-medium mb-2">Director of Plant Genetics & Agronomy</p>
              <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
                Researcher at Humboldt University Berlin specializing in botanical secondary metabolites, monoterpenes, and living soil biology.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FFFDF8] dark:bg-[#041F18]/60 border border-[#E9EDE7] dark:border-white/10">
              <div className="w-12 h-12 rounded-full bg-[#063E30] dark:bg-emerald-800 text-white flex items-center justify-center font-bold text-sm mb-3">
                MB
              </div>
              <h4 className="font-bold text-sm text-[#063E30] dark:text-white">Markus Braun, LL.M.</h4>
              <p className="text-xs text-[#F28A19] font-medium mb-2">Senior Regulatory Counsel</p>
              <p className="text-xs text-[#68756F] dark:text-gray-300 leading-relaxed">
                Advising European medical associations and social clubs on German Federal Cannabis Act (CanG) adherence and consumer rights.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#073B2E] dark:bg-[#073B2E]/90 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10 shadow-xl">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold">Have Inquiries About Our Methodology?</h3>
            <p className="text-xs text-[#FFFDF8]/80 mt-1 max-w-xl">
              Connect with our Berlin team to submit lab batch records or verify certification credentials.
            </p>
          </div>
          <button
            onClick={() => navigateTo('contact')}
            className="px-6 py-3 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white text-xs font-bold transition-all shadow-md shrink-0"
          >
            Contact Advisory Desk
          </button>
        </div>
      </div>
    </div>
  );
};

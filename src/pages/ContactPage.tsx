/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  AlertCircle,
  Building2,
  FileCheck,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { navigateTo } = useApp();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('General Platform Inquiry');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Realistic processing
    setTimeout(() => {
      const ticketId = `DE-INQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedTicket(ticketId);
      setIsSubmitting(false);
      setFullName('');
      setEmail('');
      setMessage('');
    }, 700);
  };

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
            <span className="text-[#07543F] dark:text-emerald-400 font-semibold">Contact Us</span>
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] block mb-2">
            REGULATORY & ADVISORY DESK
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063E30] dark:text-white tracking-tight mb-4">
            Connect with Canabis Hub Germany
          </h1>
          <p className="text-sm sm:text-base text-[#68756F] dark:text-gray-300 max-w-3xl leading-relaxed">
            Whether applying for brand directory indexing, requesting independent laboratory audit documentation, or seeking logistics guidance under the German CanG regulations, our team is at your disposal.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-[#073B2E]/60 rounded-3xl p-8 border border-[#E9EDE7] dark:border-white/10 shadow-sm">
              <h2 className="text-2xl font-extrabold text-[#063E30] dark:text-white mb-2">
                Send an Advisory Message
              </h2>
              <p className="text-xs text-[#68756F] dark:text-gray-300 mb-6">
                All communications are encrypted and answered within 24 business hours by our Berlin compliance officers.
              </p>

              {submittedTicket ? (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-center space-y-3 animate-fadeIn">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-emerald-900 dark:text-emerald-300">
                    Inquiry Received Successfully
                  </h3>
                  <p className="text-xs text-emerald-800 dark:text-emerald-400 leading-relaxed max-w-md mx-auto">
                    Your inquiry has been cataloged under Reference Ticket ID:
                    <span className="font-mono font-bold block mt-1 text-sm text-[#07543F] dark:text-emerald-300">
                      {submittedTicket}
                    </span>
                    A compliance officer will review your request and reply via email within 1 business day.
                  </p>
                  <button
                    onClick={() => setSubmittedTicket(null)}
                    className="mt-4 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Maximilian Schmidt"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F] dark:focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                        Work / Personal Email *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="name@organization.de"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F] dark:focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                      Subject Matter *
                    </label>
                    <select
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white font-medium focus:outline-none focus:border-[#07543F] dark:focus:border-emerald-400"
                    >
                      <option value="General Platform Inquiry">General Platform Inquiry</option>
                      <option value="Brand Indexing Application">Brand Indexing Application (Farms & Labs)</option>
                      <option value="Laboratory COA Verification">Laboratory COA & Testing Audit</option>
                      <option value="Logistics & Courier Consultation">Logistics & Express Courier Protocols</option>
                      <option value="Legal & CanG Compliance Request">Legal & CanG Regulatory Framework</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                      Detailed Message *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please outline the nature of your inquiry, batch numbers (if applicable), or institutional details..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-4 py-2.5 bg-[#FFFDF8] dark:bg-[#041F18] border border-[#E9EDE7] dark:border-white/10 rounded-xl text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F] dark:focus:border-emerald-400 placeholder:text-gray-400"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        'Cataloging Inquiry...'
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Transmit Message to Compliance Desk
                        </>
                      )}
                    </button>
                  </div>

                  <p className="text-[11px] text-[#68756F] dark:text-gray-400 text-center pt-2">
                    We strictly honor the General Data Protection Regulation (GDPR / DSGVO). Your contact details are never shared with external advertisers.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Right: Regional Office Locations */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white dark:bg-[#073B2E]/60 rounded-3xl p-6 border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F28A19] uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                CENTRAL HEADQUARTERS
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-[#063E30] dark:text-white">
                  Berlin Innovation Hub
                </h3>
                <p className="text-xs text-[#68756F] dark:text-gray-300 mt-1">
                  Friedrichstraße 120, 10117 Berlin, Germany
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#263A36] dark:text-gray-200 pt-2 border-t border-[#E9EDE7] dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#07543F] dark:text-emerald-400" />
                  <span>+49 (0) 30 8920 4401</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#07543F] dark:text-emerald-400" />
                  <span>berlin@canabishub.de</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#07543F] dark:text-emerald-400" />
                  <span>Mon – Fri: 09:00 – 18:00 CET</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#073B2E]/60 rounded-3xl p-6 border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F28A19] uppercase tracking-wider">
                <Building2 className="w-4 h-4" />
                SOUTHERN GERMANY LAB OPERATIONS
              </div>

              <div>
                <h3 className="font-extrabold text-lg text-[#063E30] dark:text-white">
                  Munich Logistics & Lab Advisory
                </h3>
                <p className="text-xs text-[#68756F] dark:text-gray-300 mt-1">
                  Maximilianstraße 35, 80539 München, Germany
                </p>
              </div>

              <div className="space-y-2 text-xs text-[#263A36] dark:text-gray-200 pt-2 border-t border-[#E9EDE7] dark:border-white/10">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-[#07543F] dark:text-emerald-400" />
                  <span>+49 (0) 89 4120 7790</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#07543F] dark:text-emerald-400" />
                  <span>munich@canabishub.de</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-[#07543F] dark:text-emerald-400" />
                  <span>Mon – Sat: 09:00 – 21:00 CET</span>
                </div>
              </div>
            </div>

            <div className="bg-[#073B2E] dark:bg-[#073B2E]/90 text-white rounded-3xl p-6 border border-white/10 shadow-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#F28A19] uppercase tracking-wider">
                <FileCheck className="w-4 h-4" />
                URGENT COMPLIANCE HOTLINE
              </div>
              <p className="text-xs text-[#FFFDF8]/80 leading-relaxed">
                For regulatory inquiries from health offices (Gesundheitsamt) or accredited analytical laboratories:
              </p>
              <div className="pt-2 font-mono text-sm font-bold text-white">
                compliance@canabishub.de
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

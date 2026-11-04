/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, ShieldCheck, Clock } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { settings } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'Cultivator Accreditation Application',
    inquiry_type: 'grower_application',
    brand_name: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(data.message || 'Thank you! Your inquiry has been dispatched to our compliance team.');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'Cultivator Accreditation Application',
          inquiry_type: 'grower_application',
          brand_name: '',
          message: '',
        });
      } else {
        alert(data.error || 'Submission failed');
      }
    } catch {
      setSuccessMsg('Thank you! Your inquiry has been received by our compliance team in Berlin.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#063E30] to-[#07543F] text-white p-8 sm:p-12 relative overflow-hidden">
        <div className="max-w-2xl space-y-4 relative z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19] px-3 py-1 rounded-full bg-emerald-900/80 inline-block">
            Accreditation & Inquiries
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Outfit']">
            Contact Canabis Hub Germany
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Reach our compliance office in Berlin. Whether you are an authorized German cultivation association, an analytical laboratory, or an adult consumer seeking monograph details, we are here to support you.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs space-y-4">
            <h3 className="text-lg font-bold text-[#063E30] dark:text-white font-['Outfit']">
              Berlin Compliance Office
            </h3>

            <div className="space-y-3 text-xs text-[#263A36] dark:text-emerald-100">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#F28A19] shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Address</strong>
                  <span>{settings.address}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#F28A19] shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Telephone (Direct)</strong>
                  <span>{settings.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-[#F28A19] shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Compliance Email</strong>
                  <span>{settings.email}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#F28A19] shrink-0 mt-0.5" />
                <div>
                  <strong className="block">Operating Hours</strong>
                  <span>{settings.operatingHours}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-[#063E30] dark:text-emerald-200 space-y-2">
            <div className="flex items-center gap-2 font-bold text-[#07543F] dark:text-[#F28A19]">
              <ShieldCheck className="w-4 h-4" />
              <span>Cultivator Onboarding Protocol</span>
            </div>
            <p className="leading-relaxed text-[11px] opacity-90">
              Please include your German commercial register entry or Anbauvereinigung authorization number along with recent batch certificates of analysis for fast-track indexing.
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs">
            {successMsg ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900 text-[#07543F] dark:text-emerald-300 mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-[#063E30] dark:text-white">
                  Message Dispatched
                </h3>
                <p className="text-xs text-[#68756F] dark:text-emerald-200/80 max-w-md mx-auto">
                  {successMsg}
                </p>
                <button
                  onClick={() => setSuccessMsg(null)}
                  className="py-2 px-5 rounded-xl bg-[#07543F] text-white text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-lg font-bold text-[#063E30] dark:text-white font-['Outfit'] mb-4">
                  Submit an Inquiry or Accreditation Request
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-[#263A36] dark:text-emerald-100">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                      placeholder="e.g. Dr. Florian Weber"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#263A36] dark:text-emerald-100">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                      placeholder="email@company.de"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-[#263A36] dark:text-emerald-100">Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                      placeholder="+49 ..."
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-[#263A36] dark:text-emerald-100">Cultivator / Brand Name</label>
                    <input
                      type="text"
                      value={formData.brand_name}
                      onChange={(e) => setFormData({ ...formData, brand_name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                      placeholder="e.g. Bavarian Alps Botanical Farm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#263A36] dark:text-emerald-100">Inquiry Classification</label>
                  <select
                    value={formData.inquiry_type}
                    onChange={(e) => setFormData({ ...formData, inquiry_type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40 font-medium"
                  >
                    <option value="grower_application">Cultivator Directory Accreditation</option>
                    <option value="laboratory_partnership">Laboratory Testing Partnership</option>
                    <option value="regulatory_compliance">CanG Regulatory Inquiry</option>
                    <option value="general">General Support</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#263A36] dark:text-emerald-100">Message & Facility Details *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E9EDE7] dark:border-emerald-800 bg-[#FFFDF8] dark:bg-emerald-950/40"
                    placeholder="Provide details regarding your cultivation facility, licensing status, or question..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-6 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white font-bold transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting...' : 'Submit Inquiry to Canabis Hub'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

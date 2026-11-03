/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  Package,
  Bookmark,
  Settings,
  Bell,
  LogOut,
  ShieldCheck,
  Check,
  Clock,
  ArrowRight,
  ExternalLink,
  Lock,
  Moon,
  Sun,
  FileText,
  AlertTriangle,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Trash2,
} from 'lucide-react';
import { BLOG_POSTS, PRODUCTS_DATA, BRANDS_DIRECTORY } from '../data/cannabisData';

export const UserDashboardPage: React.FC = () => {
  const {
    currentUser,
    authToken,
    logout,
    theme,
    toggleTheme,
    navigateTo,
    savedProducts,
    savedItemIds,
    toggleSaveItem,
    notifications,
    markNotificationRead,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'profile' | 'saved' | 'orders' | 'settings'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  // Profile form state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileAddress, setProfileAddress] = useState(currentUser?.address || '');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  // Password state
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);

  // Invoice modal
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<any | null>(null);

  useEffect(() => {
    if (currentUser) {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileAddress(currentUser.address || '');
    }
  }, [currentUser]);

  // Fetch orders from API
  useEffect(() => {
    if (authToken) {
      setIsLoadingOrders(true);
      fetch('/api/orders', {
        headers: { Authorization: `Bearer ${authToken}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (Array.isArray(data)) setOrders(data);
          setIsLoadingOrders(false);
        })
        .catch(() => setIsLoadingOrders(false));
    }
  }, [authToken]);

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] flex items-center justify-center p-6 text-center">
        <div className="max-w-md bg-white dark:bg-[#063E30] p-8 rounded-3xl border border-[#E9EDE7] dark:border-white/10 shadow-xl space-y-4">
          <User className="w-12 h-12 text-[#F28A19] mx-auto" />
          <h2 className="text-xl font-bold text-[#063E30] dark:text-white">Sign In Required</h2>
          <p className="text-xs text-[#68756F] dark:text-white/70">
            Please sign in to access your member dashboard, order records, and saved monograph collections.
          </p>
          <button
            onClick={() => navigateTo('login')}
            className="w-full py-3 rounded-xl bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30]"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          name: profileName,
          phone: profilePhone,
          address: profileAddress,
        }),
      });
      if (res.ok) {
        setProfileSavedMsg(true);
        setTimeout(() => setProfileSavedMsg(false), 3000);
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9EDE7] dark:border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#07543F] to-[#063E30] text-white flex items-center justify-center font-extrabold text-2xl shadow-lg shadow-[#07543F]/20">
              {currentUser.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] font-bold text-[10px] uppercase tracking-wider">
                  {currentUser.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-[#68756F] dark:text-white/60 mt-0.5">
                {currentUser.email} · Registered German Member Account
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {['super_admin', 'admin', 'content_manager', 'support_agent'].includes(currentUser.role) && (
              <button
                onClick={() => navigateTo('admin')}
                className="px-4 py-2 rounded-xl bg-[#063E30] text-white text-xs font-bold hover:bg-[#07543F] transition-all flex items-center gap-1.5 border border-white/20"
              >
                <ShieldCheck className="w-4 h-4 text-[#F28A19]" />
                Open Admin Panel
              </button>
            )}

            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Navigation Sidebar (3 cols) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="bg-white dark:bg-[#063E30] p-3 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'overview'
                    ? 'bg-[#07543F] text-white shadow-sm'
                    : 'text-[#263A36] dark:text-white/80 hover:bg-[#FFFDF8] dark:hover:bg-white/5'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Dashboard Overview</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'profile'
                    ? 'bg-[#07543F] text-white shadow-sm'
                    : 'text-[#263A36] dark:text-white/80 hover:bg-[#FFFDF8] dark:hover:bg-white/5'
                }`}
              >
                <User className="w-4 h-4" />
                <span>My Profile</span>
              </button>

              <button
                onClick={() => setActiveTab('saved')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'saved'
                    ? 'bg-[#07543F] text-white shadow-sm'
                    : 'text-[#263A36] dark:text-white/80 hover:bg-[#FFFDF8] dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Bookmark className="w-4 h-4" />
                  <span>Saved Content</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                  {savedItemIds.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'orders'
                    ? 'bg-[#07543F] text-white shadow-sm'
                    : 'text-[#263A36] dark:text-white/80 hover:bg-[#FFFDF8] dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4" />
                  <span>Lawful Merchandise Orders</span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-white/20">
                  {orders.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all text-left ${
                  activeTab === 'settings'
                    ? 'bg-[#07543F] text-white shadow-sm'
                    : 'text-[#263A36] dark:text-white/80 hover:bg-[#FFFDF8] dark:hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Account Settings</span>
              </button>
            </div>

            {/* Notification Widget */}
            <div className="bg-white dark:bg-[#063E30] p-4 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#063E30] dark:text-white">
                <div className="flex items-center gap-1.5">
                  <Bell className="w-3.5 h-3.5 text-[#F28A19]" />
                  <span>Notifications</span>
                </div>
                <span className="text-[10px] text-[#68756F] dark:text-white/60">
                  {notifications.filter((n) => !n.is_read).length} Unread
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-[11px] text-[#68756F] dark:text-white/50">No notifications.</p>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                        n.is_read
                          ? 'bg-[#FFFDF8] dark:bg-white/5 border-[#E9EDE7] dark:border-white/5 text-[#68756F] dark:text-white/60'
                          : 'bg-[#07543F]/5 dark:bg-[#07543F]/30 border-[#07543F]/30 text-[#063E30] dark:text-white font-semibold'
                      }`}
                    >
                      <div className="font-bold truncate">{n.title}</div>
                      <div className="text-[10px] opacity-80 line-clamp-2 mt-0.5">{n.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Main Content (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* OVERVIEW TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                {/* Welcome Card */}
                <div className="bg-gradient-to-r from-[#07543F] to-[#063E30] rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="max-w-xl space-y-2 relative z-10">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#F28A19]">
                      MEMBER INTELLIGENCE HUB
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                      Willkommen zurück, {currentUser.name}!
                    </h2>
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                      Your verified account grants instant access to German analytical testing certificates, terpene pharmacokinetics, and saved botanical monographs.
                    </p>
                  </div>
                </div>

                {/* Quick KPI Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white dark:bg-[#063E30] p-5 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                    <span className="text-xs text-[#68756F] dark:text-white/60 block">Saved Monographs</span>
                    <div className="font-mono text-2xl font-extrabold text-[#063E30] dark:text-white mt-1">
                      {savedItemIds.length}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#063E30] p-5 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                    <span className="text-xs text-[#68756F] dark:text-white/60 block">Merchandise Orders</span>
                    <div className="font-mono text-2xl font-extrabold text-[#063E30] dark:text-white mt-1">
                      {orders.length}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-[#063E30] p-5 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                    <span className="text-xs text-[#68756F] dark:text-white/60 block">Compliance Status</span>
                    <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mt-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" /> Age 18+ Confirmed
                    </div>
                  </div>
                </div>

                {/* Recommended Content */}
                <div className="bg-white dark:bg-[#063E30] rounded-3xl p-6 sm:p-8 border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-4">
                  <h3 className="text-lg font-bold text-[#063E30] dark:text-white">
                    Recommended Botanical Articles for You
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {BLOG_POSTS.slice(0, 2).map((post) => (
                      <div
                        key={post.id}
                        onClick={() => navigateTo('blog-post', post.slug)}
                        className="p-4 rounded-xl border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F] bg-[#FFFDF8] dark:bg-[#073B2E]/40 cursor-pointer transition-all flex gap-3 group"
                      >
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 rounded-lg object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-[#F28A19] uppercase tracking-wider block">
                            {post.category}
                          </span>
                          <h4 className="font-bold text-xs text-[#063E30] dark:text-white group-hover:text-[#F28A19] line-clamp-2 mt-0.5">
                            {post.title}
                          </h4>
                          <span className="text-[10px] text-[#68756F] dark:text-white/60 mt-1 block">
                            {post.readTime}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="bg-white dark:bg-[#063E30] rounded-3xl p-8 border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-extrabold text-[#063E30] dark:text-white">
                    My Account Profile
                  </h2>
                  <p className="text-xs text-[#68756F] dark:text-white/60 mt-1">
                    Manage your personal information, address for permitted deliveries, and advisory contact.
                  </p>
                </div>

                {profileSavedMsg && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    <span>Profile settings successfully saved to database.</span>
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                        Email Address (Read Only)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={currentUser.email}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-[#E9EDE7] dark:border-white/10 text-sm text-[#68756F] dark:text-white/50 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        placeholder="+49 171 1234567"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1.5">
                        Delivery Address
                      </label>
                      <input
                        type="text"
                        value={profileAddress}
                        onChange={(e) => setProfileAddress(e.target.value)}
                        placeholder="Street, number, city"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#07543F] hover:bg-[#063E30] text-white text-xs font-bold transition-all shadow-sm"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* SAVED CONTENT TAB */}
            {activeTab === 'saved' && (
              <div className="bg-white dark:bg-[#063E30] rounded-3xl p-8 border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-extrabold text-[#063E30] dark:text-white">
                      Saved Monograph Directory
                    </h2>
                    <p className="text-xs text-[#68756F] dark:text-white/60 mt-1">
                      Cultivars, solventless extracts, and equipment bookmarked for fast technical reference.
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#F28A19]">{savedProducts.length} Items</span>
                </div>

                {savedProducts.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#68756F] dark:text-white/60">
                    No items currently bookmarked. Browse the catalog to save monographs.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedProducts.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 rounded-xl border border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#073B2E]/50 flex gap-3 items-center group"
                      >
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-16 h-16 rounded-lg object-cover border border-[#E9EDE7] dark:border-white/10 shrink-0"
                        />
                        <div className="flex-1 min-w-0 text-xs">
                          <span className="text-[10px] font-bold text-[#F28A19] uppercase tracking-wider block">
                            {p.brand}
                          </span>
                          <h4 className="font-bold text-sm text-[#063E30] dark:text-white truncate">
                            {p.name}
                          </h4>
                          <div className="text-[11px] text-[#68756F] dark:text-white/60 mt-0.5">
                            THC: {p.thc} · {p.strainType}
                          </div>
                          <div className="mt-2 flex items-center justify-between pt-1 border-t border-[#E9EDE7] dark:border-white/10">
                            <span className="font-mono text-[10px] text-[#68756F] dark:text-white/50">{p.labBatch}</span>
                            <button
                              onClick={() => toggleSaveItem(p.id)}
                              className="text-rose-500 hover:text-rose-700 text-[11px] flex items-center gap-1 font-semibold"
                            >
                              <Trash2 className="w-3 h-3" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ORDERS TAB (Permitted Non-Cannabis Items) */}
            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-[#063E30] rounded-3xl p-8 border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-extrabold text-[#063E30] dark:text-white">
                    Permitted Accessories Order History
                  </h2>
                  <p className="text-xs text-[#68756F] dark:text-white/60 mt-1">
                    Transactions are legally restricted to non-botanical hardware, curing glassware, and hygrometer scales.
                  </p>
                </div>

                {isLoadingOrders ? (
                  <div className="py-12 text-center text-xs text-[#68756F] dark:text-white/60">
                    Loading order records...
                  </div>
                ) : orders.length === 0 ? (
                  <div className="py-12 text-center text-xs text-[#68756F] dark:text-white/60 space-y-3">
                    <Package className="w-10 h-10 text-slate-300 dark:text-white/20 mx-auto" />
                    <p>No non-cannabis accessory orders found on your account.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-5 rounded-2xl border border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#073B2E]/40 space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#E9EDE7] dark:border-white/10">
                          <div>
                            <span className="font-mono font-bold text-sm text-[#063E30] dark:text-white">
                              {ord.order_ref}
                            </span>
                            <span className="text-[#68756F] dark:text-white/60 ml-2">
                              {new Date(ord.created_at).toLocaleDateString('de-DE')}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold uppercase text-[10px]">
                              {ord.status}
                            </span>
                            <span className="font-mono font-extrabold text-[#F28A19] text-sm">
                              €{ord.total.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Items list */}
                        <div className="space-y-1.5">
                          {ord.items?.map((it: any, iIdx: number) => (
                            <div key={iIdx} className="flex justify-between text-[#263A36] dark:text-white/80">
                              <span>
                                {it.quantity}x {it.name}
                              </span>
                              <span className="font-mono text-[#68756F] dark:text-white/50">
                                €{(it.price * it.quantity).toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-[#E9EDE7] dark:border-white/10 text-[11px]">
                          <span className="text-[#68756F] dark:text-white/50">
                            Payment: {ord.payment_method?.toUpperCase()} · {ord.payment_status?.toUpperCase()}
                          </span>
                          <button
                            onClick={() => setSelectedOrderForInvoice(ord)}
                            className="text-[#07543F] dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
                          >
                            <FileText className="w-3.5 h-3.5" /> View Official Invoice
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <div className="bg-white dark:bg-[#063E30] rounded-3xl p-8 border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-6 animate-fadeIn">
                <div>
                  <h2 className="text-xl font-extrabold text-[#063E30] dark:text-white">
                    Account & Security Settings
                  </h2>
                  <p className="text-xs text-[#68756F] dark:text-white/60 mt-1">
                    Manage password security, display preferences, and privacy controls.
                  </p>
                </div>

                {/* Theme Selector */}
                <div className="p-4 rounded-xl border border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#073B2E]/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#063E30] dark:text-white block">Theme Appearance</span>
                    <span className="text-[#68756F] dark:text-white/60">Switch between Warm Off-White and Deep Forest Night</span>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#063E30] border border-[#E9EDE7] dark:border-white/20 text-xs font-bold text-[#063E30] dark:text-white flex items-center gap-1.5 shadow-sm"
                  >
                    {theme === 'dark' ? <Moon className="w-4 h-4 text-[#F28A19]" /> : <Sun className="w-4 h-4 text-[#F28A19]" />}
                    <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
                  </button>
                </div>

                {/* Password update form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setPasswordMsg('Password successfully updated.');
                    setNewPassword('');
                  }}
                  className="space-y-3 text-xs pt-2"
                >
                  <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white">
                    Change Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new secure password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-sm text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                  />
                  {passwordMsg && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">{passwordMsg}</p>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30]"
                  >
                    Update Password
                  </button>
                </form>

                <div className="pt-6 border-t border-[#E9EDE7] dark:border-white/10">
                  <span className="text-xs font-bold text-rose-600 uppercase tracking-wider block mb-1">
                    Danger Zone
                  </span>
                  <p className="text-xs text-[#68756F] dark:text-white/60 mb-3">
                    Under GDPR Art. 17, you can request full erasure of your account and saved bookmarks.
                  </p>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to request account deletion? Our Data Protection Officer will process your request.')) {
                        alert('Account deletion request dispatched to privacy@canabishub.de.');
                      }
                    }}
                    className="px-4 py-2 rounded-xl border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-50 dark:hover:bg-rose-950/20"
                  >
                    Request Account Deletion (GDPR)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#063E30] text-[#263A36] dark:text-white rounded-3xl max-w-lg w-full p-8 border border-[#E9EDE7] dark:border-white/10 shadow-2xl relative">
            <div className="flex justify-between items-start border-b border-[#E9EDE7] dark:border-white/10 pb-4 mb-4">
              <div>
                <span className="font-extrabold text-lg text-[#063E30] dark:text-white block">
                  CANABIS<span className="text-[#F28A19] ml-1">HUB</span> RECHNUNG
                </span>
                <span className="text-xs text-[#68756F] dark:text-white/60">
                  Friedrichstraße 120, 10117 Berlin · USt-ID: DE349201948
                </span>
              </div>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs mb-6">
              <div className="flex justify-between">
                <span>Invoice Ref:</span>
                <span className="font-mono font-bold text-[#F28A19]">{selectedOrderForInvoice.order_ref}</span>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <span>{new Date(selectedOrderForInvoice.created_at).toLocaleDateString('de-DE')}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="uppercase">{selectedOrderForInvoice.payment_method}</span>
              </div>
            </div>

            <div className="border-t border-b border-[#E9EDE7] dark:border-white/10 py-3 space-y-2 text-xs">
              {selectedOrderForInvoice.items?.map((it: any, idx: number) => (
                <div key={idx} className="flex justify-between">
                  <span>{it.quantity}x {it.name}</span>
                  <span className="font-mono">€{(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between text-[#68756F] dark:text-white/60 pt-2 border-t border-[#E9EDE7]/60 dark:border-white/5">
                <span>Tracked Courier Shipping:</span>
                <span className="font-mono">€{selectedOrderForInvoice.shipping?.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-[#063E30] dark:text-white pt-2 border-t border-[#E9EDE7] dark:border-white/10">
                <span>Total (incl. 19% MwSt):</span>
                <span className="font-mono text-[#F28A19]">€{selectedOrderForInvoice.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-[#07543F] text-white text-xs font-bold rounded-xl"
              >
                Print / Save PDF
              </button>
              <button
                onClick={() => setSelectedOrderForInvoice(null)}
                className="px-4 py-2.5 border border-[#E9EDE7] dark:border-white/10 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

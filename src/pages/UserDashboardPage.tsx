/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  User,
  ShieldCheck,
  Bookmark,
  ShoppingBag,
  LogOut,
  ArrowRight,
  Clock,
  CheckCircle2,
  MapPin,
  Mail,
  Phone,
} from 'lucide-react';

export const UserDashboardPage: React.FC = () => {
  const {
    currentUser,
    logout,
    savedProductIds,
    products,
    openProductModal,
    navigateTo,
    authToken,
  } = useApp();

  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!authToken) return;
    setLoadingOrders(true);
    fetch('/api/orders', {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setOrders(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoadingOrders(false));
  }, [authToken]);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-[#063E30] dark:text-white">
          Please Sign In
        </h2>
        <p className="text-xs text-[#68756F] dark:text-emerald-200/70">
          You need to be signed in to access your saved monographs and order history.
        </p>
        <button
          onClick={() => navigateTo('login')}
          className="py-2.5 px-6 rounded-xl bg-[#07543F] text-white text-xs font-bold"
        >
          Sign In
        </button>
      </div>
    );
  }

  const savedProducts = products.filter((p) => savedProductIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* User Header Profile Card */}
      <div className="p-8 rounded-3xl bg-gradient-to-br from-[#063E30] to-[#07543F] text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center font-bold text-2xl">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold font-['Outfit']">{currentUser.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F28A19] text-white">
                {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-emerald-200/80 mt-1 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span>{currentUser.email}</span>
              {currentUser.phone && (
                <>
                  <span>·</span>
                  <Phone className="w-3.5 h-3.5" />
                  <span>{currentUser.phone}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {['super_admin', 'admin'].includes(currentUser.role) && (
            <button
              onClick={() => navigateTo('admin')}
              className="py-2.5 px-4 rounded-xl bg-[#F28A19] text-white text-xs font-bold hover:bg-[#d9770e] transition-all flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Panel</span>
            </button>
          )}
          <button
            onClick={logout}
            className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Saved Monographs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#063E30] dark:text-white font-['Outfit'] flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-[#F28A19]" />
              <span>Saved Monographs ({savedProducts.length})</span>
            </h2>
          </div>

          {savedProducts.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 text-center text-xs text-[#68756F] dark:text-emerald-200/70 space-y-2">
              <p>You haven't bookmarked any cultivars yet.</p>
              <button
                onClick={() => navigateTo('flower')}
                className="font-bold text-[#07543F] dark:text-[#F28A19] hover:underline"
              >
                Browse Flower Monographs →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {savedProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-2xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs flex items-center gap-4 hover:border-[#07543F] transition-all"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#E9EDE7] dark:border-emerald-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-[#F28A19]">
                      {p.brand} · {p.category}
                    </span>
                    <h4 className="font-bold text-xs text-[#063E30] dark:text-white truncate">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-[#68756F] dark:text-emerald-200/70 mt-0.5">
                      THC: {p.thc} · CBD: {p.cbd}
                    </p>
                  </div>
                  <button
                    onClick={() => openProductModal(p)}
                    className="py-1.5 px-3 rounded-lg bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30] flex items-center gap-1 shrink-0"
                  >
                    <span>View</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Orders History */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-xl font-bold text-[#063E30] dark:text-white font-['Outfit'] flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#07543F] dark:text-emerald-300" />
            <span>Hardware Orders & Tracking</span>
          </h2>

          {loadingOrders ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 text-center text-xs text-slate-500">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="p-8 rounded-3xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 text-center text-xs text-[#68756F] dark:text-emerald-200/70 space-y-2">
              <p>No storage or hardware purchases found.</p>
              <button
                onClick={() => navigateTo('shop')}
                className="font-bold text-[#F28A19] hover:underline"
              >
                Visit Accessories Store →
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl bg-white dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-emerald-800 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono font-bold text-[#07543F] dark:text-emerald-300">
                      {ord.order_ref}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-900 text-[#07543F] dark:text-emerald-200">
                      {ord.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-[#263A36] dark:text-emerald-100">
                    {ord.items &&
                      ord.items.map((it: any, idx: number) => (
                        <div key={idx} className="flex justify-between text-[11px]">
                          <span className="truncate max-w-[200px]">
                            {it.name} (x{it.quantity})
                          </span>
                          <span className="font-bold">€{(it.price * it.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                  </div>

                  <div className="pt-2 border-t border-[#E9EDE7] dark:border-emerald-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Total Paid</span>
                    <span className="font-extrabold text-[#07543F] dark:text-[#F28A19] text-sm">
                      €{Number(ord.total).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

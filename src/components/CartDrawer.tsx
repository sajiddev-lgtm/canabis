/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  CheckCircle,
  AlertCircle,
  Truck,
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    isCartOpen,
    closeCart,
    cart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    currentUser,
    authToken,
    navigateTo,
  } = useApp();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'sepa' | 'bank_transfer'>('stripe');
  const [shippingAddress, setShippingAddress] = useState({
    fullName: currentUser?.name || '',
    street: currentUser?.address || '',
    city: 'Berlin',
    postalCode: '10117',
    country: 'Germany',
  });
  const [orderSuccess, setOrderSuccess] = useState<{ orderRef: string; total: number } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = subtotal > 50 || subtotal === 0 ? 0.0 : 4.90;
  const total = subtotal + shipping;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) {
      closeCart();
      navigateTo('login');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          items: cart,
          shippingAddress,
          paymentMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to place order');
      }

      setOrderSuccess({ orderRef: data.orderRef, total: data.total });
      clearCart();
      setIsCheckingOut(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Payment processing error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#063E30] text-[#263A36] dark:text-[#E2E8F0] shadow-2xl flex flex-col border-l border-[#E9EDE7] dark:border-white/10 transition-colors">
          {/* Header */}
          <div className="p-6 border-b border-[#E9EDE7] dark:border-white/10 flex items-center justify-between bg-[#FFFDF8] dark:bg-[#073B2E]/90">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#07543F]/10 dark:bg-white/10 text-[#07543F] dark:text-[#F28A19] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-[#063E30] dark:text-white">
                  Accessories Bag
                </h3>
                <p className="text-xs text-[#68756F] dark:text-white/60">
                  Permitted Non-Cannabis Items ({cart.length})
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-lg text-[#68756F] hover:text-[#263A36] dark:text-white/60 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {orderSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4 animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="font-extrabold text-xl text-[#063E30] dark:text-white">
                  Order Confirmed!
                </h4>
                <p className="text-xs text-[#68756F] dark:text-white/70 max-w-xs leading-relaxed">
                  Your lawful botanical accessories order has been placed successfully under reference:
                </p>
                <div className="px-4 py-2 bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 rounded-xl font-mono font-bold text-sm text-[#F28A19]">
                  {orderSuccess.orderRef}
                </div>
                <p className="text-xs text-[#68756F] dark:text-white/70">
                  Total Paid: €{orderSuccess.total.toFixed(2)} · Dispatched from Berlin Depot
                </p>
                <div className="pt-4 flex flex-col w-full gap-2">
                  <button
                    onClick={() => {
                      setOrderSuccess(null);
                      closeCart();
                      navigateTo('dashboard');
                    }}
                    className="w-full py-3 rounded-xl bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30] transition-colors"
                  >
                    View in Order History
                  </button>
                  <button
                    onClick={() => {
                      setOrderSuccess(null);
                      closeCart();
                    }}
                    className="w-full py-2.5 rounded-xl border border-[#E9EDE7] dark:border-white/15 text-xs font-semibold text-[#68756F] dark:text-white/80"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            ) : isCheckingOut ? (
              <form onSubmit={handlePlaceOrder} className="space-y-4 text-xs animate-fadeIn">
                <div className="flex items-center justify-between pb-2 border-b border-[#E9EDE7] dark:border-white/10">
                  <span className="font-bold uppercase tracking-wider text-[#063E30] dark:text-white">
                    Shipping & Payment
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-[#F28A19] font-bold hover:underline"
                  >
                    ← Edit Items
                  </button>
                </div>

                {errorMsg && (
                  <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1">
                    Recipient Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.fullName}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1">
                    Street Address & House Number
                  </label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={(e) => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    placeholder="e.g. Friedrichstraße 120"
                    className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.postalCode}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                      placeholder="10117"
                      className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                    />
                  </div>
                  <div>
                    <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      required
                      value={shippingAddress.city}
                      onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                      placeholder="Berlin"
                      className="w-full px-3 py-2 rounded-lg bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-[#263A36] dark:text-white focus:outline-none focus:border-[#07543F]"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block font-bold uppercase tracking-wider text-[#063E30] dark:text-white mb-2">
                    Payment Gateway (Permitted Non-Cannabis)
                  </label>
                  <div className="space-y-2">
                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'stripe'
                        ? 'border-[#07543F] bg-[#07543F]/5 dark:bg-[#07543F]/30'
                        : 'border-[#E9EDE7] dark:border-white/10'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'stripe'}
                        onChange={() => setPaymentMethod('stripe')}
                        className="text-[#07543F]"
                      />
                      <CreditCard className="w-4 h-4 text-[#F28A19]" />
                      <div className="flex-1">
                        <span className="font-bold text-[#063E30] dark:text-white block">Credit / Debit Card (Stripe)</span>
                        <span className="text-[10px] text-[#68756F] dark:text-white/60">Visa, Mastercard, Maestro, Apple Pay</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'sepa'
                        ? 'border-[#07543F] bg-[#07543F]/5 dark:bg-[#07543F]/30'
                        : 'border-[#E9EDE7] dark:border-white/10'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'sepa'}
                        onChange={() => setPaymentMethod('sepa')}
                        className="text-[#07543F]"
                      />
                      <ShieldCheck className="w-4 h-4 text-[#07543F]" />
                      <div className="flex-1">
                        <span className="font-bold text-[#063E30] dark:text-white block">SEPA Direct Debit (German IBAN)</span>
                        <span className="text-[10px] text-[#68756F] dark:text-white/60">Automated European bank clearing</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank_transfer'
                        ? 'border-[#07543F] bg-[#07543F]/5 dark:bg-[#07543F]/30'
                        : 'border-[#E9EDE7] dark:border-white/10'
                    }`}>
                      <input
                        type="radio"
                        name="pay"
                        checked={paymentMethod === 'bank_transfer'}
                        onChange={() => setPaymentMethod('bank_transfer')}
                        className="text-[#07543F]"
                      />
                      <Truck className="w-4 h-4 text-[#68756F]" />
                      <div className="flex-1">
                        <span className="font-bold text-[#063E30] dark:text-white block">Pre-Payment Bank Wire</span>
                        <span className="text-[10px] text-[#68756F] dark:text-white/60">Direct bank transfer to Berlin office</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? 'Confirming Order...' : `Pay Total: €${total.toFixed(2)}`}
                  </button>
                </div>
              </form>
            ) : cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-[#68756F] dark:text-white/60">
                <ShoppingBag className="w-12 h-12 stroke-[1.5] text-slate-300 dark:text-white/30 mb-3" />
                <h4 className="font-bold text-base text-[#263A36] dark:text-white mb-1">
                  Your bag is currently empty
                </h4>
                <p className="text-xs max-w-xs mb-6">
                  Add permitted botanical accessories such as Miron violet curing jars, 62% humidity regulators, and pocket precision scales.
                </p>
                <button
                  onClick={() => {
                    closeCart();
                    navigateTo('shop');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-[#07543F] text-white text-xs font-bold hover:bg-[#063E30] transition-colors"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl border border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#073B2E]/50 flex gap-3 items-center group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 rounded-lg object-cover border border-[#E9EDE7] dark:border-white/10 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-[#F28A19] uppercase tracking-wider block">
                      {item.brand}
                    </span>
                    <h5 className="font-bold text-xs text-[#263A36] dark:text-white truncate">
                      {item.name}
                    </h5>
                    <div className="font-mono text-xs font-bold text-[#07543F] dark:text-emerald-400 mt-0.5">
                      €{(item.price * item.quantity).toFixed(2)}
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border border-[#E9EDE7] dark:border-white/15 rounded-lg bg-white dark:bg-[#063E30]">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-xs text-[#68756F] dark:text-white/60 hover:text-[#263A36] dark:hover:text-white"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-xs text-[#68756F] dark:text-white/60 hover:text-[#263A36] dark:hover:text-white"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-rose-500 hover:text-rose-700 text-xs flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && !orderSuccess && !isCheckingOut && (
            <div className="p-6 border-t border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#073B2E]/90 space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#68756F] dark:text-white/70">
                  <span>Subtotal:</span>
                  <span className="font-mono font-bold text-[#263A36] dark:text-white">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#68756F] dark:text-white/70">
                  <span>Tracked German Courier:</span>
                  <span className="font-mono font-bold text-[#263A36] dark:text-white">
                    {shipping === 0 ? 'FREE (€50+)' : `€${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-[#063E30] dark:text-white pt-2 border-t border-[#E9EDE7] dark:border-white/10">
                  <span>Total Due:</span>
                  <span className="font-mono text-[#F28A19] text-base">€{total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  if (!currentUser) {
                    closeCart();
                    navigateTo('login');
                  } else {
                    setIsCheckingOut(true);
                  }
                }}
                className="w-full py-3.5 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>{currentUser ? 'Proceed to Checkout' : 'Sign in to Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-[10px] text-center text-[#68756F] dark:text-white/50">
                Notice: All checkouts are restricted to permitted legal merchandise & non-cannabis hardware accessories.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

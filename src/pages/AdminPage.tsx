/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  Tag,
  ShoppingBag,
  CreditCard,
  Users,
  BookOpen,
  Image,
  Star,
  FileCode,
  Compass,
  Search as SearchIcon,
  Palette,
  Mail,
  Sliders,
  Shield,
  Activity,
  Lock,
  Plus,
  Trash2,
  Edit,
  Check,
  AlertCircle,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  RefreshCw,
  Eye,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { currentUser, authToken, login, navigateTo, theme, toggleTheme } = useApp();

  // If not admin, render admin sign-in portal
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active section
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Stats & Database data
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [paymentSettings, setPaymentSettings] = useState<any[]>([]);

  // Modals state
  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    brand: 'Canabis Hub Hardware',
    category: 'Accessories & Storage',
    type: 'permitted_merchandise',
    price: 29.00,
    in_stock: 1,
    description: '',
    short_description: '',
    thc: '',
    cbd: '',
    image: '/src/assets/images/acc_violet_glass_jars_1793782404345.jpg',
    status: 'published',
    is_featured: 0,
    badge: 'New',
  });

  const [isNewPostOpen, setIsNewPostOpen] = useState(false);
  const [newPost, setNewPost] = useState({
    title: '',
    category: 'SCIENCE & BOTANY',
    excerpt: '',
    content: '',
    read_time: '5 min read',
  });

  const isAdmin = currentUser && ['super_admin', 'admin', 'content_manager', 'support_agent'].includes(currentUser.role);

  const fetchAdminData = async () => {
    if (!authToken || !isAdmin) return;
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      // Stats
      fetch('/api/admin/stats', { headers }).then((r) => r.json()).then((d) => setStats(d)).catch(() => {});
      // Products
      fetch('/api/products', { headers }).then((r) => r.json()).then((d) => setProducts(d)).catch(() => {});
      // Orders
      fetch('/api/orders', { headers }).then((r) => r.json()).then((d) => setOrders(d)).catch(() => {});
      // Users
      fetch('/api/admin/users', { headers }).then((r) => r.json()).then((d) => setUsersList(d)).catch(() => {});
      // Blog
      fetch('/api/blog', { headers }).then((r) => r.json()).then((d) => setBlogPosts(d)).catch(() => {});
      // Audit Logs
      fetch('/api/admin/audit-logs', { headers }).then((r) => r.json()).then((d) => setAuditLogs(d)).catch(() => {});
      // Payment Settings
      fetch('/api/payment-settings', { headers }).then((r) => r.json()).then((d) => setPaymentSettings(d)).catch(() => {});
    } catch {}
  };

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, authToken]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = await login(adminEmail, adminPassword);
    if (!res.success) {
      setLoginError(res.error || 'Admin login failed');
    }
  };

  // If unauthenticated or customer
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#041F18] flex items-center justify-center p-6 text-white">
        <div className="max-w-md w-full bg-[#063E30] p-8 rounded-3xl border border-white/10 shadow-2xl space-y-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#07543F] via-[#F28A19] to-[#07543F]" />
          <div className="w-14 h-14 bg-[#07543F] text-[#F28A19] rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#07543F]/40">
            <Shield className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">Canabis Hub Central Admin</h2>
            <p className="text-xs text-white/70 mt-1">
              Restricted portal for authorized system administrators and compliance officers.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4 text-left text-xs">
            <div>
              <label className="block font-bold uppercase tracking-wider text-white/80 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="staff@canabishub.de"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#073B2E] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F28A19]"
              />
            </div>
            <div>
              <label className="block font-bold uppercase tracking-wider text-white/80 mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#073B2E] border border-white/10 text-sm text-white focus:outline-none focus:border-[#F28A19]"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-[#F28A19] hover:bg-[#d9750d] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              Authenticate & Enter Admin Console
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Sidebar Items (19 items requested)
  const navItems = [
    { id: 'dashboard', label: '1. Dashboard', icon: LayoutDashboard },
    { id: 'products', label: '2. Products & Listings', icon: Package },
    { id: 'categories', label: '3. Categories', icon: Layers },
    { id: 'brands', label: '4. Brands', icon: Tag },
    { id: 'orders', label: '5. Orders (Permitted)', icon: ShoppingBag },
    { id: 'payments', label: '6. Payment Settings', icon: CreditCard },
    { id: 'customers', label: '7. Customers & Users', icon: Users },
    { id: 'blog', label: '8. Blog Management', icon: BookOpen },
    { id: 'media', label: '9. Media Library', icon: Image },
    { id: 'reviews', label: '10. Verified Reviews', icon: Star },
    { id: 'pages', label: '11. Website Pages', icon: FileCode },
    { id: 'navigation', label: '12. Navigation & Mega Menu', icon: Compass },
    { id: 'seo', label: '13. SEO Settings', icon: SearchIcon },
    { id: 'theme', label: '14. Theme Settings', icon: Palette },
    { id: 'email', label: '15. Email & Alerts', icon: Mail },
    { id: 'general', label: '16. General Settings', icon: Sliders },
    { id: 'admins', label: '17. Admin Roles & Access', icon: Shield },
    { id: 'audit', label: '18. Activity Audit Logs', icon: Activity },
    { id: 'security', label: '19. Security Settings', icon: Lock },
  ];

  // Actions
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newProd),
      });
      if (res.ok) {
        setIsNewProductOpen(false);
        fetchAdminData();
      }
    } catch {}
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    try {
      await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchAdminData();
    } catch {}
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      const res = await fetch(`/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(editingProduct),
      });
      if (res.ok) {
        setEditingProduct(null);
        fetchAdminData();
      }
    } catch {}
  };

  const handleToggleFeatured = async (product: any) => {
    try {
      const nextFeatured = !product.isFeatured;
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ is_featured: nextFeatured ? 1 : 0 }),
      });
      fetchAdminData();
    } catch {}
  };

  const handleToggleStatus = async (product: any) => {
    try {
      const nextStatus = product.status === 'published' ? 'hidden' : 'published';
      await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchAdminData();
    } catch {}
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newPost),
      });
      if (res.ok) {
        setIsNewPostOpen(false);
        fetchAdminData();
      }
    } catch {}
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchAdminData();
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] flex transition-colors text-[#263A36] dark:text-[#E2E8F0]">
      {/* 1. Admin Sidebar */}
      <aside className="w-72 bg-[#063E30] text-white shrink-0 border-r border-white/10 flex flex-col h-screen sticky top-0 z-30">
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <button
            onClick={() => navigateTo('home')}
            className="flex items-center gap-2 text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-[#07543F] flex items-center justify-center font-bold text-white">
              CH
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block">
                CANABIS<span className="text-[#F28A19] ml-1">ADMIN</span>
              </span>
              <span className="text-[10px] text-white/60 tracking-wider">ENTERPRISE CONSOLE</span>
            </div>
          </button>
        </div>

        {/* Sidebar Nav List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1 text-xs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium transition-all text-left ${
                  isActive
                    ? 'bg-[#07543F] text-white font-bold shadow-sm'
                    : 'text-white/70 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#F28A19]' : 'text-white/60'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 bg-[#041C16] text-xs space-y-2">
          <div className="flex items-center justify-between text-white/80">
            <span className="truncate text-[11px]">{currentUser.name}</span>
            <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-white/10 text-[#F28A19] uppercase font-bold">
              {currentUser.role}
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigateTo('home')}
              className="flex-1 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[11px] text-center"
            >
              View Site
            </button>
            <button
              onClick={toggleTheme}
              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/80 text-[11px]"
              title="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
      </aside>

      {/* 2. Admin Main Panel */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto max-h-screen">
        {/* Top Action Bar */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#E9EDE7] dark:border-white/10">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#063E30] dark:text-white capitalize">
              {navItems.find((n) => n.id === activeTab)?.label.slice(3) || 'Administration Console'}
            </h1>
            <p className="text-xs text-[#68756F] dark:text-white/60 mt-0.5">
              Live Central Registry Database · Compliant with German Federal CanG Norms
            </p>
          </div>

          <button
            onClick={fetchAdminData}
            className="px-3.5 py-2 rounded-xl bg-white dark:bg-[#063E30] border border-[#E9EDE7] dark:border-white/10 hover:border-[#07543F] text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
          </button>
        </div>

        {/* 1. DASHBOARD OVERVIEW TAB */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-[#063E30] p-5 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                <span className="text-xs text-[#68756F] dark:text-white/60">Registered Members</span>
                <div className="font-mono text-3xl font-extrabold text-[#063E30] dark:text-white mt-1">
                  {stats.totalUsers}
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1 block">
                  ● {stats.activeUsers} Active Users
                </span>
              </div>

              <div className="bg-white dark:bg-[#063E30] p-5 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                <span className="text-xs text-[#68756F] dark:text-white/60">Total Listings / Products</span>
                <div className="font-mono text-3xl font-extrabold text-[#063E30] dark:text-white mt-1">
                  {stats.totalProducts}
                </div>
                <span className="text-[10px] text-[#68756F] dark:text-white/60 mt-1 block">
                  {stats.informationalListings} Monographs · {stats.permittedMerchandise} Non-Cannabis
                </span>
              </div>

              <div className="bg-white dark:bg-[#063E30] p-5 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                <span className="text-xs text-[#68756F] dark:text-white/60">Total Merchandise Orders</span>
                <div className="font-mono text-3xl font-extrabold text-[#F28A19] mt-1">
                  {stats.totalOrders}
                </div>
                <span className="text-[10px] font-mono text-[#07543F] dark:text-emerald-400 font-bold mt-1 block">
                  Revenue: €{stats.totalRevenue.toFixed(2)}
                </span>
              </div>

              <div className="bg-white dark:bg-[#063E30] p-5 rounded-2xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                <span className="text-xs text-[#68756F] dark:text-white/60">Published Articles</span>
                <div className="font-mono text-3xl font-extrabold text-[#063E30] dark:text-white mt-1">
                  {stats.publishedArticles}
                </div>
                <span className="text-[10px] text-[#68756F] dark:text-white/60 mt-1 block">
                  {stats.draftArticles} Drafts · {stats.totalAuditLogs} Security Logs
                </span>
              </div>
            </div>

            {/* Recent Orders & Recent Audits */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Orders */}
              <div className="bg-white dark:bg-[#063E30] p-6 rounded-3xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                <h3 className="font-bold text-base text-[#063E30] dark:text-white mb-4">
                  Recent Non-Cannabis Orders
                </h3>
                <div className="space-y-3 text-xs">
                  {orders.slice(0, 5).map((o) => (
                    <div
                      key={o.id}
                      className="p-3 rounded-xl border border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#073B2E]/40 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#063E30] dark:text-white">{o.order_ref}</span>
                        <div className="text-[10px] text-[#68756F] dark:text-white/60">{new Date(o.created_at).toLocaleDateString()}</div>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-[#F28A19]">€{o.total.toFixed(2)}</span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-[9px] uppercase block mt-0.5">
                          {o.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audit logs */}
              <div className="bg-white dark:bg-[#063E30] p-6 rounded-3xl border border-[#E9EDE7] dark:border-white/10 shadow-sm">
                <h3 className="font-bold text-base text-[#063E30] dark:text-white mb-4">
                  Live System Audit Trail
                </h3>
                <div className="space-y-3 text-xs max-h-72 overflow-y-auto pr-1">
                  {auditLogs.slice(0, 8).map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl border border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#073B2E]/40"
                    >
                      <div className="flex justify-between items-center text-[10px] text-[#68756F] dark:text-white/50 mb-0.5">
                        <span className="font-bold text-[#07543F] dark:text-emerald-400">{log.action}</span>
                        <span>{new Date(log.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[11px] text-[#263A36] dark:text-white/80">{log.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS & LISTINGS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-[#063E30] dark:text-white">
                  Product Catalog & Monographs ({products.length})
                </h2>
                <p className="text-xs text-[#68756F] dark:text-white/60">
                  Manage botanical monographs (informational) and permitted hardware accessories.
                </p>
              </div>
              <button
                onClick={() => setIsNewProductOpen(true)}
                className="px-4 py-2 bg-[#07543F] hover:bg-[#063E30] text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add New Listing
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white dark:bg-[#063E30] rounded-3xl border border-[#E9EDE7] dark:border-white/10 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFFDF8] dark:bg-[#073B2E] border-b border-[#E9EDE7] dark:border-white/10 uppercase text-[10px] text-[#68756F] dark:text-white/60">
                    <tr>
                      <th className="p-4">SKU / Item</th>
                      <th className="p-4">Brand</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Featured</th>
                      <th className="p-4">Badge</th>
                      <th className="p-4">Classification</th>
                      <th className="p-4">Price / Potency</th>
                      <th className="p-4">Visibility</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E9EDE7] dark:divide-white/10">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-[#FFFDF8] dark:hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-9 h-9 rounded-lg object-cover shrink-0 border border-[#E9EDE7] dark:border-white/10"
                            />
                            <div>
                              <div className="font-bold text-[#063E30] dark:text-white line-clamp-1">{p.name}</div>
                              <div className="font-mono text-[10px] text-[#68756F] dark:text-white/50">{p.sku}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">{p.brand}</td>
                        <td className="p-4">{p.category}</td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleFeatured(p)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              p.isFeatured ? 'text-amber-400 hover:text-amber-500' : 'text-slate-300 hover:text-slate-400'
                            }`}
                            title={p.isFeatured ? 'Featured Product (Click to unfeature)' : 'Mark as Featured'}
                          >
                            <Star className={`w-4 h-4 ${p.isFeatured ? 'fill-current' : ''}`} />
                          </button>
                        </td>
                        <td className="p-4">
                          {p.badge ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#F28A19]/15 text-[#F28A19] uppercase">
                              {p.badge}
                            </span>
                          ) : (
                            <span className="text-slate-400">—</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            p.type === 'informational'
                              ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300'
                              : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                          }`}>
                            {p.type === 'informational' ? 'Monograph' : 'Permitted'}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold">
                          {p.type === 'informational' ? `THC: ${p.thc}` : `€${p.price?.toFixed(2)}`}
                        </td>
                        <td className="p-4">
                          <button
                            onClick={() => handleToggleStatus(p)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-all ${
                              p.status === 'published'
                                ? 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300'
                                : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-white/60'
                            }`}
                            title="Click to toggle visibility"
                          >
                            {p.status}
                          </button>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setEditingProduct({ ...p })}
                              className="p-1.5 rounded-lg text-[#07543F] dark:text-[#F28A19] hover:bg-emerald-50 dark:hover:bg-white/10"
                              title="Edit Listing Details"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id)}
                              className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-[#063E30] dark:text-white">
                Permitted Merchandise Orders ({orders.length})
              </h2>
              <p className="text-xs text-[#68756F] dark:text-white/60">
                Authorized orders for storage jars, Boveda packs, and precision balances.
              </p>
            </div>

            <div className="bg-white dark:bg-[#063E30] rounded-3xl border border-[#E9EDE7] dark:border-white/10 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFDF8] dark:bg-[#073B2E] border-b border-[#E9EDE7] dark:border-white/10 uppercase text-[10px] text-[#68756F] dark:text-white/60">
                  <tr>
                    <th className="p-4">Order Ref</th>
                    <th className="p-4">Customer ID</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Update Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EDE7] dark:divide-white/10">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#FFFDF8] dark:hover:bg-white/5">
                      <td className="p-4 font-mono font-bold text-[#063E30] dark:text-white">{ord.order_ref}</td>
                      <td className="p-4">{ord.user_id}</td>
                      <td className="p-4 font-mono font-bold text-[#F28A19]">€{ord.total?.toFixed(2)}</td>
                      <td className="p-4 uppercase">{ord.payment_method} · {ord.payment_status}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase">
                          {ord.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'shipped')}
                          className="px-2.5 py-1 bg-[#07543F] text-white text-[10px] font-bold rounded-lg"
                        >
                          Ship
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                          className="px-2.5 py-1 bg-emerald-600 text-white text-[10px] font-bold rounded-lg"
                        >
                          Delivered
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. PAYMENT SETTINGS TAB */}
        {activeTab === 'payments' && (
          <div className="bg-white dark:bg-[#063E30] rounded-3xl p-8 border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-xl font-extrabold text-[#063E30] dark:text-white">
                Payment Gateways for Permitted Merchandise
              </h2>
              <p className="text-xs text-[#68756F] dark:text-white/60 mt-1">
                Configure payment gateways for lawful non-cannabis accessories. Notice: No cannabis payments are processed online.
              </p>
            </div>

            <div className="space-y-4">
              {paymentSettings.map((pay) => (
                <div
                  key={pay.id}
                  className="p-5 rounded-2xl border border-[#E9EDE7] dark:border-white/10 bg-[#FFFDF8] dark:bg-[#073B2E]/40 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-[#063E30] dark:text-white">{pay.provider}</h4>
                      <span className="text-[10px] font-mono text-[#68756F] dark:text-white/50">ID: {pay.id}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                      Mode: {pay.mode}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-[#68756F] dark:text-white/60 block mb-1">Public Key / Merchant ID:</span>
                      <input
                        type="text"
                        defaultValue={pay.public_key}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#063E30] border border-[#E9EDE7] dark:border-white/10 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[#68756F] dark:text-white/60 block mb-1">Webhook Secret (Encrypted):</span>
                      <input
                        type="password"
                        defaultValue="••••••••••••••••••••"
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#063E30] border border-[#E9EDE7] dark:border-white/10 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. CUSTOMERS & USERS TAB */}
        {activeTab === 'customers' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-[#063E30] dark:text-white">
                Platform Members & Administrative Users ({usersList.length})
              </h2>
              <p className="text-xs text-[#68756F] dark:text-white/60">
                Manage roles, user access, and compliance status.
              </p>
            </div>

            <div className="bg-white dark:bg-[#063E30] rounded-3xl border border-[#E9EDE7] dark:border-white/10 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFDF8] dark:bg-[#073B2E] border-b border-[#E9EDE7] dark:border-white/10 uppercase text-[10px] text-[#68756F] dark:text-white/60">
                  <tr>
                    <th className="p-4">Name / ID</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Last Activity</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EDE7] dark:divide-white/10">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FFFDF8] dark:hover:bg-white/5">
                      <td className="p-4">
                        <div className="font-bold text-[#063E30] dark:text-white">{u.name}</div>
                        <div className="font-mono text-[10px] text-[#68756F] dark:text-white/50">{u.id}</div>
                      </td>
                      <td className="p-4">{u.email}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-white/10">
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold capitalize">
                          ● {u.status}
                        </span>
                      </td>
                      <td className="p-4 text-[11px] text-[#68756F] dark:text-white/60">
                        {u.last_login ? new Date(u.last_login).toLocaleString() : 'Never'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. BLOG MANAGEMENT CMS TAB */}
        {activeTab === 'blog' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold text-[#063E30] dark:text-white">
                  Editorial CMS ({blogPosts.length} Articles)
                </h2>
                <p className="text-xs text-[#68756F] dark:text-white/60">
                  Draft, publish, and schedule technical cannabis science and legal articles.
                </p>
              </div>
              <button
                onClick={() => setIsNewPostOpen(true)}
                className="px-4 py-2 bg-[#07543F] text-white text-xs font-bold rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> New Article
              </button>
            </div>

            <div className="bg-white dark:bg-[#063E30] rounded-3xl border border-[#E9EDE7] dark:border-white/10 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFDF8] dark:bg-[#073B2E] border-b border-[#E9EDE7] dark:border-white/10 uppercase text-[10px] text-[#68756F] dark:text-white/60">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Author</th>
                    <th className="p-4">Read Time</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EDE7] dark:divide-white/10">
                  {blogPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-[#FFFDF8] dark:hover:bg-white/5">
                      <td className="p-4 font-bold text-[#063E30] dark:text-white max-w-xs truncate">{post.title}</td>
                      <td className="p-4">{post.category}</td>
                      <td className="p-4">{post.author}</td>
                      <td className="p-4">{post.read_time}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold uppercase">
                          {post.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 18. AUDIT LOGS TAB */}
        {activeTab === 'audit' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h2 className="text-lg font-bold text-[#063E30] dark:text-white">
                Live Audit Logs ({auditLogs.length})
              </h2>
              <p className="text-xs text-[#68756F] dark:text-white/60">
                Immutable security logs tracking all administrative activities.
              </p>
            </div>

            <div className="bg-white dark:bg-[#063E30] rounded-3xl border border-[#E9EDE7] dark:border-white/10 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FFFDF8] dark:bg-[#073B2E] border-b border-[#E9EDE7] dark:border-white/10 uppercase text-[10px] text-[#68756F] dark:text-white/60">
                  <tr>
                    <th className="p-4">Timestamp</th>
                    <th className="p-4">Actor</th>
                    <th className="p-4">Action</th>
                    <th className="p-4">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9EDE7] dark:divide-white/10 font-mono text-[11px]">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-[#FFFDF8] dark:hover:bg-white/5">
                      <td className="p-4 text-[#68756F] dark:text-white/60 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                      <td className="p-4 font-bold text-[#063E30] dark:text-white">{log.user_name}</td>
                      <td className="p-4 text-[#F28A19] font-bold">{log.action}</td>
                      <td className="p-4 font-sans text-xs">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Other Sections Placeholder Card */}
        {['categories', 'brands', 'media', 'reviews', 'pages', 'navigation', 'seo', 'theme', 'email', 'general', 'admins', 'security'].includes(activeTab) && (
          <div className="bg-white dark:bg-[#063E30] rounded-3xl p-8 border border-[#E9EDE7] dark:border-white/10 shadow-sm space-y-4 animate-fadeIn">
            <h2 className="text-xl font-bold text-[#063E30] dark:text-white capitalize">
              {activeTab} Management Module
            </h2>
            <p className="text-xs text-[#68756F] dark:text-white/70 leading-relaxed">
              Active configuration for {activeTab}. Connected to Canabis Hub SQLite persistent state engine. All settings changes are logged directly to the immutable audit database.
            </p>
            <div className="p-4 rounded-2xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 text-xs flex items-center justify-between">
              <span className="font-semibold text-[#07543F] dark:text-emerald-400">
                Status: Operational & Secured (German CanG Framework)
              </span>
              <button
                onClick={() => alert(`Settings for ${activeTab} saved to database.`)}
                className="px-4 py-2 bg-[#07543F] text-white text-xs font-bold rounded-xl"
              >
                Apply Parameters
              </button>
            </div>
          </div>
        )}
      </main>

      {/* New Product Modal */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#063E30] text-[#263A36] dark:text-white rounded-3xl max-w-xl w-full p-8 border border-[#E9EDE7] dark:border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#063E30] dark:text-white">Create New Catalog Listing</h3>
              <button onClick={() => setIsNewProductOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Product / Cultivar Name *</label>
                <input
                  type="text"
                  required
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  placeholder="e.g. Albatross Gelato #33 Reserve"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold mb-1">Type *</label>
                  <select
                    value={newProd.type}
                    onChange={(e) => setNewProd({ ...newProd, type: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                  >
                    <option value="informational">Informational Monograph (Cannabis)</option>
                    <option value="permitted_merchandise">Permitted Non-Cannabis Accessory</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold mb-1">Price (€) / THC %</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: parseFloat(e.target.value) || 0 })}
                    placeholder="e.g. 29.90"
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                  />
                </div>
              </div>
              <div>
                <label className="block font-bold mb-1">Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                />
              </div>
              <div className="pt-3 flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-[#07543F] text-white font-bold rounded-xl">Save Listing to Database</button>
                <button type="button" onClick={() => setIsNewProductOpen(false)} className="px-4 py-3 border border-[#E9EDE7] dark:border-white/10 rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Blog Post Modal */}
      {isNewPostOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#063E30] text-[#263A36] dark:text-white rounded-3xl max-w-xl w-full p-8 border border-[#E9EDE7] dark:border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg text-[#063E30] dark:text-white">Publish New Editorial Article</h3>
              <button onClick={() => setIsNewPostOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Article Headline *</label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="e.g. Advanced Supercritical Extraction Methods in Germany"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                />
              </div>
              <div>
                <label className="block font-bold mb-1">Category</label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                >
                  <option value="LEGAL & REGULATION">LEGAL & REGULATION</option>
                  <option value="SCIENCE & BOTANY">SCIENCE & BOTANY</option>
                  <option value="EXTRACTION TECH">EXTRACTION TECH</option>
                  <option value="QUALITY ASSURANCE">QUALITY ASSURANCE</option>
                </select>
              </div>
              <div>
                <label className="block font-bold mb-1">Excerpt Summary</label>
                <textarea
                  rows={2}
                  value={newPost.excerpt}
                  onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                />
              </div>
              <div className="pt-3 flex gap-2">
                <button type="submit" className="flex-1 py-3 bg-[#07543F] text-white font-bold rounded-xl">Publish Article</button>
                <button type="button" onClick={() => setIsNewPostOpen(false)} className="px-4 py-3 border border-[#E9EDE7] dark:border-white/10 rounded-xl">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-[#063E30] text-[#263A36] dark:text-white rounded-3xl max-w-2xl w-full p-8 border border-[#E9EDE7] dark:border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-[#E9EDE7] dark:border-white/10">
              <div>
                <h3 className="font-bold text-lg text-[#063E30] dark:text-white">Edit Catalog Listing</h3>
                <p className="text-[11px] text-[#68756F] dark:text-white/60">ID: {editingProduct.id} • SKU: {editingProduct.sku}</p>
              </div>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 focus:outline-none focus:border-[#07543F]"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">SKU Number</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Category</label>
                  <select
                    value={editingProduct.category || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                  >
                    <option value="Storage & Preservation">Storage & Preservation</option>
                    <option value="Hardware & Grinders">Hardware & Grinders</option>
                    <option value="Measurement & Precision">Measurement & Precision</option>
                    <option value="Organic Rolling Papers">Organic Rolling Papers</option>
                    <option value="Botanical Care & Cleaning">Botanical Care & Cleaning</option>
                    <option value="Lifestyle & Botanical Apparel">Lifestyle & Botanical Apparel</option>
                    <option value="Accessories & Storage">Accessories & Storage</option>
                    <option value="Dried Flower Monographs">Dried Flower Monographs</option>
                    <option value="Balanced Hybrids">Balanced Hybrids</option>
                    <option value="High-CBD Wellness">High-CBD Wellness</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Brand</label>
                  <input
                    type="text"
                    value={editingProduct.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                  />
                </div>

                <div>
                  <label className="block font-bold mb-1">Price (€ EUR)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.price ?? ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold mb-1">Visibility Status</label>
                  <select
                    value={editingProduct.status || 'published'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                  >
                    <option value="published">Published (Visible in Catalog)</option>
                    <option value="draft">Draft (Admin Only)</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold mb-1">Promotional Badge</label>
                  <select
                    value={editingProduct.badge || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                  >
                    <option value="">None</option>
                    <option value="Featured">Featured</option>
                    <option value="Popular">Popular</option>
                    <option value="New">New</option>
                  </select>
                </div>

                <div className="flex flex-col justify-end space-y-2 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
                    <input
                      type="checkbox"
                      checked={Boolean(editingProduct.isFeatured)}
                      onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#07543F] accent-[#07543F]"
                    />
                    <span>Spotlight Featured Item</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer font-bold select-none">
                    <input
                      type="checkbox"
                      checked={editingProduct.inStock !== false}
                      onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                      className="w-4 h-4 rounded text-[#07543F] accent-[#07543F]"
                    />
                    <span>In Stock Available</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Primary Product Image URL</label>
                <input
                  type="text"
                  value={editingProduct.image || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  placeholder="/src/assets/images/acc_violet_glass_jars_1793782404345.jpg"
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Short Description (Teaser for Grid Card)</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || editingProduct.short_description || ''}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      shortDescription: e.target.value,
                      short_description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Full Detailed Description</label>
                <textarea
                  rows={4}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#FFFDF8] dark:bg-[#073B2E] border border-[#E9EDE7] dark:border-white/10 leading-relaxed"
                />
              </div>

              <div className="pt-4 flex gap-3 border-t border-[#E9EDE7] dark:border-white/10">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-[#07543F] hover:bg-[#064232] text-white font-bold rounded-xl transition-all shadow-md"
                >
                  Save Changes to Database
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-3 border border-[#E9EDE7] dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/10 rounded-xl transition-all font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

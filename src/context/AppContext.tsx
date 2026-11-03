/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { PRODUCTS_DATA, BRANDS_DIRECTORY, ProductItem, BrandItem } from '../data/cannabisData';

export type PageRoute =
  | 'home'
  | 'about'
  | 'shop'
  | 'brands'
  | 'brand-detail'
  | 'flower-farms'
  | 'edibles'
  | 'vapes'
  | 'blog'
  | 'blog-post'
  | 'faq'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'cookies'
  | 'responsible-use'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'admin';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'content_manager' | 'support_agent' | 'customer';
  status: 'active' | 'suspended';
  phone?: string;
  address?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  brand: string;
  quantity: number;
  type: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: number;
  created_at: string;
}

interface AppContextType {
  // Navigation
  currentPage: PageRoute;
  pageParam: string | null;
  navigateTo: (page: PageRoute, param?: string | null) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (t: 'light' | 'dark') => void;

  // Auth
  currentUser: UserAccount | null;
  authToken: string | null;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (data: { name: string; email: string; password: string; phone?: string; address?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;

  // Saved Items (Wishlist)
  savedItemIds: string[];
  savedProducts: ProductItem[];
  toggleSaveItem: (productId: string) => void;
  isItemSaved: (productId: string) => boolean;
  clearSavedItems: () => void;

  // Cart for permitted non-cannabis merchandise
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, qty: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Age Verification
  isAgeVerified: boolean;
  verifyAge: () => void;
  denyAge: () => void;
  isAgeModalOpen: boolean;
  setIsAgeModalOpen: (open: boolean) => void;

  // Modals
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  isSavedDrawerOpen: boolean;
  openSavedDrawer: () => void;
  closeSavedDrawer: () => void;

  // Notifications
  notifications: NotificationItem[];
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Navigation state
  const [currentPage, setCurrentPage] = useState<PageRoute>(() => {
    if (window.location.pathname === '/admin') return 'admin';
    return 'home';
  });
  const [pageParam, setPageParam] = useState<string | null>(null);

  // 2. Light / Dark Theme
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    try {
      const stored = localStorage.getItem('canabis_hub_theme');
      if (stored === 'dark' || stored === 'light') return stored;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('canabis_hub_theme', theme);
    } catch {
      // ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const setTheme = (t: 'light' | 'dark') => {
    setThemeState(t);
  };

  // 3. User & Auth state
  const [authToken, setAuthToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('canabis_hub_token') || null;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);

  // Fetch current user from token
  const refreshUser = async () => {
    if (!authToken) {
      setCurrentUser(null);
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
      } else {
        // Invalidate stale token
        setAuthToken(null);
        setCurrentUser(null);
        localStorage.removeItem('canabis_hub_token');
      }
    } catch {
      // ignore network errors
    }
  };

  useEffect(() => {
    refreshUser();
  }, [authToken]);

  const login = async (email: string, pass: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed' };
      }
      setAuthToken(data.token);
      setCurrentUser(data.user);
      localStorage.setItem('canabis_hub_token', data.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const registerUser = async (data: { name: string; email: string; password: string; phone?: string; address?: string }) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const resp = await res.json();
      if (!res.ok) {
        return { success: false, error: resp.error || 'Registration failed' };
      }
      setAuthToken(resp.token);
      setCurrentUser(resp.user);
      localStorage.setItem('canabis_hub_token', resp.token);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Connection error' };
    }
  };

  const logout = () => {
    if (authToken) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${authToken}` },
      }).catch(() => {});
    }
    setAuthToken(null);
    setCurrentUser(null);
    localStorage.removeItem('canabis_hub_token');
    navigateTo('home');
  };

  // 4. Cart for permitted non-cannabis merchandise
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem('canabis_hub_cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('canabis_hub_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (product: any, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) => (i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price || 0,
          image: product.image,
          brand: product.brand,
          quantity,
          type: product.type || 'permitted_merchandise',
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== productId));
  };

  const updateCartQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === productId ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => setCart([]);

  // 5. Saved Items (Wishlist)
  const [savedItemIds, setSavedItemIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('canabis_hub_saved_items');
      return stored ? JSON.parse(stored) : ['prod-1', 'prod-2'];
    } catch {
      return ['prod-1', 'prod-2'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('canabis_hub_saved_items', JSON.stringify(savedItemIds));
    } catch {
      // ignore
    }
  }, [savedItemIds]);

  const toggleSaveItem = (productId: string) => {
    setSavedItemIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isItemSaved = (productId: string) => savedItemIds.includes(productId);
  const clearSavedItems = () => setSavedItemIds([]);

  // 6. Age Verification
  const [isAgeVerified, setIsAgeVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem('canabis_hub_age_verified') === 'true';
    } catch {
      return false;
    }
  });
  const [isAgeModalOpen, setIsAgeModalOpen] = useState<boolean>(!isAgeVerified);

  const verifyAge = () => {
    setIsAgeVerified(true);
    setIsAgeModalOpen(false);
    try {
      localStorage.setItem('canabis_hub_age_verified', 'true');
    } catch {}
  };

  const denyAge = () => {
    setIsAgeVerified(false);
    setIsAgeModalOpen(true);
    try {
      localStorage.removeItem('canabis_hub_age_verified');
    } catch {}
  };

  // 7. Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSavedDrawerOpen, setIsSavedDrawerOpen] = useState(false);

  // 8. Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const fetchNotifications = async () => {
    if (!authToken) return;
    try {
      const res = await fetch('/api/notifications', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch {
      // ignore
    }
  };

  const markNotificationRead = async (id: string) => {
    if (!authToken) return;
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n)));
    } catch {}
  };

  useEffect(() => {
    if (authToken) {
      fetchNotifications();
    }
  }, [authToken]);

  const navigateTo = (page: PageRoute, param: string | null = null) => {
    setCurrentPage(page);
    setPageParam(param);
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const savedProducts = PRODUCTS_DATA.filter((p) => savedItemIds.includes(p.id));

  return (
    <AppContext.Provider
      value={{
        currentPage,
        pageParam,
        navigateTo,
        theme,
        toggleTheme,
        setTheme,
        currentUser,
        authToken,
        login,
        registerUser,
        logout,
        refreshUser,
        savedItemIds,
        savedProducts,
        toggleSaveItem,
        isItemSaved,
        clearSavedItems,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),
        isAgeVerified,
        verifyAge,
        denyAge,
        isAgeModalOpen,
        setIsAgeModalOpen,
        isSearchOpen,
        openSearch: () => setIsSearchOpen(true),
        closeSearch: () => setIsSearchOpen(false),
        isSavedDrawerOpen,
        openSavedDrawer: () => setIsSavedDrawerOpen(true),
        closeSavedDrawer: () => setIsSavedDrawerOpen(false),
        notifications,
        fetchNotifications,
        markNotificationRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

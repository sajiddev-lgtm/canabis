/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AgeVerificationModal } from './components/AgeVerificationModal';
import { SavedItemsDrawer } from './components/SavedItemsDrawer';
import { CartDrawer } from './components/CartDrawer';
import { SearchModal } from './components/SearchModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { BrandDirectoryPage } from './pages/BrandDirectoryPage';
import { BrandDetailPage } from './pages/BrandDetailPage';
import { FlowerFarmsPage } from './pages/FlowerFarmsPage';
import { EdiblesPage } from './pages/EdiblesPage';
import { VapesPage } from './pages/VapesPage';
import { BlogPage } from './pages/BlogPage';
import { BlogPostPage } from './pages/BlogPostPage';
import { FAQPage } from './pages/FAQPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminPage } from './pages/AdminPage';
import { WhatsAppSupport } from './components/WhatsAppSupport';

const AppContent: React.FC = () => {
  const { currentPage, wishlistFeedback } = useApp();

  // If in dedicated admin dashboard, render AdminPage full screen without consumer header/footer
  if (currentPage === 'admin') {
    return (
      <div className="min-h-screen bg-[#041F18] text-white">
        <AdminPage />
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'shop':
        return <ShopPage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'brands':
        return <BrandDirectoryPage />;
      case 'brand-detail':
        return <BrandDetailPage />;
      case 'flower-farms':
        return <FlowerFarmsPage />;
      case 'edibles':
        return <EdiblesPage />;
      case 'vapes':
        return <VapesPage />;
      case 'blog':
        return <BlogPage />;
      case 'blog-post':
        return <BlogPostPage />;
      case 'faq':
        return <FAQPage />;
      case 'contact':
        return <ContactPage />;
      case 'privacy':
      case 'terms':
      case 'cookies':
      case 'responsible-use':
        return <LegalPage />;
      case 'login':
        return <LoginPage />;
      case 'register':
        return <RegisterPage />;
      case 'dashboard':
        return <UserDashboardPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FFFDF8] dark:bg-[#041F18] text-[#263A36] dark:text-[#E2E8F0] transition-colors">
      <Header />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer />

      {/* Global Interactive Modals, Drawers & Support */}
      <WhatsAppSupport />
      <AgeVerificationModal />
      <SavedItemsDrawer />
      <CartDrawer />
      <SearchModal />

      {/* Immediate Visual Feedback Toast for Wishlist */}
      {wishlistFeedback && (
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#063E30] text-white shadow-2xl border border-white/20 animate-fadeIn">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
            wishlistFeedback.action === 'added' ? 'bg-[#F28A19] text-white' : 'bg-slate-700 text-slate-300'
          }`}>
            <span className="text-xs font-bold">★</span>
          </div>
          <div>
            <p className="font-bold text-xs">{wishlistFeedback.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

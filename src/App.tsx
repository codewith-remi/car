import React, { useState, useEffect } from 'react';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { HeroSection } from './components/home/HeroSection';
import { TrustBar } from './components/home/TrustBar';
import { FeaturedGrid } from './components/home/FeaturedGrid';
import { CategoryGrid } from './components/home/CategoryGrid';
import { BudgetSection } from './components/home/BudgetSection';
import { DeliveryCallout } from './components/home/DeliveryCallout';
import { BrowseView } from './components/inventory/BrowseView';
import { VehicleDetailView } from './components/inventory/VehicleDetailView';
import { CompareView } from './components/comparison/CompareView';
import { FavoritesView } from './components/favorites/FavoritesView';
import { InquiryCartView } from './components/cart/InquiryCartView';
import { CustomerAccountModal } from './components/account/CustomerAccountModal';
import { StaticPages } from './components/info/StaticPages';

import { 
  Vehicle, 
  VehicleFilterParams, 
  CustomerUser, 
  PurchaseInquiry
} from './types/vehicle';
import { 
  getFeaturedVehicles, 
  getVehicleById, 
  getInventoryStats, 
  getFilterFacets 
} from './services/inventoryService';
import { 
  getFavorites, 
  toggleFavorite, 
  getComparisonIds, 
  addToComparison, 
  removeFromComparison, 
  clearComparison, 
  getInquiryCart, 
  addToInquiryCart, 
  removeFromInquiryCart, 
  clearInquiryCart, 
  getCurrentCustomer, 
  getSiteSettings 
} from './services/storeService';

export default function App() {
  // Navigation & View state (Staff portal completely removed)
  const [currentView, setCurrentView] = useState<'home' | 'browse' | 'vehicle-detail' | 'favorites' | 'compare' | 'cart' | 'about' | 'contact' | 'faqs' | 'shipping' | 'privacy' | 'terms'>('home');
  const [viewParams, setViewParams] = useState<VehicleFilterParams | undefined>(undefined);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Customer session
  const [customerUser, setCustomerUser] = useState<CustomerUser | null>(getCurrentCustomer());
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Persistent interaction states
  const [favorites, setFavorites] = useState<string[]>(getFavorites());
  const [comparisonIds, setComparisonIds] = useState<string[]>(getComparisonIds());
  const [cartIds, setCartIds] = useState<string[]>(getInquiryCart());

  // Site Settings
  const [siteSettings, setSiteSettings] = useState(getSiteSettings());

  // Toast notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Sync state helpers
  const handleToggleFavorite = (vehicleId: string) => {
    const isNowFav = toggleFavorite(vehicleId);
    setFavorites(getFavorites());
    showToast(isNowFav ? 'Vehicle added to Saved Favorites' : 'Vehicle removed from Favorites');
  };

  const handleToggleCompare = (vehicleId: string) => {
    if (comparisonIds.includes(vehicleId)) {
      removeFromComparison(vehicleId);
      setComparisonIds(getComparisonIds());
      showToast('Removed from comparison');
    } else {
      const res = addToComparison(vehicleId);
      if (res.success) {
        setComparisonIds(getComparisonIds());
        showToast('Added to comparison matrix (up to 4)');
      } else {
        showToast(res.message);
      }
    }
  };

  const handleRemoveFromCompare = (vehicleId: string) => {
    removeFromComparison(vehicleId);
    setComparisonIds(getComparisonIds());
  };

  const handleClearCompare = () => {
    clearComparison();
    setComparisonIds([]);
    showToast('Comparison matrix cleared');
  };

  const handleClearFavorites = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('autoplex_favorites');
    }
    setFavorites([]);
    showToast('Favorites cleared');
  };

  const handleAddToCart = (vehicle: Vehicle) => {
    addToInquiryCart(vehicle.id);
    setCartIds(getInquiryCart());
    showToast(`Added ${vehicle.year} ${vehicle.make} to Inquiry Cart`);
  };

  const handleRemoveCartItem = (vehicleId: string) => {
    removeFromInquiryCart(vehicleId);
    setCartIds(getInquiryCart());
  };

  const handleClearCart = () => {
    clearInquiryCart();
    setCartIds([]);
  };

  const handleStartInquiry = (vehicle: Vehicle) => {
    addToInquiryCart(vehicle.id);
    setCartIds(getInquiryCart());
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (view: string, params?: any) => {
    if (view === 'browse') {
      setViewParams(params);
      setCurrentView('browse');
    } else if (view === 'vehicle-detail' && params?.id) {
      setSelectedVehicleId(params.id);
      setCurrentView('vehicle-detail');
    } else {
      setCurrentView(view as any);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (id: string) => {
    setSelectedVehicleId(id);
    setCurrentView('vehicle-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Data queries
  const stats = getInventoryStats();
  const facets = getFilterFacets();
  const featuredVehicles = getFeaturedVehicles(8);

  const selectedVehicle = selectedVehicleId ? getVehicleById(selectedVehicleId) : null;
  const comparisonVehicles = comparisonIds.map(id => getVehicleById(id)).filter((v): v is Vehicle => v !== null);
  const cartVehicles = cartIds.map(id => getVehicleById(id)).filter((v): v is Vehicle => v !== null);
  const favoriteVehicles = favorites.map(id => getVehicleById(id)).filter((v): v is Vehicle => v !== null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      
      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Responsive Navigation (No staff portal) */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        favoritesCount={favorites.length}
        compareCount={comparisonIds.length}
        cartCount={cartIds.length}
        settings={siteSettings}
        isLoggedIn={!!customerUser}
        customerName={customerUser?.name}
        onOpenAuth={() => setAuthModalOpen(true)}
      />

      {/* Dynamic Content Views */}
      <main className="flex-1">
        {/* VIEW 1: HOMEPAGE */}
        {currentView === 'home' && (
          <div>
            <HeroSection
              onSearch={(params) => handleNavigate('browse', params)}
              availableMakes={facets.makes}
            />

            <TrustBar />

            <FeaturedGrid
              vehicles={featuredVehicles}
              favorites={favorites}
              comparisonIds={comparisonIds}
              onToggleFavorite={handleToggleFavorite}
              onToggleCompare={handleToggleCompare}
              onViewDetails={handleViewDetails}
              onQuickInquire={handleAddToCart}
              onViewAll={() => handleNavigate('browse', { minPrice: 2500, maxPrice: 8000 })}
            />

            <CategoryGrid
              onSelectCategory={(cat) => handleNavigate('browse', { bodyStyle: cat, minPrice: 2500, maxPrice: 8000 })}
              bodyCounts={stats.bodyCounts}
            />

            <BudgetSection
              onSelectBudget={(min, max) => handleNavigate('browse', { minPrice: min, maxPrice: max })}
              stats={stats}
            />

            <DeliveryCallout />
          </div>
        )}

        {/* VIEW 2: BROWSE CATALOG */}
        {currentView === 'browse' && (
          <BrowseView
            initialParams={viewParams}
            favorites={favorites}
            comparisonIds={comparisonIds}
            onToggleFavorite={handleToggleFavorite}
            onToggleCompare={handleToggleCompare}
            onViewDetails={handleViewDetails}
            onQuickInquire={handleAddToCart}
          />
        )}

        {/* VIEW 3: VEHICLE DETAILS */}
        {currentView === 'vehicle-detail' && selectedVehicle && (
          <VehicleDetailView
            vehicle={selectedVehicle}
            isFavorite={favorites.includes(selectedVehicle.id)}
            isInComparison={comparisonIds.includes(selectedVehicle.id)}
            onToggleFavorite={handleToggleFavorite}
            onToggleCompare={handleToggleCompare}
            onBack={() => handleNavigate('browse')}
            onViewDetails={handleViewDetails}
            onStartInquiry={handleStartInquiry}
          />
        )}

        {/* VIEW 4: COMPARISON MATRIX */}
        {currentView === 'compare' && (
          <CompareView
            vehicles={comparisonVehicles}
            onRemoveFromCompare={handleRemoveFromCompare}
            onClearCompare={handleClearCompare}
            onBack={() => handleNavigate('browse')}
            onViewDetails={handleViewDetails}
            onStartInquiry={handleStartInquiry}
            onBrowse={() => handleNavigate('browse')}
          />
        )}

        {/* VIEW 5: FAVORITES */}
        {currentView === 'favorites' && (
          <FavoritesView
            vehicles={favoriteVehicles}
            comparisonIds={comparisonIds}
            onToggleFavorite={handleToggleFavorite}
            onToggleCompare={handleToggleCompare}
            onViewDetails={handleViewDetails}
            onQuickInquire={handleAddToCart}
            onClearFavorites={handleClearFavorites}
            onBrowse={() => handleNavigate('browse')}
            onBack={() => handleNavigate('home')}
          />
        )}

        {/* VIEW 6: INQUIRY CART & CHECKOUT */}
        {currentView === 'cart' && (
          <InquiryCartView
            cartVehicles={cartVehicles}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            onBack={() => handleNavigate('browse')}
            onBrowse={() => handleNavigate('browse')}
            onViewDetails={handleViewDetails}
            customerUser={customerUser}
            onInquirySubmitted={() => {
              setCartIds([]);
              showToast('Official Inquiry submitted successfully');
            }}
          />
        )}

        {/* VIEW 7: STATIC & INFORMATIONAL PAGES */}
        {(['about', 'contact', 'faqs', 'shipping', 'privacy', 'terms'].includes(currentView)) && (
          <StaticPages
            page={currentView as any}
            settings={siteSettings}
            onBack={() => handleNavigate('home')}
            onBrowse={(params) => handleNavigate('browse', params)}
          />
        )}
      </main>

      {/* Footer (No staff console) */}
      <Footer
        onNavigate={handleNavigate}
        settings={siteSettings}
      />

      {/* Customer Account & Auth Modal */}
      <CustomerAccountModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        currentUser={customerUser}
        onUserChange={setCustomerUser}
        onViewFavorites={() => {
          setAuthModalOpen(false);
          handleNavigate('favorites');
        }}
        onBrowse={() => {
          setAuthModalOpen(false);
          handleNavigate('browse');
        }}
      />

    </div>
  );
}

import React, { useState } from 'react';
import { 
  Car, 
  Heart, 
  Layers, 
  ShoppingBag, 
  User, 
  Menu, 
  X, 
  Search, 
  Phone
} from 'lucide-react';
import { SiteSettings } from '../../types/vehicle';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, params?: any) => void;
  favoritesCount: number;
  compareCount: number;
  cartCount: number;
  settings: SiteSettings;
  isLoggedIn: boolean;
  customerName?: string;
  onOpenAuth: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  favoritesCount,
  compareCount,
  cartCount,
  settings,
  isLoggedIn,
  customerName,
  onOpenAuth
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (view: string, params?: any) => {
    onNavigate(view, params);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200/80 shadow-xs">
      {/* Announcement Bar */}
      {settings.announcementEnabled && (
        <div className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
              <span className="font-medium text-slate-100">{settings.announcementText}</span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-slate-400 shrink-0">
              <a href={`tel:${settings.supportPhone}`} className="hover:text-white transition-colors flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>{settings.supportPhone}</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main 3-Zone Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Single Brand Wordmark */}
          <button 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 text-left shrink-0 group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-lg bg-slate-950 flex items-center justify-center text-white shadow-sm border border-slate-800 group-hover:bg-blue-600 transition-colors">
              <Car className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-slate-950 block font-display leading-tight">
                AUTOPLEX
              </span>
              <span className="text-[10px] tracking-widest text-slate-500 uppercase font-semibold block leading-tight">
                Auto Group
              </span>
            </div>
          </button>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-700">
            <button
              onClick={() => handleNavClick('browse')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${currentView === 'browse' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Browse 5,000+ Cars
            </button>
            <button
              onClick={() => handleNavClick('browse', { minPrice: 2500, maxPrice: 4000 })}
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              $2,500 – $4,000
            </button>
            <button
              onClick={() => handleNavClick('browse', { minPrice: 4000, maxPrice: 6000 })}
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              $4,000 – $6,000
            </button>
            <button
              onClick={() => handleNavClick('browse', { minPrice: 6000, maxPrice: 8000 })}
              className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer text-blue-700"
            >
              $6,000 – $8,000
            </button>
            <button
              onClick={() => handleNavClick('shipping')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${currentView === 'shipping' ? 'text-blue-600 font-semibold' : ''}`}
            >
              Delivery & Freight
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${currentView === 'about' ? 'text-blue-600 font-semibold' : ''}`}
            >
              About Us
            </button>
          </nav>

          {/* Zone 3: Actions Group */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Compare shortcut */}
            <button
              onClick={() => handleNavClick('compare')}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Vehicle Comparison"
              aria-label="Vehicle Comparison"
            >
              <Layers className="w-5 h-5" />
              {compareCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                  {compareCount}
                </span>
              )}
            </button>

            {/* Saved Favorites */}
            <button
              onClick={() => handleNavClick('favorites')}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Saved Favorites"
              aria-label="Saved Favorites"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Purchase Inquiry Cart */}
            <button
              onClick={() => handleNavClick('cart')}
              className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Inquiry Cart"
              aria-label="Inquiry Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center tabular-nums">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Account / Login */}
            <button
              onClick={onOpenAuth}
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span className="max-w-24 truncate">{isLoggedIn ? (customerName || 'My Account') : 'Sign In'}</span>
            </button>

            {/* Primary Action Button */}
            <button
              onClick={() => handleNavClick('browse')}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs cursor-pointer whitespace-nowrap shrink-0"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Find Your Car</span>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1 mb-4">
            <button
              onClick={() => handleNavClick('browse')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Browse 5,000+ Cars
            </button>
            <button
              onClick={() => handleNavClick('browse', { minPrice: 2500, maxPrice: 4000 })}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Cars $2,500 – $4,000
            </button>
            <button
              onClick={() => handleNavClick('browse', { minPrice: 4000, maxPrice: 6000 })}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Cars $4,000 – $6,000
            </button>
            <button
              onClick={() => handleNavClick('browse', { minPrice: 6000, maxPrice: 8000 })}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Cars $6,000 – $8,000
            </button>
            <button
              onClick={() => handleNavClick('shipping')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Delivery & Freight Quotes
            </button>
            <button
              onClick={() => handleNavClick('compare')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Compare Vehicles</span>
              <span className="text-xs bg-slate-200 px-2 py-0.5 rounded-full">{compareCount}/4</span>
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              About Autoplex
            </button>
            <button
              onClick={() => handleNavClick('contact')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-slate-800 hover:bg-slate-50"
            >
              Contact Dealership
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 text-sm font-medium text-slate-700"
            >
              <User className="w-4 h-4 text-slate-500" />
              <span>{isLoggedIn ? (customerName || 'Account') : 'Customer Sign In'}</span>
            </button>

            <button
              onClick={() => handleNavClick('browse')}
              className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg shadow-xs"
            >
              Find Your Car
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

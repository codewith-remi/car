import React, { useState } from 'react';
import { Car, Mail, Phone, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';
import { SiteSettings } from '../../types/vehicle';

interface FooterProps {
  onNavigate: (view: string, params?: any) => void;
  settings: SiteSettings;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, settings }) => {
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setSubscribed(true);
    setEmailInput('');
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand & Overview */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <span className="text-base font-bold tracking-tight text-white block font-display leading-tight">
                  AUTOPLEX AUTO GROUP
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-semibold block leading-tight">
                  Quality Vehicles $2,500 – $8,000
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              International pre-owned automotive dealership delivering high-value, inspected, and reliable second-hand cars strictly priced between $2,500 and $8,000 USD. Every vehicle undergoes a 120-point mechanical evaluation.
            </p>

            <div className="space-y-2 text-xs text-slate-300 pt-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.dealershipAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.supportPhone} (Mon–Sat 8:00 AM – 7:00 PM CST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{settings.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Quick Inventory Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Inventory by Budget
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('browse', { minPrice: 2500, maxPrice: 4000 })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cars $2,500 – $4,000
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('browse', { minPrice: 4000, maxPrice: 6000 })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cars $4,000 – $6,000
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('browse', { minPrice: 6000, maxPrice: 8000 })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Cars $6,000 – $8,000
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('browse')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  All 5,000+ Vehicles
                </button>
              </li>
            </ul>
          </div>

          {/* Body Styles */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Popular Styles
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => onNavigate('browse', { bodyStyle: 'Sedan' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Family Sedans
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('browse', { bodyStyle: 'SUV' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Affordable SUVs
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('browse', { bodyStyle: 'Hatchback' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Fuel-Efficient Hatchbacks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('browse', { bodyStyle: 'Pickup Truck' })}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Work Pickup Trucks
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('shipping')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Delivery & Freight Rate Tool
                </button>
              </li>
            </ul>
          </div>

          {/* Dealership & Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Inventory Alerts
            </h4>
            <p className="text-xs text-slate-400">
              Receive notifications when newly certified vehicles between $2,500 and $8,000 are added to our lot.
            </p>
            {subscribed ? (
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-slate-900 border border-slate-800 p-2.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Subscription confirmed. Thank you!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors cursor-pointer"
                >
                  <span>Subscribe to Alerts</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} Autoplex Auto Group. All rights reserved. Strict $2,500 – $8,000 price policy.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-white transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-white transition-colors cursor-pointer">
              Terms & Conditions
            </button>
            <button onClick={() => onNavigate('faqs')} className="hover:text-white transition-colors cursor-pointer">
              FAQs
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors cursor-pointer">
              Contact Dealership
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState } from 'react';
import { Search, SlidersHorizontal, CheckCircle, Shield, ArrowRight } from 'lucide-react';
import { BodyStyle, TransmissionType, FuelType } from '../../types/vehicle';

interface HeroSectionProps {
  onSearch: (params: any) => void;
  availableMakes: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSearch, availableMakes }) => {
  const [make, setMake] = useState('All');
  const [bodyStyle, setBodyStyle] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(8000);
  const [minYear, setMinYear] = useState<string>('All');
  const [transmission, setTransmission] = useState<string>('All');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      make: make === 'All' ? undefined : make,
      bodyStyle: bodyStyle === 'All' ? undefined : bodyStyle,
      maxPrice: Number(maxPrice),
      minYear: minYear === 'All' ? undefined : Number(minYear),
      transmission: transmission === 'All' ? undefined : transmission,
      page: 1
    });
  };

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden">
      {/* Background Hero Image with Measured Gradient Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_car_showroom_1792687189650.jpg"
          alt="Autoplex Premium Showroom"
          className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity scale-102"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Value Proposition */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-400 bg-blue-950/80 border border-blue-800/60 px-3 py-1 rounded-md">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
              Strict Under-$8,000 Vehicle Marketplace
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white leading-[1.1] text-balance">
              Your Next Car. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-200">
                Your Best Deal.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
              Discover thousands of affordable, certified pre-owned vehicles with prices strictly under $8,000. Find the right car for your budget and drive toward your next journey.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onSearch({ page: 1 })}
                className="px-6 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-all duration-150 shadow-md flex items-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>Explore All 5,000+ Cars</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSearch({ maxPrice: 5000, page: 1 })}
                className="px-6 py-3 text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-all duration-150 cursor-pointer whitespace-nowrap"
              >
                Browse Under $5,000
              </button>
            </div>

            {/* Proof Metric Adjacency */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-6 max-w-lg">
              <div>
                <span className="text-2xl font-bold font-display text-white tabular-nums block">
                  5,000+
                </span>
                <span className="text-xs text-slate-400">Inspected Listings</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-emerald-400 tabular-nums block">
                  &lt; $8,000
                </span>
                <span className="text-xs text-slate-400">Price Guarantee</span>
              </div>
              <div>
                <span className="text-2xl font-bold font-display text-white tabular-nums block">
                  120-Point
                </span>
                <span className="text-xs text-slate-400">Mechanical Check</span>
              </div>
            </div>
          </div>

          {/* Right Column: Search Widget */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-6 sm:p-7">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
                <div>
                  <h2 className="text-lg font-bold font-display text-slate-900">
                    Find Your Vehicle
                  </h2>
                  <p className="text-xs text-slate-500">
                    Filter thousands of cars under $8,000 in seconds
                  </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
              </div>

              <form onSubmit={handleSearchSubmit} className="space-y-4">
                {/* Make */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Manufacturer / Make
                  </label>
                  <select
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                  >
                    <option value="All">All Makes (Toyota, Honda, Ford...)</option>
                    {availableMakes.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Body Style & Transmission Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Body Style
                    </label>
                    <select
                      value={bodyStyle}
                      onChange={(e) => setBodyStyle(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                    >
                      <option value="All">Any Style</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                      <option value="Hatchback">Hatchback</option>
                      <option value="Pickup Truck">Pickup Truck</option>
                      <option value="Coupe">Coupe</option>
                      <option value="Wagon">Wagon</option>
                      <option value="Van">Van / Minivan</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Transmission
                    </label>
                    <select
                      value={transmission}
                      onChange={(e) => setTransmission(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                    >
                      <option value="All">Any Transmission</option>
                      <option value="Automatic">Automatic</option>
                      <option value="Manual">Manual</option>
                      <option value="CVT">CVT</option>
                    </select>
                  </div>
                </div>

                {/* Min Year */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Minimum Model Year
                  </label>
                  <select
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-slate-900"
                  >
                    <option value="All">Any Year (2004+)</option>
                    <option value="2008">2008 or newer</option>
                    <option value="2010">2010 or newer</option>
                    <option value="2012">2012 or newer</option>
                    <option value="2014">2014 or newer</option>
                  </select>
                </div>

                {/* Maximum Price Range Slider (Enforces strictly <= $8,000) */}
                <div>
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>Maximum Budget</span>
                    <span className="text-blue-600 font-bold tabular-nums">
                      ${Number(maxPrice).toLocaleString()}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="8000"
                    step="250"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>$1,500</span>
                    <span>$3,000</span>
                    <span>$5,000</span>
                    <span className="font-semibold text-slate-600">$8,000 Max</span>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Search className="w-4 h-4" />
                  <span>Search Matching Inventory</span>
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

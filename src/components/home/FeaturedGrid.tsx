import React, { useState } from 'react';
import { Vehicle } from '../../types/vehicle';
import { VehicleCard } from '../common/VehicleCard';
import { ArrowRight, Sparkles } from 'lucide-react';

interface FeaturedGridProps {
  vehicles: Vehicle[];
  favorites: string[];
  comparisonIds: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onViewDetails: (id: string) => void;
  onQuickInquire?: (vehicle: Vehicle) => void;
  onViewAll: () => void;
}

export const FeaturedGrid: React.FC<FeaturedGridProps> = ({
  vehicles,
  favorites,
  comparisonIds,
  onToggleFavorite,
  onToggleCompare,
  onViewDetails,
  onQuickInquire,
  onViewAll
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'under3k' | 'under5k' | 'suv' | 'sedan'>('all');

  const filteredVehicles = vehicles.filter(v => {
    if (activeTab === 'under3k') return v.price < 3000;
    if (activeTab === 'under5k') return v.price < 5000;
    if (activeTab === 'suv') return v.bodyStyle === 'SUV';
    if (activeTab === 'sedan') return v.bodyStyle === 'Sedan';
    return true;
  }).slice(0, 8);

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Handpicked Inventory</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
              Featured Deals Under $8,000
            </h2>
          </div>

          {/* Interactive filter tabs (functional buttons with active state) */}
          <div className="flex items-center gap-1 p-1 bg-slate-200/80 rounded-lg overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Featured
            </button>
            <button
              onClick={() => setActiveTab('under3k')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'under3k'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Under $3,000
            </button>
            <button
              onClick={() => setActiveTab('under5k')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'under5k'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Under $5,000
            </button>
            <button
              onClick={() => setActiveTab('suv')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'suv'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              SUVs
            </button>
            <button
              onClick={() => setActiveTab('sedan')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === 'sedan'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sedans
            </button>
          </div>
        </div>

        {/* Grid of Vehicles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              isFavorite={favorites.includes(vehicle.id)}
              isInComparison={comparisonIds.includes(vehicle.id)}
              onToggleFavorite={onToggleFavorite}
              onToggleCompare={onToggleCompare}
              onViewDetails={onViewDetails}
              onQuickInquire={onQuickInquire}
              viewMode="grid"
            />
          ))}
        </div>

        {/* Bottom CTA to full catalog */}
        <div className="mt-12 text-center">
          <button
            onClick={onViewAll}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <span>Explore All 5,000+ Verified Vehicles</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};

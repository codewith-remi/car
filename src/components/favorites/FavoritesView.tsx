import React from 'react';
import { Heart, ArrowLeft, Trash2, ShoppingBag } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';
import { VehicleCard } from '../common/VehicleCard';

interface FavoritesViewProps {
  vehicles: Vehicle[];
  comparisonIds: string[];
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onViewDetails: (id: string) => void;
  onQuickInquire?: (vehicle: Vehicle) => void;
  onClearFavorites: () => void;
  onBrowse: () => void;
  onBack: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  vehicles,
  comparisonIds,
  onToggleFavorite,
  onToggleCompare,
  onViewDetails,
  onQuickInquire,
  onClearFavorites,
  onBrowse,
  onBack
}) => {
  if (vehicles.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            Your Favorites List is Empty
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-sm mx-auto">
            Save your top vehicle picks under $8,000 as you browse to easily compare and submit inquiries later.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onBrowse}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Browse 5,000+ Cars
            </button>
            <button
              onClick={onBack}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-200 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-2xl font-bold font-display text-slate-950">
                Saved Vehicles ({vehicles.length})
              </h1>
              <p className="text-xs text-slate-500">
                Your shortlisted pre-owned cars. Stored safely in your account.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onBrowse}
              className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 rounded-lg cursor-pointer"
            >
              Browse More Cars
            </button>
            <button
              onClick={onClearFavorites}
              className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-300 hover:text-rose-600 hover:border-rose-300 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        {/* Vehicles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {vehicles.map((v) => (
            <VehicleCard
              key={v.id}
              vehicle={v}
              isFavorite={true}
              isInComparison={comparisonIds.includes(v.id)}
              onToggleFavorite={onToggleFavorite}
              onToggleCompare={onToggleCompare}
              onViewDetails={onViewDetails}
              onQuickInquire={onQuickInquire}
              viewMode="grid"
            />
          ))}
        </div>

      </div>
    </div>
  );
};

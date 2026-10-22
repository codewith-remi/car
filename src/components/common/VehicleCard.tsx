import React, { useState } from 'react';
import { Heart, Layers, Eye, MapPin, Gauge, ShieldCheck, Check } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  isInComparison: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onViewDetails: (id: string) => void;
  onQuickInquire?: (vehicle: Vehicle) => void;
  viewMode?: 'grid' | 'list';
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  isFavorite,
  isInComparison,
  onToggleFavorite,
  onToggleCompare,
  onViewDetails,
  onQuickInquire,
  viewMode = 'grid'
}) => {
  const [imgError, setImgError] = useState(false);

  // Fallback image handling
  const displayImage = imgError
    ? '/src/assets/images/featured_reliable_sedan_1792687190969.jpg'
    : vehicle.mainImage;

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col sm:flex-row">
        {/* Thumbnail Left */}
        <div 
          onClick={() => onViewDetails(vehicle.id)}
          className="relative sm:w-72 h-52 sm:h-auto bg-slate-100 cursor-pointer overflow-hidden shrink-0"
        >
          <img
            src={displayImage}
            alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
            onError={() => setImgError(true)}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
          />

          {vehicle.featured && (
            <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded tracking-wide">
              Featured Deal
            </div>
          )}

          {vehicle.status !== 'Available' && (
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center">
              <span className="text-white font-bold text-sm tracking-wider uppercase bg-red-600/90 px-3 py-1 rounded">
                {vehicle.status}
              </span>
            </div>
          )}
        </div>

        {/* Content Right */}
        <div className="p-5 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
                  {vehicle.bodyStyle} · {vehicle.condition}
                </span>
                <h3 
                  onClick={() => onViewDetails(vehicle.id)}
                  className="text-base font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer font-display"
                >
                  {vehicle.year} {vehicle.make} {vehicle.model} <span className="font-normal text-slate-600">{vehicle.trim}</span>
                </h3>
              </div>

              {/* Price */}
              <div className="text-right shrink-0">
                <span className="text-xl font-extrabold text-slate-950 font-display tabular-nums block">
                  ${vehicle.price.toLocaleString()}
                </span>
                <span className="text-[11px] text-emerald-700 font-medium">
                  Under $8k Guarantee
                </span>
              </div>
            </div>

            {/* Spec metadata row - Clean text with separators */}
            <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs text-slate-600">
              <span className="tabular-nums">{vehicle.mileage.toLocaleString()} mi</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{vehicle.transmission}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{vehicle.engine}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>{vehicle.drivetrain}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1 text-slate-500">
                <MapPin className="w-3 h-3 text-slate-400" />
                {vehicle.location}
              </span>
            </div>

            <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(vehicle.id)}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isFavorite
                    ? 'bg-rose-50 border-rose-200 text-rose-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={isFavorite ? 'Remove from favorites' : 'Save vehicle'}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-600' : ''}`} />
                <span className="hidden md:inline">{isFavorite ? 'Saved' : 'Save'}</span>
              </button>

              <button
                onClick={() => onToggleCompare(vehicle.id)}
                className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  isInComparison
                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title="Compare with other vehicles"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden md:inline">{isInComparison ? 'Comparing' : 'Compare'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {onQuickInquire && vehicle.status === 'Available' && (
                <button
                  onClick={() => onQuickInquire(vehicle)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Quick Inquire
                </button>
              )}
              <button
                onClick={() => onViewDetails(vehicle.id)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 rounded-lg transition-colors cursor-pointer"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (Standard)
  return (
    <div className="group bg-white rounded-xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden h-full">
      {/* Vehicle Image Container */}
      <div 
        onClick={() => onViewDetails(vehicle.id)}
        className="relative aspect-4/3 bg-slate-100 cursor-pointer overflow-hidden"
      >
        <img
          src={displayImage}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          onError={() => setImgError(true)}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
        />

        {/* Featured Tag */}
        {vehicle.featured && (
          <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded tracking-wide shadow-xs">
            Featured
          </div>
        )}

        {/* Top Right Actions */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md shadow-xs transition-colors cursor-pointer ${
              isFavorite
                ? 'bg-rose-600 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-rose-600'
            }`}
            title={isFavorite ? 'Remove favorite' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(vehicle.id);
            }}
            className={`p-1.5 rounded-full backdrop-blur-md shadow-xs transition-colors cursor-pointer ${
              isInComparison
                ? 'bg-blue-600 text-white'
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-blue-600'
            }`}
            title={isInComparison ? 'Remove from comparison' : 'Compare'}
            aria-label="Toggle compare"
          >
            <Layers className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Sold / Reserved overlay if unavailable */}
        {vehicle.status !== 'Available' && (
          <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-xs flex items-center justify-center">
            <span className="text-white font-bold text-xs tracking-wider uppercase bg-red-600/90 px-3 py-1 rounded">
              {vehicle.status}
            </span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Header & Title */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium mb-1">
            <span>{vehicle.bodyStyle}</span>
            <span>{vehicle.condition}</span>
          </div>

          <h3 
            onClick={() => onViewDetails(vehicle.id)}
            className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 cursor-pointer font-display"
          >
            {vehicle.year} {vehicle.make} {vehicle.model} {vehicle.trim}
          </h3>

          {/* Clean Unboxed Metadata with Typographic Separator */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600">
            <span className="tabular-nums font-medium">{vehicle.mileage.toLocaleString()} mi</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{vehicle.transmission}</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="truncate">{vehicle.engine}</span>
          </div>

          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{vehicle.location}</span>
          </div>
        </div>

        {/* Price & Primary Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <span className="text-xs text-slate-400 block leading-tight font-medium">Price</span>
            <span className="text-base font-extrabold text-slate-950 font-display tabular-nums">
              ${vehicle.price.toLocaleString()}
            </span>
          </div>

          <button
            onClick={() => onViewDetails(vehicle.id)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 group-hover:bg-blue-600 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { BodyStyle } from '../../types/vehicle';
import { Car, ChevronRight } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (category: BodyStyle) => void;
  bodyCounts: Record<string, number>;
}

const CATEGORIES: { style: BodyStyle; label: string; desc: string; iconImage: string }[] = [
  {
    style: 'Sedan',
    label: 'Sedans',
    desc: 'Commuter & family sedans with high fuel efficiency',
    iconImage: '/src/assets/images/featured_reliable_sedan_1792687190969.jpg'
  },
  {
    style: 'SUV',
    label: 'SUVs & Crossovers',
    desc: 'Spacious AWD and compact utility vehicles',
    iconImage: '/src/assets/images/featured_compact_suv_1792687189958.jpg'
  },
  {
    style: 'Hatchback',
    label: 'Hatchbacks',
    desc: 'City-friendly parking & flexible cargo space',
    iconImage: '/src/assets/images/featured_hatchback_1792687191198.jpg'
  },
  {
    style: 'Pickup Truck',
    label: 'Pickup Trucks',
    desc: 'Durable utility trucks for work and hauling',
    iconImage: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80'
  },
  {
    style: 'Coupe',
    label: 'Coupes',
    desc: 'Sporty 2-door styling and agile performance',
    iconImage: '/src/assets/images/hero_car_showroom_1792687189650.jpg'
  },
  {
    style: 'Wagon',
    label: 'Wagons',
    desc: 'Extra cargo volume with smooth sedan handling',
    iconImage: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=600&q=80'
  },
  {
    style: 'Van',
    label: 'Vans & Minivans',
    desc: 'Up to 8-passenger capacity for larger families',
    iconImage: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?auto=format&fit=crop&w=600&q=80'
  },
  {
    style: 'Luxury',
    label: 'Luxury Pre-Owned',
    desc: 'BMW, Mercedes, Audi & Volvo below $8,000',
    iconImage: '/src/assets/images/hero_car_showroom_1792687189650.jpg'
  }
];

export const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory, bodyCounts }) => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
              Popular Body Styles
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
              Browse Vehicles by Category
            </h2>
          </div>
          <p className="text-sm text-slate-600 max-w-md">
            Choose your preferred body style to instantly filter our inventory of over 5,000 certified vehicles.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {CATEGORIES.map((cat) => {
            const count = bodyCounts[cat.style] || 0;
            return (
              <div
                key={cat.style}
                onClick={() => onSelectCategory(cat.style)}
                className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden hover:border-blue-500 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
              >
                <div className="aspect-16/10 bg-slate-100 overflow-hidden relative">
                  <img
                    src={cat.iconImage}
                    alt={cat.label}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-2.5 left-3 text-white">
                    <span className="text-xs font-bold block">{cat.label}</span>
                    <span className="text-[11px] text-slate-300 tabular-nums">
                      {count.toLocaleString()} vehicles
                    </span>
                  </div>
                </div>

                <div className="p-3.5 flex-1 flex items-center justify-between">
                  <span className="text-xs text-slate-600 line-clamp-1">
                    {cat.desc}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { Layers, X, ArrowLeft, Check, Minus, Plus, Mail } from 'lucide-react';
import { Vehicle } from '../../types/vehicle';

interface CompareViewProps {
  vehicles: Vehicle[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onBack: () => void;
  onViewDetails: (id: string) => void;
  onStartInquiry: (vehicle: Vehicle) => void;
  onBrowse: () => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  vehicles,
  onRemoveFromCompare,
  onClearCompare,
  onBack,
  onViewDetails,
  onStartInquiry,
  onBrowse
}) => {
  if (vehicles.length === 0) {
    return (
      <div className="bg-slate-50 min-h-screen py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100">
            <Layers className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-display text-slate-900">
            No Vehicles in Comparison Matrix
          </h2>
          <p className="mt-2 text-sm text-slate-600 max-w-md mx-auto">
            You can compare up to 4 vehicles side-by-side to evaluate specifications, pricing, mileages, and features under $8,000.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              onClick={onBrowse}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
            >
              Browse 5,000+ Cars to Compare
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

  const SPEC_ROWS = [
    { label: 'Price', render: (v: Vehicle) => <span className="font-extrabold text-slate-900 text-sm tabular-nums">${v.price.toLocaleString()}</span> },
    { label: 'Model Year', render: (v: Vehicle) => <span className="tabular-nums font-semibold">{v.year}</span> },
    { label: 'Mileage', render: (v: Vehicle) => <span className="tabular-nums">{v.mileage.toLocaleString()} miles</span> },
    { label: 'Body Style', render: (v: Vehicle) => v.bodyStyle },
    { label: 'Engine', render: (v: Vehicle) => v.engine },
    { label: 'Transmission', render: (v: Vehicle) => v.transmission },
    { label: 'Drivetrain', render: (v: Vehicle) => v.drivetrain },
    { label: 'Fuel Type', render: (v: Vehicle) => v.fuelType },
    { label: 'MPG (City / Hwy)', render: (v: Vehicle) => `${v.mpgCity} / ${v.mpgHwy} MPG` },
    { label: 'Condition', render: (v: Vehicle) => v.condition },
    { label: 'Doors / Seats', render: (v: Vehicle) => `${v.doors} Doors · ${v.seats} Seats` },
    { label: 'Exterior Color', render: (v: Vehicle) => v.exteriorColor },
    { label: 'Interior Color', render: (v: Vehicle) => v.interiorColor },
    { label: 'Inspection', render: () => <span className="text-emerald-700 font-medium">120-Point Passed</span> },
    { label: 'Location', render: (v: Vehicle) => v.location }
  ];

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
                Side-by-Side Vehicle Comparison
              </h1>
              <p className="text-xs text-slate-500">
                Comparing {vehicles.length} of max 4 vehicles. All strictly under $8,000.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {vehicles.length < 4 && (
              <button
                onClick={onBrowse}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Another Vehicle ({4 - vehicles.length} spots left)</span>
              </button>
            )}
            <button
              onClick={onClearCompare}
              className="px-3 py-1.5 bg-white border border-slate-300 text-slate-600 hover:text-red-600 hover:border-red-300 rounded-lg text-xs font-medium cursor-pointer"
            >
              Clear Comparison
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="p-4 w-44 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Vehicle
                </th>
                {vehicles.map((v) => (
                  <th key={v.id} className="p-4 w-64 align-top">
                    <div className="relative group">
                      <button
                        onClick={() => onRemoveFromCompare(v.id)}
                        className="absolute -top-1 -right-1 p-1 bg-white border border-slate-200 rounded-full text-slate-400 hover:text-red-600 shadow-xs cursor-pointer"
                        title="Remove vehicle"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div 
                        onClick={() => onViewDetails(v.id)}
                        className="aspect-16/10 rounded-lg overflow-hidden bg-slate-100 mb-2 cursor-pointer"
                      >
                        <img
                          src={v.mainImage}
                          alt={`${v.year} ${v.make} ${v.model}`}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform"
                        />
                      </div>

                      <h3 
                        onClick={() => onViewDetails(v.id)}
                        className="text-sm font-bold text-slate-900 hover:text-blue-600 transition-colors cursor-pointer font-display"
                      >
                        {v.year} {v.make} {v.model} {v.trim}
                      </h3>

                      <div className="mt-2 flex items-center justify-between">
                        <span className="text-base font-extrabold text-slate-950 font-display tabular-nums">
                          ${v.price.toLocaleString()}
                        </span>
                        <button
                          onClick={() => onStartInquiry(v)}
                          disabled={v.status !== 'Available'}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-md cursor-pointer"
                        >
                          Inquire
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {SPEC_ROWS.map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="p-3.5 font-semibold text-slate-600 bg-slate-50/80">
                    {row.label}
                  </td>
                  {vehicles.map((v) => (
                    <td key={v.id} className="p-3.5">
                      {row.render(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

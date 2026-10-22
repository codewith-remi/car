import React, { useState } from 'react';
import { Truck, Calculator, ShieldCheck, MapPin, CheckCircle, ArrowRight } from 'lucide-react';

export const DeliveryCallout: React.FC = () => {
  const [zipCode, setZipCode] = useState('');
  const [vehicleType, setVehicleType] = useState('Sedan');
  const [transportType, setTransportType] = useState<'open' | 'enclosed'>('open');
  const [calculatedQuote, setCalculatedQuote] = useState<{
    estimatedDays: string;
    lowEstimate: number;
    highEstimate: number;
    disclaimer: string;
  } | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!zipCode || zipCode.length < 5) return;

    // Deterministic transparent delivery rate model based on destination zip
    const firstDigit = parseInt(zipCode[0], 10) || 5;
    const baseMileageFactor = (Math.abs(firstDigit - 7) + 1) * 110;
    const vehicleFactor = vehicleType === 'SUV' || vehicleType === 'Pickup Truck' ? 1.2 : 1.0;
    const carrierFactor = transportType === 'enclosed' ? 1.45 : 1.0;

    const baseCost = Math.round((280 + baseMileageFactor * 0.85) * vehicleFactor * carrierFactor);
    const low = Math.round(baseCost * 0.9 / 10) * 10;
    const high = Math.round(baseCost * 1.15 / 10) * 10;

    const days = firstDigit >= 6 ? '2–4 Business Days' : '3–6 Business Days';

    setCalculatedQuote({
      estimatedDays: days,
      lowEstimate: low,
      highEstimate: high,
      disclaimer: 'Subject to dispatcher schedule and carrier road inspection verification. Carrier insurance is included.'
    });
  };

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 rounded-2xl overflow-hidden shadow-xl border border-slate-800 text-white grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Image and Policy Statement */}
          <div className="lg:col-span-6 relative min-h-[300px] lg:min-h-[460px] flex flex-col justify-end p-8 sm:p-10">
            <img
              src="/src/assets/images/inspection_delivery_truck_1792687193769.jpg"
              alt="Autoplex Bonded Automotive Transport"
              className="absolute inset-0 w-full h-full object-cover opacity-35"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

            <div className="relative z-10 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 bg-blue-950/80 border border-blue-800/80 px-2.5 py-1 rounded">
                <Truck className="w-3.5 h-3.5" />
                <span>Nationwide Bonded Logistics</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                Door-to-Door Automotive Delivery
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed max-w-lg">
                Can't visit our Dallas or regional hubs in person? We arrange insured car carrier freight directly to your home or office address. Complete tracking and pre-delivery inspection guarantee.
              </p>

              <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Full In-Transit Cargo Insurance</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-blue-400" />
                  <span>Licensed DOT Carriers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Freight Calculator */}
          <div className="lg:col-span-6 p-8 sm:p-10 flex flex-col justify-center bg-slate-900/90 backdrop-blur-xs">
            <div className="mb-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-blue-400 block mb-1">
                Instant Freight Estimation
              </span>
              <h4 className="text-xl font-bold font-display text-white">
                Calculate Estimated Delivery Rate
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                Enter your destination US ZIP Code to view transparent carrier estimates.
              </p>
            </div>

            <form onSubmit={handleCalculate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Destination ZIP Code
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    maxLength={5}
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="e.g. 75001 or 30301"
                    required
                    className="w-full pl-9 pr-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={vehicleType}
                    onChange={(e) => setVehicleType(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="Sedan">Sedan / Coupe</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="SUV">SUV / Crossover</option>
                    <option value="Pickup Truck">Pickup Truck</option>
                    <option value="Van">Van / Minivan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Carrier Type
                  </label>
                  <select
                    value={transportType}
                    onChange={(e) => setTransportType(e.target.value as 'open' | 'enclosed')}
                    className="w-full px-3 py-2 text-sm bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="open">Standard Open Carrier</option>
                    <option value="enclosed">Enclosed Transport (+45%)</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculate Rate Estimate</span>
              </button>
            </form>

            {/* Calculated Output Box */}
            {calculatedQuote && (
              <div className="mt-6 p-4 rounded-xl bg-slate-800/80 border border-slate-700 animate-in fade-in-50 duration-200">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-300 font-medium">Estimated Carrier Cost</span>
                  <span className="text-lg font-bold font-display text-emerald-400 tabular-nums">
                    ${calculatedQuote.lowEstimate.toLocaleString()} – ${calculatedQuote.highEstimate.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 mt-1">
                  <span>Transit Timeline</span>
                  <span className="text-white font-medium">{calculatedQuote.estimatedDays}</span>
                </div>
                <p className="mt-2 text-[11px] text-slate-400 border-t border-slate-700/60 pt-2 leading-relaxed">
                  {calculatedQuote.disclaimer}
                </p>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

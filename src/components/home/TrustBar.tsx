import React from 'react';
import { DollarSign, ShieldCheck, Truck, CheckCircle2, FileText, Clock } from 'lucide-react';

export const TrustBar: React.FC = () => {
  return (
    <section className="bg-white border-b border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
            The Autoplex Difference
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
            Transparent, Trustworthy Pre-Owned Purchasing
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            We operate under a strict pricing cap and certified inspection standard to eliminate the stress of used car shopping.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              $2,500 – $8,000 Price Guarantee
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Every single vehicle in our 5,000+ catalog is strictly priced between $2,500 and $8,000 USD. No bait-and-switch, no inflated dealer surcharges.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              120-Point Certification
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              Every car receives a full mechanical safety audit: engine compression, transmission shifting, brakes, suspension, and electrical systems.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-4">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Door-to-Door Delivery
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              We coordinate bonded carrier transportation across 15+ regional logistics hubs with upfront transparent freight quotations.
            </p>
          </div>

          {/* Card 4 */}
          <div className="p-6 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-colors">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 font-display">
              Clean Title Verification
            </h3>
            <p className="mt-2 text-xs text-slate-600 leading-relaxed">
              We explicitly screen for clean ownership titles, verifiable odometer logs, and zero flood or salvage title histories.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

import React from 'react';
import { ArrowRight } from 'lucide-react';

interface BudgetSectionProps {
  onSelectBudget: (minPrice: number, maxPrice: number) => void;
  stats: {
    tier2500to3500: number;
    tier3500to5000: number;
    tier5000to6500: number;
    tier6500to8000: number;
  };
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({ onSelectBudget, stats }) => {
  const TIERS = [
    {
      title: '$2,500 – $3,500',
      minPrice: 2500,
      maxPrice: 3500,
      count: stats.tier2500to3500,
      description: 'Maximum thrift and entry-level value. Reliable compact cars, first-time driver options, and daily commuters.',
      highlight: 'Extreme Affordability',
      badgeColor: 'border-slate-300 bg-white text-slate-800'
    },
    {
      title: '$3,500 – $5,000',
      minPrice: 3500,
      maxPrice: 5000,
      count: stats.tier3500to5000,
      description: 'Our most sought-after budget bracket. Proven Toyotas, Hondas, Nissans, and high-efficiency hatchbacks.',
      highlight: 'Most Popular Range',
      badgeColor: 'border-blue-200 bg-blue-50 text-blue-800 font-semibold'
    },
    {
      title: '$5,000 – $6,500',
      minPrice: 5000,
      maxPrice: 6500,
      count: stats.tier5000to6500,
      description: 'Spacious family sedans, versatile crossover SUVs, and well-maintained utility trucks.',
      highlight: 'Family & Utility Focus',
      badgeColor: 'border-indigo-200 bg-indigo-50 text-indigo-800 font-semibold'
    },
    {
      title: '$6,500 – $8,000',
      minPrice: 6500,
      maxPrice: 8000,
      count: stats.tier6500to8000,
      description: 'Top-tier certified pre-owned units. Newer model years, lower mileage, premium trims, and luxury sedans.',
      highlight: 'Autoplex Cap ($8k Max)',
      badgeColor: 'border-amber-200 bg-amber-50 text-amber-900 font-semibold'
    }
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10">
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider block mb-1">
            Budget-Focused Shopping
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 tracking-tight">
            Shop Within Your Exact Financial Comfort Zone
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            No surprise add-ons. Every vehicle listed on Autoplex strictly adheres to our $2,500 – $8,000 price policy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.title}
              onClick={() => onSelectBudget(tier.minPrice, tier.maxPrice)}
              className="group bg-slate-50 hover:bg-white rounded-xl border border-slate-200 hover:border-blue-600 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[11px] px-2.5 py-0.5 rounded border ${tier.badgeColor}`}>
                    {tier.highlight}
                  </span>
                  <span className="text-xs text-slate-500 font-medium tabular-nums">
                    {tier.count.toLocaleString()} Cars
                  </span>
                </div>

                <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-blue-600 transition-colors">
                  {tier.title}
                </h3>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed">
                  {tier.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs font-semibold text-blue-600 group-hover:text-blue-700">
                <span>View {tier.title}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

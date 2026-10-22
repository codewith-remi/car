import React from 'react';
import { ArrowRight, DollarSign, Sparkles, Tag, Shield } from 'lucide-react';

interface BudgetSectionProps {
  onSelectBudget: (maxPrice: number) => void;
  stats: {
    under2k: number;
    under3k: number;
    under5k: number;
    under8k: number;
  };
}

export const BudgetSection: React.FC<BudgetSectionProps> = ({ onSelectBudget, stats }) => {
  const TIERS = [
    {
      title: 'Under $2,000',
      maxPrice: 2000,
      count: stats.under2k,
      description: 'Maximum thrift. Great for first-time drivers, college students, or basic work commuters.',
      highlight: 'Extreme Affordability',
      badgeColor: 'border-slate-300 bg-white text-slate-800'
    },
    {
      title: 'Under $3,000',
      maxPrice: 3000,
      count: stats.under3k,
      description: 'Dependable daily runners including Chevrolet Cruzes, Ford Focuses, and high-efficiency hatchbacks.',
      highlight: 'Smart Daily Commuters',
      badgeColor: 'border-slate-300 bg-white text-slate-800'
    },
    {
      title: 'Under $5,000',
      maxPrice: 5000,
      count: stats.under5k,
      description: 'Our most popular price range. Proven Toyotas, Hondas, Nissans, and compact crossover SUVs.',
      highlight: 'Most Popular Range',
      badgeColor: 'border-blue-200 bg-blue-50 text-blue-800 font-semibold'
    },
    {
      title: 'Under $8,000',
      maxPrice: 8000,
      count: stats.under8k,
      description: 'Top-tier certified inventory. Lower mileage, newer model years, premium trims, and luxury sedans.',
      highlight: 'Autoplex Maximum Cap',
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
            No surprise add-ons. Every vehicle listed on Autoplex strictly adheres to our under-$8,000 guarantee.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {TIERS.map((tier) => (
            <div
              key={tier.maxPrice}
              onClick={() => onSelectBudget(tier.maxPrice)}
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
                <span>View All {tier.title}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

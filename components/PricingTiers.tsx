'use client';

import { Check, Zap, Crown, Gift } from 'lucide-react';
import { useState } from 'react';

interface PricingTier {
  id: string;
  name: string;
  price: number;
  yearlyPrice?: number;
  downloads: number;
  features: string[];
  highlighted?: boolean;
  icon: React.ReactNode;
}

const tiers: PricingTier[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    downloads: 1,
    icon: <Gift className="w-6 h-6" />,
    features: [
      '1 download per day',
      'Access to free assets',
      'Basic search',
      'Standard quality'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9.99,
    yearlyPrice: 99,
    downloads: 10,
    highlighted: true,
    icon: <Zap className="w-6 h-6" />,
    features: [
      '10 downloads per day',
      'HD quality downloads',
      'Priority support',
      'Advanced search filters',
      'Download history',
      'No watermarks'
    ]
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 29.99,
    yearlyPrice: 299,
    downloads: 30,
    icon: <Crown className="w-6 h-6" />,
    features: [
      '30 downloads per day',
      '4K quality downloads',
      'Early access to new assets',
      'Download history',
      'Commercial license',
      'API access',
      'Priority processing'
    ]
  }
];

interface PricingTiersProps {
  onSelectTier?: (tierId: string) => void;
  selectedTier?: string;
  showToggle?: boolean;
}

export default function PricingTiers({ onSelectTier, selectedTier = 'free', showToggle = true }: PricingTiersProps) {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="py-8">
      {/* Billing Toggle */}
      {showToggle && (
        <div className="flex justify-center mb-8">
          <div className="bg-zinc-900 p-1 rounded-lg inline-flex">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-4 py-2 rounded-md transition-colors ${
                !isYearly
                  ? 'bg-zinc-800 text-blue-400 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-4 py-2 rounded-md transition-colors ${
                isYearly
                  ? 'bg-zinc-800 text-blue-400 shadow-sm'
                  : 'text-zinc-500'
              }`}
            >
              Yearly
              <span className="ml-1.5 text-xs bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded">
                Save 20%
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {tiers.map((tier) => {
          const price = isYearly && tier.yearlyPrice ? tier.yearlyPrice : tier.price;
          const isSelected = selectedTier === tier.id;
          
          return (
            <div
              key={tier.id}
              className={`relative rounded-2xl border-2 p-6 transition-all bg-zinc-900/50 ${
                tier.highlighted
                  ? 'border-blue-500 shadow-xl scale-105'
                  : isSelected
                  ? 'border-blue-400'
                  : 'border-zinc-800'
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-0 right-0 text-center">
                  <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className="text-blue-400">{tier.icon}</div>
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">
                    ${isYearly && tier.yearlyPrice ? (tier.yearlyPrice / 12).toFixed(2) : price}
                  </span>
                  <span className="text-zinc-500 ml-2">
                    /{isYearly ? 'mo' : 'month'}
                  </span>
                </div>
                {isYearly && tier.yearlyPrice && (
                  <p className="text-sm text-zinc-500 mt-1">
                    ${tier.yearlyPrice} billed yearly
                  </p>
                )}
              </div>

              <div className="mb-6">
                <div className="text-center py-3 bg-zinc-800/50 rounded-lg">
                  <span className="text-2xl font-bold text-blue-400">{tier.downloads}</span>
                  <span className="text-zinc-400 ml-2">downloads/day</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <Check className="w-5 h-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-zinc-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => onSelectTier?.(tier.id)}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : tier.highlighted
                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                    : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                }`}
              >
                {isSelected ? 'Selected' : tier.price === 0 ? 'Start Free' : 'Choose Plan'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Bottom note */}
      <p className="text-center text-sm text-zinc-500 mt-8">
        All plans include access to our growing library. Premium packages sold separately.
      </p>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, yearly: 0 },
      description: 'Perfect for getting started',
      features: [
        { text: '1 download per day', included: true },
        { text: 'Access to free assets', included: true },
        { text: 'Standard quality', included: true },
        { text: 'Basic search', included: true },
        { text: 'Community support', included: true },
        { text: 'Commercial license', included: false },
        { text: 'Priority support', included: false },
        { text: 'Premium packages', included: false }
      ],
      cta: 'Start free',
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 9.99, yearly: 99 },
      description: 'For regular creators',
      features: [
        { text: '10 downloads per day', included: true },
        { text: 'HD quality downloads', included: true },
        { text: 'Advanced search filters', included: true },
        { text: 'Download history', included: true },
        { text: 'Priority support', included: true },
        { text: 'No watermarks', included: true },
        { text: 'Commercial license', included: false },
        { text: 'API access', included: false }
      ],
      cta: 'Go Pro',
      popular: true
    },
    {
      name: 'Premium',
      price: { monthly: 29.99, yearly: 299 },
      description: 'For power users and teams',
      features: [
        { text: '30 downloads per day', included: true },
        { text: '4K quality downloads', included: true },
        { text: 'Commercial license', included: true },
        { text: 'Early access to new assets', included: true },
        { text: 'API access', included: true },
        { text: 'Download history & analytics', included: true },
        { text: 'Priority processing', included: true },
        { text: 'Dedicated support', included: true }
      ],
      cta: 'Go Premium',
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-xl font-bold text-white">
            ViralPik
          </Link>
        </div>
      </div>

      {/* Hero */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Simple pricing,<br />no surprises
          </h1>
          <p className="text-xl text-zinc-400 mb-12">
            Choose the plan that fits your creative workflow
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1 bg-zinc-900 rounded-lg">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400'
              }`}
            >
              Yearly
              <span className="ml-2 text-xs text-green-500">Save 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative border rounded-2xl p-8 ${
                  plan.popular
                    ? 'border-white shadow-xl bg-zinc-900'
                    : 'border-zinc-800 bg-zinc-900'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-white text-zinc-900 text-sm font-medium px-4 py-1 rounded-full">
                      Most popular
                    </div>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-zinc-400 mb-6">{plan.description}</p>
                  
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">
                      ${plan.price[billingPeriod]}
                    </span>
                    <span className="text-zinc-400">
                      /{billingPeriod === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-zinc-600 mt-0.5" />
                      )}
                      <span className={feature.included ? 'text-zinc-200' : 'text-zinc-600'}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.name === 'Team' ? '/contact' : '/auth/signup'}
                  className={`block w-full py-3 text-center font-medium transition-colors ${
                    plan.popular
                      ? 'bg-white text-zinc-900 hover:bg-zinc-100'
                      : 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-4 bg-zinc-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">
            Common questions
          </h2>
          
          <div className="space-y-8">
            {[
              {
                q: "Can I change plans anytime?",
                a: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, PayPal, and wire transfers for enterprise customers."
              },
              {
                q: "Is there a free trial?",
                a: "Our Free plan lets you explore the platform. You can upgrade to Pro anytime to unlock all features."
              },
              {
                q: "What's your refund policy?",
                a: "We offer a 14-day money-back guarantee for new Pro and Team subscriptions."
              }
            ].map((item, index) => (
              <div key={index} className="border-b border-zinc-800 pb-8">
                <h3 className="text-lg font-bold text-white mb-3">{item.q}</h3>
                <p className="text-zinc-400">{item.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-400 mb-4">Still have questions?</p>
            <Link href="/support" className="text-white font-medium underline">
              Contact support
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

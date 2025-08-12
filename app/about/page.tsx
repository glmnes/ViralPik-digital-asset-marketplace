'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero - More narrative focused */}
      <div className="relative min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Every viral moment starts with a single asset
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            We built ViralPik because we believe creators shouldn't waste time searching for assets. 
            Pick the perfect ones and focus on creating content that moves culture forward.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            The internet runs on creativity
          </h2>
          <div className="space-y-6 text-lg text-zinc-300 leading-relaxed">
            <p>
              Behind every viral TikTok, every Instagram reel that stops your scroll, 
              every YouTube thumbnail that gets clicked, there's a creator who found the perfect asset.
            </p>
            <p>
              We're not just another marketplace. We're the bridge between raw creative 
              materials and the moments that define internet culture. When creators win, we all win.
            </p>
            <p>
              That's why we built ViralPik differently. No bloat. No outdated content. 
              Just pick from the freshest, most relevant assets for platforms that matter today.
            </p>
          </div>
        </div>
      </section>

      {/* Simple Stats */}
      <section className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">50K+</div>
              <div className="text-zinc-500">Creators</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">2M+</div>
              <div className="text-zinc-500">Downloads</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">24/7</div>
              <div className="text-zinc-500">Fresh content</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-white">100%</div>
              <div className="text-zinc-500">Creator owned</div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Promise */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Our promise to creators
          </h2>
          <div className="space-y-4 text-lg text-zinc-300">
            <p className="font-medium">
              Quality over quantity. Always.
            </p>
            <p>
              We curate every asset. We protect your work. We pay fairly and quickly.
            </p>
            <p>
              Because when you focus on creating, amazing things happen.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to move culture?
          </h2>
          <p className="text-xl text-zinc-400 mb-8">
            Start creating with assets from the world's best creators.
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors rounded-lg"
          >
            Explore assets
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

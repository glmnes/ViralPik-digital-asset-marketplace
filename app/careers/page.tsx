'use client';

import Link from 'next/link';
import { MapPin, Clock, DollarSign, ArrowRight } from 'lucide-react';

export default function CareersPage() {
  const openPositions = [
    {
      id: 1,
      title: 'Senior Frontend Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      salary: '$150k - $200k',
      description: 'Build the future of digital asset marketplaces with React, Next.js, and TypeScript.'
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'Design',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$130k - $170k',
      description: 'Shape the user experience for millions of creators worldwide.'
    },
    {
      id: 3,
      title: 'Content Marketing Manager',
      department: 'Marketing',
      location: 'Remote',
      type: 'Full-time',
      salary: '$90k - $120k',
      description: 'Tell our story and build a community of passionate creators.'
    },
    {
      id: 4,
      title: 'Backend Engineer',
      department: 'Engineering',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$140k - $180k',
      description: 'Scale our infrastructure to handle millions of digital assets.'
    },
    {
      id: 5,
      title: 'Customer Success Lead',
      department: 'Operations',
      location: 'Remote',
      type: 'Full-time',
      salary: '$80k - $100k',
      description: 'Help creators succeed and build lasting relationships.'
    }
  ];

  const benefits = [
    {
      title: 'Remote-first',
      description: 'Work from anywhere in the world'
    },
    {
      title: 'Health coverage',
      description: '100% premium coverage for you and family'
    },
    {
      title: 'Equity',
      description: 'Meaningful ownership in the company'
    },
    {
      title: 'Learning budget',
      description: '$2,500 annual budget for growth'
    },
    {
      title: 'Time off',
      description: 'Unlimited PTO and flexible schedule'
    },
    {
      title: 'Equipment',
      description: 'Top-tier gear to do your best work'
    }
  ];

  const values = [
    {
      title: 'Move fast',
      description: 'We ship quickly and iterate based on feedback'
    },
    {
      title: 'Stay raw',
      description: 'Authenticity over perfection, always'
    },
    {
      title: 'Think big',
      description: 'We\'re building for millions of creators'
    },
    {
      title: 'Own it',
      description: 'Take responsibility and drive results'
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
      <section className="py-24 px-4 border-b border-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Build the future<br />of creativity
          </h1>
          <p className="text-xl text-zinc-400 mb-8">
            Join us in empowering millions of creators worldwide
          </p>
          <Link
            href="#positions"
            className="inline-flex items-center gap-2 px-8 py-3 bg-white text-zinc-900 font-medium hover:bg-zinc-100 transition-colors"
          >
            View open roles
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Our values</h2>
          <p className="text-zinc-400 text-center mb-12">What drives us every day</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index}>
                <h3 className="text-xl font-bold text-white mb-2">{value.title}</h3>
                <p className="text-zinc-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 px-4 bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Benefits & perks</h2>
          <p className="text-zinc-400 text-center mb-12">We take care of our team</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-zinc-800 p-6 rounded-lg">
                <h3 className="text-lg font-bold text-white mb-2">{benefit.title}</h3>
                <p className="text-zinc-400">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Open positions</h2>
          <p className="text-zinc-400 text-center mb-12">Find your next role</p>
          
          <div className="space-y-6">
            {openPositions.map((position) => (
              <Link
                key={position.id}
                href={`/careers/${position.id}`}
                className="block group"
              >
                <div className="border border-zinc-800 p-6 rounded-lg hover:border-zinc-700 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-zinc-300 transition-colors">
                        {position.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                        <span>{position.department}</span>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{position.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{position.type}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span>{position.salary}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors mt-4 md:mt-0" />
                  </div>
                  <p className="text-zinc-400">{position.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* No fit? */}
          <div className="mt-16 text-center p-8 bg-zinc-900 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-3">Don't see the right role?</h3>
            <p className="text-zinc-400 mb-6">
              We're always looking for exceptional talent. Send us your resume and we'll keep you in mind.
            </p>
            <Link
              href="mailto:careers@ViralPik.com"
              className="inline-flex items-center gap-2 text-white font-medium hover:text-zinc-300 transition-colors"
            >
              Send your resume
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Life at ViralPik */}
      <section className="py-24 px-4 bg-zinc-900 border-t border-zinc-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4 text-center">Life at ViralPik</h2>
          <p className="text-zinc-400 text-center mb-12">A glimpse into our culture</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Remote-first, always</h3>
                <p className="text-zinc-400">
                  We believe great work happens anywhere. Our team spans 12 countries and 20+ cities. 
                  Work from your home, a coffee shop, or anywhere you're most productive.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Learning culture</h3>
                <p className="text-zinc-400">
                  Growth is part of our DNA. Weekly learning sessions, conference attendance, 
                  and a generous education budget ensure you're always leveling up.
                </p>
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Ship fast, learn faster</h3>
                <p className="text-zinc-400">
                  We move quickly and iterate based on feedback. No lengthy approval processes 
                  or bureaucracy—just build, ship, and improve.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Diverse perspectives</h3>
                <p className="text-zinc-400">
                  Our team comes from different backgrounds, cultures, and experiences. 
                  This diversity makes our product and company stronger.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

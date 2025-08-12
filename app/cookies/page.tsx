'use client';

import Link from 'next/link';
import { Flame, Cookie, Shield, Settings, Info, ChevronRight, ArrowLeft } from 'lucide-react';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <Flame className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-100">ViralPik</span>
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500/10 rounded-full mb-6">
              <Cookie className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-zinc-100 mb-4">Cookie Policy</h1>
            <p className="text-xl text-zinc-400">
              How we use cookies and similar technologies
            </p>
            <p className="text-sm text-zinc-500 mt-4">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-invert max-w-none">
          {/* Introduction */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">About This Policy</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  This Cookie Policy explains how ViralPik ("we", "us", or "our") uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
                </p>
              </div>
            </div>
          </div>

          {/* What Are Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
              <Cookie className="w-6 h-6 text-blue-500" />
              What Are Cookies?
            </h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <p>
                Cookies set by the website owner (in this case, ViralPik) are called "first-party cookies." Cookies set by parties other than the website owner are called "third-party cookies." Third-party cookies enable third-party features or functionality to be provided on or through the website (e.g., advertising, interactive content, and analytics).
              </p>
            </div>
          </section>

          {/* Types of Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Types of Cookies We Use</h2>
            
            <div className="space-y-6">
              {/* Essential Cookies */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  Essential Cookies
                </h3>
                <p className="text-zinc-400 mb-4">
                  These cookies are strictly necessary for the website to function and cannot be switched off in our systems.
                </p>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Authentication:</strong> Remember you're signed in and keep you logged in</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Security:</strong> Protect against CSRF attacks and maintain session security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Preferences:</strong> Remember your privacy and cookie consent choices</span>
                  </li>
                </ul>
              </div>

              {/* Functional Cookies */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  Functional Cookies
                </h3>
                <p className="text-zinc-400 mb-4">
                  These cookies enable the website to provide enhanced functionality and personalization.
                </p>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Language:</strong> Remember your language preferences</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Theme:</strong> Remember display preferences (dark/light mode)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Collections:</strong> Remember items you've saved or liked</span>
                  </li>
                </ul>
              </div>

              {/* Analytics Cookies */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Analytics Cookies</h3>
                <p className="text-zinc-400 mb-4">
                  These cookies allow us to count visits and traffic sources to measure and improve site performance.
                </p>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Google Analytics:</strong> Track page views and user behavior</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Performance:</strong> Monitor site speed and error rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Usage Patterns:</strong> Understand how features are used</span>
                  </li>
                </ul>
              </div>

              {/* Marketing Cookies */}
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Marketing Cookies</h3>
                <p className="text-zinc-400 mb-4">
                  These cookies may be set through our site by advertising partners to build a profile of your interests.
                </p>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Retargeting:</strong> Show relevant ads on other sites</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Conversion Tracking:</strong> Measure ad campaign effectiveness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Social Media:</strong> Enable sharing and liking features</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Cookie Duration */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Cookie Duration</h2>
            <div className="space-y-4 text-zinc-300">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Session Cookies</h3>
                <p className="text-zinc-400">
                  Temporary cookies that are deleted when you close your browser. Used for maintaining your session state.
                </p>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Persistent Cookies</h3>
                <p className="text-zinc-400">
                  Remain on your device for a set period (ranging from 30 days to 2 years) or until you delete them. Used for remembering your preferences and recognizing you on return visits.
                </p>
              </div>
            </div>
          </section>

          {/* Managing Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Managing Your Cookie Preferences</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                You have several options for managing cookies:
              </p>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Browser Settings</h3>
                <p className="text-zinc-400 mb-4">
                  Most web browsers allow you to control cookies through their settings preferences. However, if you limit the ability of websites to set cookies, you may impact your overall user experience.
                </p>
                <div className="space-y-2 text-sm">
                  <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                    <ChevronRight className="w-4 h-4" />
                    Chrome Cookie Settings
                  </a>
                  <a href="https://support.mozilla.org/en-US/kb/cookies" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                    <ChevronRight className="w-4 h-4" />
                    Firefox Cookie Settings
                  </a>
                  <a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                    <ChevronRight className="w-4 h-4" />
                    Safari Cookie Settings
                  </a>
                  <a href="https://support.microsoft.com/en-us/microsoft-edge/view-and-delete-browser-history-in-microsoft-edge-00cf7943-a9e1-975a-a33d-ac10ce454ca4" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
                    <ChevronRight className="w-4 h-4" />
                    Edge Cookie Settings
                  </a>
                </div>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Opt-Out Options</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span>Google Analytics Opt-out: <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Browser Add-on</a></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span>Network Advertising Initiative: <a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Opt-out Page</a></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span>Digital Advertising Alliance: <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">Consumer Choice Page</a></span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Do Not Track */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Do Not Track Signals</h2>
            <p className="text-zinc-300">
              Some browsers include a "Do Not Track" (DNT) feature that signals to websites that you do not want to have your online activity tracked. Currently, there is no universal standard for how websites should respond to DNT signals. Therefore, our website does not currently respond to DNT signals.
            </p>
          </section>

          {/* Updates */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Updates to This Policy</h2>
            <p className="text-zinc-300">
              We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. When we make changes, we will update the "Last updated" date at the top of this policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Contact Us</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-300 mb-4">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-2 text-zinc-400">
                <p>
                  Email: <a href="mailto:privacy@ViralPik.com" className="text-blue-400 hover:text-blue-300">privacy@ViralPik.com</a>
                </p>
                <p>
                  Support: <Link href="/support" className="text-blue-400 hover:text-blue-300">Visit our Help Center</Link>
                </p>
                <p className="pt-2 text-sm">
                  ViralPik<br />
                  Data Protection Officer<br />
                  privacy@ViralPik.com
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

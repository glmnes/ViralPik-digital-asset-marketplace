import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 pt-20">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
              <Flame className="w-7 h-7 text-white" />
            </div>
            <span className="text-2xl font-bold text-zinc-100">ViralPik</span>
          </Link>
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">Terms of Service</h1>
          <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">1. Acceptance of Terms</h2>
            <p className="text-zinc-300 mb-4">
              By accessing and using ViralPik ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">2. Use License</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                ViralPik grants you a non-exclusive, non-transferable license to use the digital assets downloaded from our platform, subject to the following conditions:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Assets may be used for personal and commercial projects</li>
                <li>Assets may be modified to suit your needs</li>
                <li>Assets cannot be resold, redistributed, or sublicensed as standalone files</li>
                <li>Assets cannot be used in templates or products for resale</li>
                <li>Attribution is appreciated but not required</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">3. User Accounts</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. 
                You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p>
                You agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate and complete registration information</li>
                <li>Maintain the security of your password and account</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Accept responsibility for all activities under your account</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">4. Creator Terms</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                If you are a content creator on ViralPik, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Upload only original content or content you have rights to distribute</li>
                <li>Not upload content that infringes on intellectual property rights</li>
                <li>Not upload malicious, harmful, or inappropriate content</li>
                <li>Grant ViralPik a license to display, distribute, and promote your content</li>
                <li>Maintain professional standards in all interactions</li>
              </ul>
              <p>
                ViralPik reserves the right to remove any content that violates these terms without prior notice.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">5. Prohibited Uses</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                You may not use ViralPik:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
                <li>To collect or track the personal information of others</li>
                <li>To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">6. Payment and Refunds</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                For premium content and services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>All payments are processed securely through our payment partners</li>
                <li>Prices are displayed in USD and are subject to change</li>
                <li>Digital downloads are non-refundable once downloaded</li>
                <li>Subscription cancellations take effect at the end of the current billing period</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">7. Intellectual Property</h2>
            <p className="text-zinc-300 mb-4">
              The Service and its original content, features, and functionality are and will remain the exclusive property of ViralPik and its licensors. 
              The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product 
              or service without our prior written consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">8. Disclaimer</h2>
            <p className="text-zinc-300 mb-4">
              The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, ViralPik:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-300">
              <li>Excludes all representations and warranties relating to this website and its contents</li>
              <li>Excludes all liability for damages arising out of or in connection with your use of this website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">9. Limitation of Liability</h2>
            <p className="text-zinc-300 mb-4">
              In no event shall ViralPik, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, 
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other 
              intangible losses, resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">10. Termination</h2>
            <p className="text-zinc-300 mb-4">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, 
              under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">11. Changes to Terms</h2>
            <p className="text-zinc-300 mb-4">
              We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days 
              notice prior to any new terms taking effect.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">12. Contact Information</h2>
            <p className="text-zinc-300 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="text-zinc-300">
              <p>Email: legal@ViralPik.com</p>
              <p>Address: ViralPik Digital Assets Marketplace</p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-zinc-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-zinc-400 text-sm">
              © {new Date().getFullYear()} ViralPik. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-zinc-400 hover:text-zinc-100 text-sm">
                Privacy Policy
              </Link>
              <Link href="/contact" className="text-zinc-400 hover:text-zinc-100 text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

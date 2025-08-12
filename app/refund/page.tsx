'use client';

import Link from 'next/link';
import { Flame, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle, ChevronRight, ArrowLeft, DollarSign } from 'lucide-react';

export default function RefundPolicyPage() {
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
              <RefreshCw className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-zinc-100 mb-4">Refund Policy</h1>
            <p className="text-xl text-zinc-400">
              Your satisfaction is our priority
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
          {/* Overview */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Our Refund Commitment</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  While digital products are generally non-refundable due to their nature, we understand that sometimes issues arise. We're committed to ensuring customer satisfaction and will work with you to resolve any legitimate concerns.
                </p>
              </div>
            </div>
          </div>

          {/* General Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">General Refund Policy</h2>
            
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">Digital Products Notice</h3>
                  <p className="text-zinc-400 text-sm">
                    Due to the nature of digital downloads, all sales are generally final once the asset has been downloaded. However, we consider refund requests on a case-by-case basis for specific circumstances outlined below.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-zinc-300">
              <p>
                Our refund policy is designed to be fair to both buyers and creators while protecting against fraud and abuse.
              </p>
            </div>
          </section>

          {/* Eligible for Refund */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Eligible for Refund
            </h2>
            
            <div className="space-y-4">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">You may be eligible for a refund if:</h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Technical Issues:</strong> The file is corrupted, incomplete, or cannot be opened/used as described
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Misrepresentation:</strong> The asset is significantly different from its description or preview
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Duplicate Purchase:</strong> You accidentally purchased the same item twice
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Non-Delivery:</strong> You were charged but did not receive access to the download
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Copyright Violation:</strong> The asset infringes on copyrights and has been removed
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Not Eligible */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <XCircle className="w-6 h-6 text-red-500" />
              Not Eligible for Refund
            </h2>
            
            <div className="space-y-4">
              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Refunds are generally NOT provided for:</h3>
                <ul className="space-y-3 text-zinc-400">
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Change of Mind:</strong> You no longer want or need the asset
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Lack of Skills:</strong> You don't have the required software or skills to use the asset
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Platform Issues:</strong> The asset doesn't work on your specific platform (when requirements were clearly stated)
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Downloaded Files:</strong> You've already downloaded and used the files
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Price Changes:</strong> The item goes on sale after your purchase
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                    <div>
                      <strong className="text-zinc-300">Subscription Services:</strong> Partial month refunds for canceled subscriptions
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Refund Process */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6 flex items-center gap-2">
              <Clock className="w-6 h-6 text-blue-500" />
              Refund Request Process
            </h2>
            
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-4">How to Request a Refund</h3>
                <ol className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                    <div>
                      <strong className="text-zinc-100">Contact Support Within 48 Hours</strong>
                      <p className="text-zinc-400 text-sm mt-1">Submit a refund request through our support page within 48 hours of purchase</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                    <div>
                      <strong className="text-zinc-100">Provide Required Information</strong>
                      <p className="text-zinc-400 text-sm mt-1">Include your order number, email, and detailed reason for the refund request</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                    <div>
                      <strong className="text-zinc-100">Provide Evidence (if applicable)</strong>
                      <p className="text-zinc-400 text-sm mt-1">Screenshots or documentation supporting your claim (e.g., error messages, corrupted files)</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                    <div>
                      <strong className="text-zinc-100">Wait for Review</strong>
                      <p className="text-zinc-400 text-sm mt-1">Our team will review your request within 2-3 business days</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
                    <div>
                      <strong className="text-zinc-100">Receive Decision</strong>
                      <p className="text-zinc-400 text-sm mt-1">You'll receive an email with our decision and any next steps</p>
                    </div>
                  </li>
                </ol>
              </div>

              <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-3">Processing Time</h3>
                <ul className="space-y-2 text-zinc-400 text-sm">
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Review:</strong> 2-3 business days</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Approval:</strong> Immediate notification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                    <span><strong>Refund Processing:</strong> 5-10 business days depending on payment method</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Subscription Refunds */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Subscription Refunds</h2>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
              <ul className="space-y-3 text-zinc-400">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <div>
                    <strong className="text-zinc-300">Monthly Subscriptions:</strong> Cancel anytime, access continues until end of billing period
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <div>
                    <strong className="text-zinc-300">Annual Subscriptions:</strong> Pro-rated refund available within first 30 days
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <div>
                    <strong className="text-zinc-300">Free Trials:</strong> Cancel before trial ends to avoid charges
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Creator Protection */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Creator Protection</h2>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
              <p className="text-zinc-300 mb-4">
                We protect our creators from fraudulent refund requests:
              </p>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span>All refund requests are thoroughly reviewed</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span>Downloaded files are tracked and considered in decisions</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span>Repeat refund requesters may be flagged or banned</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span>Creators are notified of refund reasons for quality improvement</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Dispute Resolution</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                If you disagree with our refund decision:
              </p>
              <ol className="space-y-2 ml-6">
                <li>Contact our escalation team at <a href="mailto:disputes@ViralPik.com" className="text-blue-400 hover:text-blue-300">disputes@ViralPik.com</a></li>
                <li>Provide additional evidence or clarification</li>
                <li>Allow 5 business days for secondary review</li>
                <li>Final decisions are binding</li>
              </ol>
            </div>
          </section>

          {/* Changes to Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Changes to This Policy</h2>
            <p className="text-zinc-300">
              We reserve the right to modify this refund policy at any time. Changes will be effective immediately upon posting to this page. Your continued use of ViralPik after changes constitutes acceptance of the modified policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Need Help?</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-300 mb-4">
                For refund requests or questions about this policy:
              </p>
              <div className="space-y-2 text-zinc-400">
                <p>
                  Support: <Link href="/support" className="text-blue-400 hover:text-blue-300">Submit a Support Ticket</Link>
                </p>
                <p>
                  Email: <a href="mailto:refunds@ViralPik.com" className="text-blue-400 hover:text-blue-300">refunds@ViralPik.com</a>
                </p>
                <p>
                  Response Time: Within 2-3 business days
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

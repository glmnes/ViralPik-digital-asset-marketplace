'use client';

import Link from 'next/link';
import { Flame, Shield, AlertTriangle, Mail, FileText, Ban, ChevronRight, ArrowLeft, Scale } from 'lucide-react';

export default function DMCAPage() {
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
              <Scale className="w-10 h-10 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-zinc-100 mb-4">DMCA Policy</h1>
            <p className="text-xl text-zinc-400">
              Digital Millennium Copyright Act Compliance
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
              <Shield className="w-5 h-5 text-blue-500 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">Our Commitment to Copyright</h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  ViralPik respects the intellectual property rights of others and expects our users to do the same. We comply with the Digital Millennium Copyright Act (DMCA) and will respond expeditiously to claims of copyright infringement on our platform.
                </p>
              </div>
            </div>
          </div>

          {/* Notice and Takedown Procedure */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Notice and Takedown Procedure</h2>
            
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-2">Reporting Copyright Infringement</h3>
                  <p className="text-zinc-400 text-sm">
                    If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement and is accessible on this site, please notify our copyright agent as set forth below.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-zinc-300">
              <p>
                To file a DMCA notice, you must provide a written communication that includes substantially the following:
              </p>
              
              <ol className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Identification of the copyrighted work claimed to have been infringed, or, if multiple copyrighted works are covered by a single notification, a representative list of such works.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>Identification of the material that is claimed to be infringing or to be the subject of infringing activity and that is to be removed or access to which is to be disabled, and information reasonably sufficient to permit us to locate the material.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email address.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">5.</span>
                  <span>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">6.</span>
                  <span>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</span>
                </li>
              </ol>
            </div>
          </section>

          {/* Designated Agent */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Designated DMCA Agent</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-300 mb-4">
                Please send all DMCA notices to our designated copyright agent:
              </p>
              <div className="space-y-3 text-zinc-400">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-100">Email (Preferred):</p>
                    <a href="mailto:dmca@ViralPik.com" className="text-blue-400 hover:text-blue-300">
                      dmca@ViralPik.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-semibold text-zinc-100">Physical Mail:</p>
                    <p className="text-sm">
                      ViralPik DMCA Agent<br />
                      Legal Department<br />
                      [Address]<br />
                      [City, State ZIP]
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-sm text-yellow-400">
                  Please note that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material is infringing may be subject to liability.
                </p>
              </div>
            </div>
          </section>

          {/* Counter-Notice */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">Counter-Notice Procedure</h2>
            
            <div className="space-y-4 text-zinc-300">
              <p>
                If you believe that your content was wrongfully removed due to a mistake or misidentification, you may submit a counter-notice containing the following:
              </p>
              
              <ol className="space-y-3 ml-6">
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">1.</span>
                  <span>Your physical or electronic signature.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">2.</span>
                  <span>Identification of the material that has been removed or to which access has been disabled and the location at which the material appeared before it was removed or disabled.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">3.</span>
                  <span>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">4.</span>
                  <span>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located, or if your address is outside of the United States, for any judicial district in which ViralPik may be found.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-blue-400 font-bold">5.</span>
                  <span>A statement that you will accept service of process from the person who provided the original DMCA notification or an agent of such person.</span>
                </li>
              </ol>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mt-6">
                <h3 className="text-lg font-semibold text-zinc-100 mb-2">What Happens Next?</h3>
                <p className="text-zinc-400 text-sm">
                  Upon receipt of a valid counter-notice, we will forward it to the original complainant. If the complainant does not file a lawsuit within 10 business days, we may restore the removed content.
                </p>
              </div>
            </div>
          </section>

          {/* Repeat Infringer Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
              <Ban className="w-6 h-6 text-red-500" />
              Repeat Infringer Policy
            </h2>
            <div className="bg-zinc-900/30 border border-zinc-800 rounded-lg p-6">
              <p className="text-zinc-300 mb-4">
                In accordance with the DMCA and other applicable law, ViralPik has adopted a policy of terminating, in appropriate circumstances, users who are deemed to be repeat infringers.
              </p>
              <ul className="space-y-2 text-zinc-400 text-sm">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span><strong>First Violation:</strong> Warning and content removal</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span><strong>Second Violation:</strong> Temporary account suspension</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span><strong>Third Violation:</strong> Permanent account termination</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Good Faith */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Good Faith Belief</h2>
            <div className="space-y-4 text-zinc-300">
              <p>
                Before submitting a DMCA notice, please consider:
              </p>
              <ul className="space-y-2 ml-6">
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span>Whether the use could be considered fair use</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span>Whether the content is actually infringing</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span>Whether you actually own the copyright to the work</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="w-4 h-4 text-zinc-600 mt-0.5" />
                  <span>The potential consequences of filing a false claim</span>
                </li>
              </ul>
            </div>
          </section>

          {/* Modifications */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Modifications to Policy</h2>
            <p className="text-zinc-300">
              ViralPik reserves the right to modify this policy at any time. We will notify users of any material changes by posting the new policy on this page with an updated revision date.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-2xl font-bold text-zinc-100 mb-4">Questions?</h2>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
              <p className="text-zinc-300 mb-4">
                If you have questions about our DMCA policy, please contact us:
              </p>
              <div className="space-y-2 text-zinc-400">
                <p>
                  DMCA Inquiries: <a href="mailto:dmca@ViralPik.com" className="text-blue-400 hover:text-blue-300">dmca@ViralPik.com</a>
                </p>
                <p>
                  General Legal: <a href="mailto:legal@ViralPik.com" className="text-blue-400 hover:text-blue-300">legal@ViralPik.com</a>
                </p>
                <p>
                  Support: <Link href="/support" className="text-blue-400 hover:text-blue-300">Visit our Help Center</Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

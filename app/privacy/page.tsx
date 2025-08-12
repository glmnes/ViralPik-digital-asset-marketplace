import Link from 'next/link';
import { Flame } from 'lucide-react';

export default function PrivacyPage() {
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
          <h1 className="text-4xl font-bold text-zinc-100 mb-4">Privacy Policy</h1>
          <p className="text-zinc-400">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Content */}
        <div className="prose prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">1. Introduction</h2>
            <p className="text-zinc-300 mb-4">
              At ViralPik, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
              when you visit our website and use our services. Please read this privacy policy carefully. If you do not agree with the terms of this 
              privacy policy, please do not access the site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">2. Information We Collect</h2>
            <div className="text-zinc-300 space-y-4">
              <h3 className="text-xl font-medium text-zinc-200">Personal Information</h3>
              <p>We may collect personal information that you voluntarily provide to us when you:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Register for an account</li>
                <li>Make a purchase or download assets</li>
                <li>Subscribe to our newsletter</li>
                <li>Contact us for support</li>
                <li>Upload content as a creator</li>
              </ul>
              <p>This information may include:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and username</li>
                <li>Email address</li>
                <li>Payment information (processed securely through payment providers)</li>
                <li>Profile information and preferences</li>
                <li>Content you upload or create</li>
              </ul>

              <h3 className="text-xl font-medium text-zinc-200 mt-6">Automatically Collected Information</h3>
              <p>When you visit our site, we may automatically collect certain information about your device, including:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Operating system</li>
                <li>Access times and dates</li>
                <li>Pages viewed and links clicked</li>
                <li>Referring website addresses</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">3. How We Use Your Information</h2>
            <div className="text-zinc-300 space-y-4">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create and manage your account</li>
                <li>Process your transactions and deliver digital assets</li>
                <li>Send you important updates about your account or purchases</li>
                <li>Respond to your comments, questions, and customer service requests</li>
                <li>Send you marketing and promotional communications (with your consent)</li>
                <li>Monitor and analyze usage and trends to improve our services</li>
                <li>Detect, prevent, and address technical issues and fraud</li>
                <li>Comply with legal obligations</li>
                <li>Protect our rights and the rights of other users</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">4. Cookies and Tracking Technologies</h2>
            <div className="text-zinc-300 space-y-4">
              <p>
                We use cookies and similar tracking technologies to track activity on our service and hold certain information. 
                Cookies are files with a small amount of data which may include an anonymous unique identifier.
              </p>
              <p>You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, 
                you may not be able to use some portions of our service.</p>
              <p>Types of cookies we use:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements (with consent)</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">5. Information Sharing and Disclosure</h2>
            <div className="text-zinc-300 space-y-4">
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information in the following situations:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf</li>
                <li><strong>Legal Requirements:</strong> If required by law or in response to valid requests by public authorities</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale of company assets, or acquisition</li>
                <li><strong>Protection of Rights:</strong> To protect and defend our rights or property</li>
                <li><strong>Consent:</strong> With your consent to do so</li>
              </ul>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">6. Data Security</h2>
            <p className="text-zinc-300 mb-4">
              We implement appropriate technical and organizational security measures to protect your personal information against accidental or unlawful 
              destruction, loss, alteration, unauthorized disclosure, or access. However, please note that no method of transmission over the Internet 
              or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">7. Data Retention</h2>
            <p className="text-zinc-300 mb-4">
              We will retain your personal information only for as long as necessary to fulfill the purposes for which we collected it, including for 
              the purposes of satisfying any legal, accounting, or reporting requirements. When we no longer need your personal information, we will 
              securely delete or destroy it.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">8. Your Privacy Rights</h2>
            <div className="text-zinc-300 space-y-4">
              <p>Depending on your location, you may have the following rights regarding your personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Data Portability:</strong> Request a copy of your information in a structured format</li>
                <li><strong>Opt-out:</strong> Opt-out of marketing communications</li>
                <li><strong>Restriction:</strong> Request restriction of processing of your information</li>
              </ul>
              <p>To exercise any of these rights, please contact us using the information provided below.</p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">9. Children's Privacy</h2>
            <p className="text-zinc-300 mb-4">
              Our service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. 
              If you are a parent or guardian and believe that your child has provided us with personal information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">10. International Data Transfers</h2>
            <p className="text-zinc-300 mb-4">
              Your information may be transferred to and maintained on servers located outside of your state, province, country, or other governmental 
              jurisdiction where data protection laws may differ. By using our service, you consent to the transfer of your information to these locations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">11. Third-Party Links</h2>
            <p className="text-zinc-300 mb-4">
              Our service may contain links to third-party websites or services that are not operated by us. We have no control over and assume no 
              responsibility for the content, privacy policies, or practices of any third-party sites or services. We strongly advise you to review 
              the privacy policy of every site you visit.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">12. California Privacy Rights (CCPA)</h2>
            <p className="text-zinc-300 mb-4">
              If you are a California resident, you have specific rights under the California Consumer Privacy Act (CCPA). These include the right to 
              know what personal information we collect, the right to delete your information, the right to opt-out of the sale of your information 
              (which we do not do), and the right to non-discrimination for exercising your privacy rights.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">13. European Privacy Rights (GDPR)</h2>
            <p className="text-zinc-300 mb-4">
              If you are located in the European Economic Area (EEA), you have certain data protection rights under the General Data Protection 
              Regulation (GDPR). We aim to take reasonable steps to allow you to correct, amend, delete, or limit the use of your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">14. Updates to This Policy</h2>
            <p className="text-zinc-300 mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page 
              and updating the "Last updated" date at the top of this policy. We encourage you to review this Privacy Policy periodically for any changes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-zinc-100 mb-4">15. Contact Us</h2>
            <div className="text-zinc-300 space-y-2">
              <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
              <p className="mt-4">
                <strong>ViralPik Digital Assets Marketplace</strong><br />
                Email: privacy@ViralPik.com<br />
                Support: support@ViralPik.com
              </p>
              <p className="mt-4">
                For data protection inquiries, you may also contact our Data Protection Officer at: dpo@ViralPik.com
              </p>
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
              <Link href="/terms" className="text-zinc-400 hover:text-zinc-100 text-sm">
                Terms of Service
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

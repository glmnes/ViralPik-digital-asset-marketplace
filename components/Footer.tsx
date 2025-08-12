import Link from 'next/link';
import { Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-xl font-bold text-zinc-100">ViralPik</span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed mb-6 max-w-xs">
              Raw, unfiltered assets for creators who move culture.
            </p>
            <div className="flex gap-3">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-zinc-300 font-medium mb-4 text-sm uppercase tracking-wider">Products</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  ViralPik
                </Link>
              </li>
              <li>
                <span className="text-zinc-700 text-sm">More coming soon</span>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-zinc-300 font-medium mb-4 text-sm uppercase tracking-wider">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  About us
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Started */}
          <div>
            <h4 className="text-zinc-300 font-medium mb-4 text-sm uppercase tracking-wider">Get Started</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/pricing" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/sell" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  Sell content
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-zinc-300 font-medium mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/dmca" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  DMCA
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-zinc-500 hover:text-zinc-100 transition-colors text-sm">
                  Refunds
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-zinc-900 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-600 text-xs">
              © {new Date().getFullYear()} ViralPik
            </p>
            <div className="flex gap-6 text-xs">
              <Link href="/sitemap" className="text-zinc-600 hover:text-zinc-400 transition-colors">
                Sitemap
              </Link>
              <Link href="/cookies" className="text-zinc-600 hover:text-zinc-400 transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

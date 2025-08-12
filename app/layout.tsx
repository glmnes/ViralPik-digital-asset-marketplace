import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import "./theme.css";
import "gestalt/dist/gestalt.css";
import NavHeader from "@/components/NavHeader";
import Footer from "@/components/Footer";
import ErrorBoundary from "@/components/ErrorBoundary";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { generateSEO } from "@/lib/seo";
import GestaltProvider from "@/components/providers/GestaltProvider";

const workSans = Work_Sans({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-work-sans',
});

export const metadata: Metadata = generateSEO();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className={`${workSans.className} antialiased bg-black text-zinc-100`}>
        <ErrorBoundary>
          <GestaltProvider>
            <AuthProvider>
              <div className="min-h-screen flex flex-col">
                <NavHeader />
                <main className="flex-1" style={{ paddingTop: '56px' }}>
                  {children}
                </main>
                <Footer />
              </div>
              <Toaster
              position="bottom-right"
              toastOptions={{
                duration: 2000,
                style: {
                  background: '#0a0a0a',
                  color: '#ffffff',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  fontSize: '14px',
                },
              }}
            />
            </AuthProvider>
          </GestaltProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

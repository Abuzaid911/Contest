import type { Metadata } from 'next';
import { Inter, Amiri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import '@/lib/pwa';
import PWAInstallGuide from '@/components/PWAInstallGuide';

const inter = Inter({ subsets: ['latin'] });
const amiri = Amiri({ 
  weight: ['400', '700'],
  subsets: ['arabic', 'latin'],
  display: 'swap',
  variable: '--font-amiri',
  preload: true,
  adjustFontFallback: true
});

export const metadata: Metadata = {
  title: 'Ramadan Iftar Contest',
  description: 'Share your Iftar meals and vote for your favorites during Ramadan',
  manifest: '/manifest.json',
  themeColor: '#C8A655',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${amiri.variable} flex flex-col min-h-screen`}>
        <AuthProvider>
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
          <PWAInstallGuide />
        </AuthProvider>
      </body>
    </html>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-primary-brown text-primary text-center py-4 text-sm">
      <p>
        Built by 
        <a 
          href="https://abuzaid.tech" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="underline hover:text-primary-gold ml-1"
        >
          Abuzaid
        </a>
      </p>
      <p className="opacity-80 mt-1">
        Developed during Ramadan 😅
      </p>
    </footer>
  );
}
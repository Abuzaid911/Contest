// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Amiri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import { Moon, Star } from 'lucide-react';

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const currentYear = new Date().getFullYear();
  
  return (
    <html lang="en">
      <body className={`${inter.className} ${amiri.variable}`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="bg-primary-brown py-8 mt-12 relative">
            <div className="absolute top-0 left-0 right-0 h-3 bg-primary-gold opacity-80"></div>
            <div className="container mx-auto px-4 text-center text-sand-light">
              <div className="flex justify-center items-center mb-4">
                <Moon className="h-6 w-6 text-primary-gold" />
                <span className="mx-3 text-xl font-['Amiri'] font-bold">Ramadan Iftar Contest</span>
                <Star className="h-6 w-6 text-primary-gold" />
              </div>
              <p className="opacity-90">© {currentYear} Ramadan Iftar Contest</p>
              <p className="mt-2 text-sm opacity-70">Share your Iftar meals and celebrate Ramadan together</p>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary-gold opacity-50"></div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
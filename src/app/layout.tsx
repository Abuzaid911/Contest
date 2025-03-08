// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';
import { Moon, Star } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

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
      <body className={inter.className}>
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
              <div className="mt-4 flex justify-center space-x-4 text-xs opacity-70">
                <a href="#" className="hover:text-primary-gold transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-primary-gold transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-primary-gold transition-colors">Contact Us</a>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-2 bg-primary-gold opacity-50"></div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
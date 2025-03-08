// app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';

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
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main>{children}</main>
          <footer className="bg-gray-100 py-8 mt-12">
            <div className="container mx-auto px-4 text-center text-gray-600">
              <p>Ramadan Iftar Contest © {new Date().getFullYear()}</p>
              <p className="mt-2 text-sm">Share your Iftar meals and celebrate Ramadan together</p>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
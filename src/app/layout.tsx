// app/layout.tsx
import type { Metadata } from 'next';
import { Inter, Amiri } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AuthProvider from '@/components/AuthProvider';

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
  return (
    <html lang="en">
      <body className={`${inter.className} ${amiri.variable}`}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Moon, Star } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);
  const handleSignOut = () => {
    signOut();
    closeMenu();
  };

  return (
    <>
      <div className="ramadan-decoration-top"></div>
      <nav className="bg-cream shadow-md border-b border-primary-gold">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="font-bold text-xl text-primary-brown hover:text-primary-gold transition-colors flex items-center">
              <Moon className="h-6 w-6 mr-2 text-primary-gold" />
              <span className="font-['Amiri']">Ramadan Iftar Contest</span>
              <Star className="h-4 w-4 ml-2 text-primary-gold" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <NavLinks session={session} handleSignOut={handleSignOut} />
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-primary-brown hover:text-primary-gold focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && <MobileMenu session={session} closeMenu={closeMenu} handleSignOut={handleSignOut} />}
      </nav>
    </>
  );
}

const NavLinks = ({ session, handleSignOut }: { session: any; handleSignOut: () => void }) => (
  <>
    <Link href="/" className="text-primary-brown hover:text-primary-gold transition-colors">
      Home
    </Link>
    <Link href="/winners" className="text-primary-brown hover:text-primary-gold transition-colors">
      Past Winners
    </Link>
    {session ? <UserDropdown session={session} handleSignOut={handleSignOut} /> : <SignInButton />}
  </>
);

const UserDropdown = ({ session, handleSignOut }: { session: any; handleSignOut: () => void }) => (
  <div className="relative group">
    <button className="flex items-center space-x-1 focus:outline-none">
      <div className="h-8 w-8 rounded-full overflow-hidden relative border-2 border-primary-gold">
        <Image
          src={session.user?.image || '/placeholder-avatar.png'}
          alt={session.user?.name || 'User'}
          fill
          className="object-cover"
        />
      </div>
    </button>
    <div className="absolute right-0 mt-2 w-48 bg-sand-light rounded-md shadow-lg py-1 z-10 hidden group-hover:block border border-primary-gold">
      <div className="px-4 py-2 text-sm text-primary-brown border-b border-primary-gold">{session.user?.name || 'User'}</div>
      <Link href="/profile" className="block px-4 py-2 text-sm text-primary-brown hover:bg-primary-gold hover:text-white transition-colors">
        Profile
      </Link>
      <button
        onClick={handleSignOut}
        className="block w-full text-left px-4 py-2 text-sm text-primary-brown hover:bg-primary-gold hover:text-white transition-colors"
      >
        Sign out
      </button>
    </div>
  </div>
);

const SignInButton = () => (
  <Link href="/api/auth/signin" className="bg-primary-gold text-white px-4 py-2 rounded-md hover:bg-secondary-gold transition-colors">
    Sign in
  </Link>
);

const MobileMenu = ({ session, closeMenu, handleSignOut }: { session: any; closeMenu: () => void; handleSignOut: () => void }) => (
  <div className="md:hidden">
    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-sand-light border-b border-primary-gold">
      <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-primary-brown hover:bg-primary-gold hover:text-white" onClick={closeMenu}>
        Home
      </Link>
      <Link href="/winners" className="block px-3 py-2 rounded-md text-base font-medium text-primary-brown hover:bg-primary-gold hover:text-white" onClick={closeMenu}>
        Past Winners
      </Link>
      {session ? (
        <>
          <Link href="/profile" className="block px-3 py-2 rounded-md text-base font-medium text-primary-brown hover:bg-primary-gold hover:text-white" onClick={closeMenu}>
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-primary-brown hover:bg-primary-gold hover:text-white"
          >
            Sign out
          </button>
        </>
      ) : (
        <Link href="/api/auth/signin" className="block px-3 py-2 rounded-md text-base font-medium bg-primary-gold text-white hover:bg-secondary-gold" onClick={closeMenu}>
          Sign in
        </Link>
      )}
    </div>
  </div>
);
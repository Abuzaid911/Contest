'use client';

import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Moon, Star } from 'lucide-react';
import Image from 'next/image';

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  return (
    <div className="min-h-screen flex items-center justify-center bg-sand-lighter py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-0 left-0 right-0 h-3 bg-primary-gold opacity-80"></div>
      
      <div className="max-w-md w-full space-y-8">
        <div className="bg-cream rounded-lg shadow-lg p-8 border-2 border-primary-gold">
          <div className="flex justify-center items-center mb-6">
            <Moon className="h-8 w-8 text-primary-gold" />
            <h2 className="mx-3 text-center text-3xl font-extrabold text-primary-brown font-['Amiri']">
              Welcome
            </h2>
            <Star className="h-8 w-8 text-primary-gold" />
          </div>

          <div className="text-center mb-6">
            <h3 className="text-xl text-primary-brown font-['Amiri']">Ramadan Iftar Contest</h3>
            <p className="mt-2 text-sm text-primary-brown opacity-80">
              Join our community to share your Iftar meals and vote for others during the holy month of Ramadan
            </p>
          </div>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-primary-gold opacity-30"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-cream text-sm text-primary-brown opacity-70">continue with</span>
            </div>
          </div>

          <div className="space-y-4 mt-4">
            <button
              onClick={() => signIn('google', { callbackUrl })}
              className="w-full flex justify-center items-center py-3 px-4 border border-primary-gold rounded-md shadow-md text-base font-medium text-white bg-primary-gold hover:bg-secondary-gold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-gold"
            >
              <Image 
                src="/google-icon.svg" 
                width={20} 
                height={20} 
                alt="Google"
                className="mr-2 bg-white rounded-full p-1"
              />
              Sign in with Google
            </button>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-sm text-primary-brown opacity-70">
            By signing in, you agree to our{' '}
            <a href="#" className="text-primary-gold hover:text-secondary-gold">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary-gold hover:text-secondary-gold">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-3 bg-primary-gold opacity-50"></div>
    </div>
  );
}

// Create a nice loading state with Ramadan theme
function LoadingState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-sand-lighter">
      <Moon className="h-12 w-12 text-primary-gold animate-pulse" />
      <h2 className="mt-4 text-xl font-medium text-primary-brown font-['Amiri']">
        Loading...
      </h2>
    </div>
  );
}

export default function SignIn() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SignInContent />
    </Suspense>
  );
}
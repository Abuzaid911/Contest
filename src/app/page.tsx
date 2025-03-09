// app/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import PostList from '@/components/PostList';
import DailyHadith from '@/components/DailyHadith';
import { Moon, Camera, Star, Trophy } from 'lucide-react';

export default async function Home() {
  const session = await getServerSession(authOptions);

  // Get today's date (midnight)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if the user has already posted today
  let hasPostedToday = false;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (user) {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const todayPost = await prisma.post.findFirst({
        where: {
          authorId: user.id,
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      });

      hasPostedToday = !!todayPost;
    }
  }

  return (
    <main className="container mx-auto px-4 py-10 md:py-12">
      {/* Header section */}
      <div className="text-center mb-10 md:mb-12">
        <div className="inline-flex items-center justify-center mb-4">
          <Moon className="h-9 w-9 md:h-10 md:w-10 text-primary-gold" />
          <h1 className="text-4xl md:text-5xl font-bold text-primary-brown mx-4 font-['Amiri'] tracking-wide">
            رمضان كريم
          </h1>
          <Star className="h-9 w-9 md:h-10 md:w-10 text-primary-gold" />
        </div>
        <p className="mt-4 text-primary-brown opacity-85 max-w-2xl mx-auto text-lg leading-relaxed font-['Amiri']">
          Join our Ramadan community by sharing your beautiful Iftar meals and discovering dishes from others.
          Vote for your favorites and celebrate the blessed month together with delicious food!
        </p>
      </div>
      
      {/* Daily Hadith */}
      <div className="mb-10">
        <DailyHadith />
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-5 mb-12">
        {session ? (
          hasPostedToday ? (
            <div className="bg-sand-light text-primary-brown px-6 py-4 rounded-md border border-primary-gold flex items-center shadow-sm">
              <Moon className="h-5 w-5 text-primary-gold mr-3" />
              <span className="font-medium">You've already shared your Iftar meal today!</span>
            </div>
          ) : (
            <Link
              href="/post"
              className="bg-primary-gold hover:bg-secondary-gold text-white px-8 py-4 rounded-md font-medium transition-colors shadow-md flex items-center text-lg"
            >
              <Camera className="h-5 w-5 mr-3" />
              Share Your Iftar Meal
            </Link>
          )
        ) : (
          <Link
            href="/api/auth/signin"
            className="bg-primary-gold hover:bg-secondary-gold text-white px-8 py-4 rounded-md font-medium transition-colors shadow-md text-lg"
          >
            Sign In to Participate
          </Link>
        )}
        
        <Link
          href="/winners"
          className="flex items-center text-primary-brown hover:text-primary-gold transition-colors px-7 py-3.5 rounded-md bg-cream hover:bg-sand-light border border-primary-gold border-opacity-30 shadow-sm font-medium"
        >
          <Trophy className="h-5 w-5 mr-2 text-primary-gold" />
          View Past Winners
        </Link>
      </div>

      {/* Today's meals section */}
      <div className="relative mb-8">
        <div className="absolute left-0 right-0 h-0.5 bg-primary-gold opacity-30"></div>
        <h2 className="relative inline-block bg-sand-lighter px-5 py-1 text-2xl md:text-3xl font-semibold text-primary-brown font-['Amiri']">
          Today's Iftar Meals
        </h2>
      </div>

      <Suspense fallback={
        <div className="flex justify-center items-center py-16">
          <div className="ramadan-spinner"></div>
          <span className="ml-3 text-lg text-primary-brown font-['Amiri']">Loading delicious meals...</span>
        </div>
      }>
        <PostList />
      </Suspense>
    </main>
  );
}
// app/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import PostList from '@/components/PostList';
import WinnerBanner from '@/components/WinnerBanner';
import { Moon, Camera, Star } from 'lucide-react';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  // Get today's date (midnight)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get yesterday's date (midnight)
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
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
  
  // Fetch yesterday's winner
  const winner = await prisma.post.findFirst({
    where: {
      date: {
        gte: yesterday,
        lt: today,
      },
      isWinner: true,
    },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });
  
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center">
          <div className="h-12 w-12 flex items-center justify-center">
            <Moon className="h-8 w-8 text-primary-gold" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary-brown mx-2 font-['Amiri']">
            Ramadan Iftar Contest
          </h1>
          <div className="h-12 w-12 flex items-center justify-center">
            <Star className="h-8 w-8 text-primary-gold" />
          </div>
        </div>
        <p className="mt-2 text-primary-brown opacity-80 max-w-2xl mx-auto">
          Share your delicious Iftar meals with the community and vote for your favorites. 
          Every day, one meal will be crowned as the winner!
        </p>
      </div>
      
      {winner && <WinnerBanner winner={winner} />}
      
      <div className="flex justify-center mb-8">
        {session ? (
          hasPostedToday ? (
            <div className="bg-sand-light text-primary-brown p-4 rounded-md border border-primary-gold flex items-center">
              <Moon className="h-5 w-5 text-primary-gold mr-2" />
              <span>You've already shared your Iftar meal today!</span>
            </div>
          ) : (
            <Link
              href="/post"
              className="bg-primary-gold hover:bg-secondary-gold text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md flex items-center"
            >
              <Camera className="h-5 w-5 mr-2" />
              Share Your Iftar Meal
            </Link>
          )
        ) : (
          <Link
            href="/api/auth/signin"
            className="bg-primary-gold hover:bg-secondary-gold text-white px-6 py-3 rounded-md font-medium transition-colors shadow-md"
          >
            Sign In to Participate
          </Link>
        )}
      </div>
      
      <div className="relative mb-6">
        <div className="absolute left-0 right-0 h-px bg-primary-gold opacity-30"></div>
        <h2 className="relative inline-block bg-sand-lighter px-4 text-2xl font-semibold text-primary-brown font-['Amiri']">
          Today's Iftar Meals
        </h2>
      </div>
      
      <Suspense fallback={
        <div className="flex justify-center items-center py-8">
          <div className="ramadan-spinner"></div>
          <span className="ml-3 text-primary-brown">Loading delicious meals...</span>
        </div>
      }>
        <PostList />
      </Suspense>
    </main>
  );
}
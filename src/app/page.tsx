// app/page.tsx
import { Suspense } from 'react';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import PostList from '@/components/PostList';
import WinnerBanner from '@/components/WinnerBanner';

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
      <h1 className="text-3xl font-bold text-center mb-6">
        Ramadan Iftar Contest
      </h1>
      
      {winner && <WinnerBanner winner={winner} />}
      
      <div className="flex justify-center mb-8">
        {session ? (
          hasPostedToday ? (
            <div className="bg-green-100 text-green-800 px-4 py-2 rounded-md">
              You've already shared your Iftar meal today!
            </div>
          ) : (
            <Link
              href="/post"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Share Your Iftar Meal
            </Link>
          )
        ) : (
          <Link
            href="/api/auth/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
          >
            Sign In to Participate
          </Link>
        )}
      </div>
      
      <h2 className="text-2xl font-semibold mb-4">Today's Iftar Meals</h2>
      
      <Suspense fallback={<div>Loading posts...</div>}>
        <PostList />
      </Suspense>
    </main>
  );
}
// app/admin/winners/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import Link from 'next/link';
import { Trophy } from 'lucide-react';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AdminWinnersClient from './AdminWinnersClient';

export default async function ManageWinnersPage() {
  // Check if user is authenticated and authorized
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    redirect('/api/auth/signin');
  }
  
  // Get all posts grouped by date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Get all dates from the past 7 days
  const dates = [];
  for (let i = 21; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  
  // Group posts by date
  const postsByDate: Record<string, any[]> = {};
  
  for (const date of dates) {
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const dateString = format(date, 'yyyy-MM-dd');
    
    const posts = await prisma.post.findMany({
      where: {
        date: {
          gte: date,
          lt: nextDay,
        },
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
      orderBy: {
        votes: {
          _count: 'desc',
        },
      },
    });
    
    if (posts.length > 0) {
      postsByDate[dateString] = posts;
    }
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-center mb-8">
        <Trophy className="h-8 w-8 text-primary-gold mr-3" />
        <h1 className="text-3xl font-bold text-center font-['Amiri'] text-primary-brown">
          Manage Daily Winners
        </h1>
      </div>
      
      <p className="text-center text-primary-brown opacity-80 max-w-2xl mx-auto mb-10">
        Select the winner for each day by clicking "Mark as Winner". The post with the most votes should automatically be selected.
      </p>
      
      <AdminWinnersClient postsByDate={postsByDate} />
      
      <div className="mt-8 text-center">
        <Link 
          href="/winners"
          className="inline-block bg-primary-gold hover:bg-secondary-gold text-white px-5 py-2 rounded-md transition-colors"
        >
          View Winners Page
        </Link>
      </div>
    </div>
  );
}
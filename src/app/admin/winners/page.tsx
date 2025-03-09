// app/admin/winners/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { format } from 'date-fns';
import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Star, Heart } from 'lucide-react';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

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
  for (let i = 7; i >= 0; i--) {
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
      
      {Object.keys(postsByDate).length === 0 ? (
        <div className="bg-sand-light p-8 rounded-lg text-center">
          <p className="text-primary-brown text-lg">No posts found for the past 7 days.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {Object.entries(postsByDate).map(([dateString, posts]) => (
            <div key={dateString} className="bg-cream rounded-lg shadow-md p-6 border border-primary-gold">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary-brown font-['Amiri']">
                  {format(new Date(dateString), 'EEEE, MMMM d, yyyy')}
                </h2>
                
                <form action={`/api/winner`} method="POST" className="inline">
                  <input type="hidden" name="date" value={dateString} />
                  <button 
                    type="submit"
                    className="bg-primary-gold hover:bg-secondary-gold text-white px-4 py-2 rounded-md text-sm"
                  >
                    Determine Winner
                  </button>
                </form>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className={`relative border rounded-md overflow-hidden ${
                      post.isWinner 
                        ? 'border-primary-gold bg-primary-gold bg-opacity-10' 
                        : 'border-gray-200'
                    }`}
                  >
                    {post.isWinner && (
                      <div className="absolute top-2 right-2 bg-primary-gold text-white text-sm font-bold py-1 px-3 rounded-full">
                        <Trophy className="h-4 w-4 inline-block mr-1" />
                        Winner
                      </div>
                    )}
                    
                    <div className="flex p-4">
                      <div className="w-24 h-24 relative flex-shrink-0">
                        <Image
                          src={post.imageUrl}
                          alt={post.title}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      
                      <div className="ml-4 flex-1">
                        <h3 className="font-semibold text-primary-brown">{post.title}</h3>
                        
                        <div className="flex items-center mt-1">
                          <div className="h-6 w-6 rounded-full overflow-hidden relative mr-2">
                            <Image
                              src={post.author.image || '/placeholder-avatar.png'}
                              alt={post.author.name || 'User'}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="text-sm text-primary-brown opacity-80">
                            {post.author.name || 'Anonymous'}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center text-primary-brown">
                            <Heart className="h-4 w-4 text-primary-gold mr-1" />
                            <span className="text-sm font-medium">{post._count.votes} votes</span>
                          </div>
                          
                          <form action={`/api/posts/${post.id}/mark-winner`} method="POST" className="inline">
                            <button 
                              type="submit"
                              className={`text-sm px-3 py-1 rounded-md ${
                                post.isWinner 
                                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                                  : 'bg-primary-gold hover:bg-secondary-gold text-white'
                              }`}
                            >
                              {post.isWinner ? 'Remove Winner' : 'Mark as Winner'}
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      
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
// app/winners/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trophy, Star, ArrowLeft, Heart, Calendar, Moon } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function WinnersPage() {
  // Fetch all posts with votes for the last 7 days (even if they're not marked as winners)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  // First try to get posts marked as winners for the last 7 days
  const winners = await prisma.post.findMany({
    where: {
      isWinner: true,
      date: {
        gte: sevenDaysAgo,
        lte: today,
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
      date: 'desc',
    },
  });
  
  // If no winners found, get top voted posts for each day
  let topPostsByDay: any[] = [];
  
  if (winners.length === 0) {
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(currentDate.getDate() - i);
      
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      const postsForDay = await prisma.post.findMany({
        where: {
          date: {
            gte: currentDate,
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
        take: 1, // Get only the top post
      });
      
      if (postsForDay.length > 0) {
        topPostsByDay.push({
          ...postsForDay[0],
          isTopVoted: true, // Mark as top voted but not officially winner
        });
      }
    }
  }
  
  // Use either the official winners or top voted posts
  const postsToShow = winners.length > 0 ? winners : topPostsByDay;
  
  if (postsToShow.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="ramadan-decoration-top mb-6"></div>
        
        <div className="flex items-center justify-center mb-8">
          <Moon className="h-8 w-8 text-primary-gold mr-3" />
          <h1 className="text-3xl font-bold text-center font-['Amiri'] text-primary-brown">
            رمضان كريم - Ramadan Iftar Champions
          </h1>
          <Star className="h-8 w-8 text-primary-gold ml-3" />
        </div>
        
        <div className="text-center py-16 bg-sand-light rounded-lg border-2 border-primary-gold border-opacity-30 shadow-md">
          <Trophy className="h-20 w-20 mx-auto text-primary-gold opacity-30 mb-6" />
          <h2 className="text-2xl font-semibold text-primary-brown mb-3 font-['Amiri']">No winners yet</h2>
          <p className="text-primary-brown opacity-70 max-w-md mx-auto">
            No posts have been found for the past week. Share your Iftar meals to participate
            in the daily contest!
          </p>
          
          <Link 
            href="/post" 
            className="mt-6 inline-block bg-primary-gold hover:bg-secondary-gold text-white px-6 py-3 rounded-md transition-colors shadow-md"
          >
            Share Your Iftar Meal
          </Link>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary-brown hover:text-primary-gold transition-colors bg-sand-light px-4 py-2 rounded-md shadow-sm border border-primary-gold border-opacity-30"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="ramadan-decoration-top mb-6"></div>
      
      <p className="text-center text-primary-brown opacity-80 max-w-2xl mx-auto mb-10 font-['Amiri'] text-xl">
        {winners.length > 0 
          ? "Celebrating the most delicious and beautifully presented Iftar meals from our community."
          : "Here are the most popular Iftar meals from the past week based on community votes."}
      </p>

      <div className="relative mb-10">
        <div className="absolute left-0 right-0 h-px bg-primary-gold opacity-30"></div>
        <div className="relative text-center">
          <span className="inline-block bg-sand-lighter px-4 text-lg font-semibold text-primary-brown">
            <Trophy className="h-5 w-5 inline-block mr-2 text-primary-gold" />
            <span className="font-['Amiri']">
              {winners.length > 0 ? "Daily Champions Gallery" : "Top Voted Meals"}
            </span>
            <Trophy className="h-5 w-5 inline-block ml-2 text-primary-gold" />
          </span>
        </div>
      </div>

      <div className="flex flex-col space-y-12">
        {postsToShow.map((post, index) => (
          <div key={post.id} className="relative">
            {/* Date indicator with crescent moon design */}
            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
              <div className="bg-white text-primary-gold font-bold py-2 px-6 rounded-full shadow-lg border-2 border-white inline-flex items-center">
                <Moon className="h-4 w-4 mr-1.5" />
                <span className="font-['Amiri']">
                  {format(new Date(post.date), "MMMM d")}
                </span>
              </div>
            </div>
            
            <div className={`bg-cream rounded-lg shadow-lg overflow-hidden border-2 ${post.isWinner || post.isTopVoted ? "border-primary-gold" : "border-gray-300"} transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
              index === 0 ? "bg-gradient-to-r from-sand-light to-sunset-orange" : ""
            }`}>
              <div className="md:flex">
                <div className="md:w-2/5 relative h-72">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority={index === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20"></div>
                  <div className="absolute top-4 right-4 bg-primary-gold text-white font-bold py-1.5 px-4 rounded-full flex items-center shadow-md border-2 border-white">
                    <Trophy className="h-5 w-5 mr-1.5" />
                    {post.isWinner ? "Winner!" : "Top Voted"}
                  </div>
                </div>
                
                <div className="p-6 md:p-8 md:w-3/5">
                  
                  <h3 className="text-2xl font-bold mb-4 text-primary-brown font-['Amiri']">{post.title}</h3>
                  
                  {post.description && (
                    <p className="text-primary-brown opacity-80 mb-6">{post.description}</p>
                  )}
                  
                  <div className="flex items-center mb-6">
                    <div className="h-12 w-12 rounded-full overflow-hidden relative mr-3 border-2 border-primary-gold shadow-sm">
                      <Image
                        src={post.author.image || '/placeholder-avatar.png'}
                        alt={post.author.name || 'User'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <span className="font-medium text-primary-brown">
                        {post.author.name || 'Anonymous'}
                      </span>
                      <p className="text-sm text-primary-brown opacity-60">
                        {post.isWinner ? "Daily Champion Chef" : "Most Popular Chef"}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-primary-gold border-opacity-20">
                    <span className="flex items-center text-primary-brown">
                      <Heart className="h-5 w-5 text-primary-gold fill-current mr-2" />
                      <strong>{post._count.votes}</strong>
                      <span className="ml-1 opacity-80">
                        {post._count.votes === 1 ? 'vote' : 'votes'}
                      </span>
                    </span>
                    
                    <Link
                      href={`/posts/${post.id}`}
                      className="bg-primary-gold hover:bg-secondary-gold text-white px-5 py-2 rounded-md transition-colors shadow-md flex items-center"
                    >
                      <span>View Details</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 ml-2">
                        <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h6.638L10.23 7.29a.75.75 0 111.04-1.08l3.5 3.25a.75.75 0 010 1.08l-3.5 3.25a.75.75 0 11-1.04-1.08l2.158-1.96H5.75A.75.75 0 015 10z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-white bg-primary-gold hover:bg-secondary-gold transition-colors px-6 py-3 rounded-md shadow-md"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to today's Iftar meals
        </Link>
      </div>
    </div>
  );
}
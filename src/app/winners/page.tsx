// app/winners/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trophy, Star, ArrowLeft, Heart } from 'lucide-react';
import prisma from '@/lib/prisma';

export default async function WinnersPage() {
  // Fetch all winners
  const winners = await prisma.post.findMany({
    where: {
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
    orderBy: {
      date: 'desc',
    },
  });

  if (winners.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-center mb-8">
          <Trophy className="h-8 w-8 text-primary-gold mr-3" />
          <h1 className="text-3xl font-bold text-center font-display text-primary-brown">
            Past Iftar Contest Winners
          </h1>
          <Trophy className="h-8 w-8 text-primary-gold ml-3" />
        </div>
        
        <div className="text-center py-16 bg-sand-light rounded-lg border-2 border-primary-gold border-opacity-30 shadow-md">
          <Trophy className="h-20 w-20 mx-auto text-primary-gold opacity-30 mb-6" />
          <h2 className="text-2xl font-semibold text-primary-brown mb-3 font-display">No winners yet</h2>
          <p className="text-primary-brown opacity-70 max-w-md mx-auto">
            Winners will be displayed here at the end of each day of Ramadan.
            Check back soon to see the delicious winning Iftar meals!
          </p>
        </div>
        
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-primary-brown hover:text-primary-gold transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to all Iftar meals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-center mb-10">
        <Star className="h-6 w-6 text-primary-gold mr-3" />
        <h1 className="text-3xl md:text-4xl font-bold text-center font-display text-primary-brown">
          Ramadan Iftar Champions
        </h1>
        <Star className="h-6 w-6 text-primary-gold ml-3" />
      </div>
      
      <p className="text-center text-primary-brown opacity-80 max-w-2xl mx-auto mb-10 text-lg">
        Celebrating the most delicious and beautifully presented Iftar meals from our community.
        Each day during Ramadan, one special dish is crowned as the winner.
      </p>

      <div className="grid grid-cols-1 gap-10">
        {winners.map((winner) => (
          <div
            key={winner.id}
            className="bg-cream rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row border border-primary-gold"
          >
            <div className="md:w-2/5 relative h-72 md:h-auto">
              <Image
                src={winner.imageUrl}
                alt={winner.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-20" />
              <div className="absolute top-4 right-4 bg-primary-gold text-white font-bold py-1.5 px-4 rounded-full flex items-center shadow-md border-2 border-white">
                <Trophy className="h-5 w-5 mr-1.5" />
                Winner!
              </div>
            </div>
            
            <div className="p-6 md:p-8 md:w-3/5">
              <div className="flex items-center mb-3">
                <Trophy className="h-6 w-6 text-primary-gold mr-2" />
                <h2 className="text-xl font-semibold text-primary-brown font-display">
                  {format(new Date(winner.date), "MMMM d, yyyy")}
                </h2>
              </div>
              
              <h3 className="text-2xl font-bold mb-4 text-primary-brown font-display">{winner.title}</h3>
              
              {winner.description && (
                <p className="text-primary-brown opacity-80 mb-6">{winner.description}</p>
              )}
              
              <div className="flex items-center mb-6">
                <div className="h-12 w-12 rounded-full overflow-hidden relative mr-3 border-2 border-primary-gold shadow-sm">
                  <Image
                    src={winner.author.image || '/placeholder-avatar.png'}
                    alt={winner.author.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <span className="font-medium text-primary-brown">
                    {winner.author.name || 'Anonymous'}
                  </span>
                  <p className="text-sm text-primary-brown opacity-60">Master Chef</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-primary-gold border-opacity-20">
                <span className="flex items-center text-primary-brown">
                  <Heart className="h-5 w-5 text-primary-gold fill-current mr-2" />
                  <strong>{winner._count.votes}</strong>
                  <span className="ml-1 opacity-80">
                    {winner._count.votes === 1 ? 'vote' : 'votes'}
                  </span>
                </span>
                
                <Link
                  href={`/posts/${winner.id}`}
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
        ))}
      </div>
      
      <div className="mt-10 text-center">
        <Link 
          href="/" 
          className="inline-flex items-center text-primary-brown hover:text-primary-gold transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to today's Iftar meals
        </Link>
      </div>
    </div>
  );
}
// app/winners/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Trophy } from 'lucide-react';
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
        <h1 className="text-3xl font-bold text-center mb-8">
          Past Iftar Contest Winners
        </h1>
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Trophy className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No winners yet</h2>
          <p className="text-gray-500">
            Winners will be displayed here at the end of each day of Ramadan.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Past Iftar Contest Winners
      </h1>

      <div className="grid grid-cols-1 gap-8 md:gap-12">
        {winners.map((winner) => (
          <div
            key={winner.id}
            className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row"
          >
            <div className="md:w-1/3 relative h-64 md:h-auto">
              <Image
                src={winner.imageUrl}
                alt={winner.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold py-1 px-3 rounded-full">
                Winner!
              </div>
            </div>
            <div className="p-6 md:w-2/3">
              <div className="flex items-center mb-2">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
                <h2 className="text-xl font-semibold">
                  {format(new Date(winner.date), "MMMM d, yyyy")}
                </h2>
              </div>
              <h3 className="text-2xl font-bold mb-3">{winner.title}</h3>
              {winner.description && (
                <p className="text-gray-700 mb-4">{winner.description}</p>
              )}
              <div className="flex items-center mb-4">
                <div className="h-10 w-10 rounded-full overflow-hidden relative mr-2">
                  <Image
                    src={winner.author.image || '/placeholder-avatar.png'}
                    alt={winner.author.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-medium">
                  {winner.author.name || 'Anonymous'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  <strong>{winner._count.votes}</strong>{' '}
                  {winner._count.votes === 1 ? 'vote' : 'votes'}
                </span>
                <Link
                  href={`/posts/${winner.id}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
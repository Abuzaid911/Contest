// components/WinnerBanner.tsx
"use client";
import Image from 'next/image';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

interface WinnerBannerProps {
  winner: {
    id: string;
    title: string;
    imageUrl: string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    _count: {
      votes: number;
    };
  };
}

export default function WinnerBanner({ winner }: WinnerBannerProps) {
  return (
    <div className="mb-8 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg overflow-hidden shadow-md">
      <div className="p-4 sm:p-6">
        <div className="flex items-center mb-4">
          <Trophy className="h-8 w-8 text-yellow-500 mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold">Yesterday's Winner</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-64 w-full sm:w-1/3 mb-4 sm:mb-0 sm:mr-6">
            <Image
              src={winner.imageUrl}
              alt={winner.title}
              fill
              className="object-cover rounded-md"
            />
          </div>
          
          <div className="sm:w-2/3">
            <h3 className="text-lg sm:text-xl font-semibold mb-2">{winner.title}</h3>
            
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full overflow-hidden relative mr-2">
                <Image
                  src={winner.author.image || '/placeholder-avatar.png'}
                  alt={winner.author.name || 'User'}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium">{winner.author.name || 'Anonymous'}</span>
            </div>
            
            <div className="mb-4">
              <span className="text-gray-700">
                <strong>{winner._count.votes}</strong> {winner._count.votes === 1 ? 'vote' : 'votes'}
              </span>
            </div>
            
            <Link 
              href={`/posts/${winner.id}`}
              className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
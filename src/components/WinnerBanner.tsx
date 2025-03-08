'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trophy, Star, Award } from 'lucide-react';

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
    <div className="mb-8 bg-gradient-to-r from-sand-light to-sunset-orange rounded-lg overflow-hidden shadow-md border-2 border-primary-gold relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-primary-gold"></div>
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary-gold text-white px-6 py-1 rounded-b-lg shadow-md font-['Amiri'] font-bold">
        <Star className="inline-block h-4 w-4 mr-1 mb-0.5" />
        WINNER
        <Star className="inline-block h-4 w-4 ml-1 mb-0.5" />
      </div>
      
      <div className="p-4 sm:p-6 pt-8">
        <div className="flex items-center mb-4">
          <Trophy className="h-8 w-8 text-primary-gold mr-2" />
          <h2 className="text-xl sm:text-2xl font-bold text-primary-brown font-['Amiri']">Yesterday's Winner</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row">
          <div className="relative h-48 sm:h-64 w-full sm:w-1/3 mb-4 sm:mb-0 sm:mr-6">
            <Image
              src={winner.imageUrl}
              alt={winner.title}
              fill
              className="object-cover rounded-md border-2 border-primary-gold shadow-md"
            />
            <div className="absolute -bottom-3 -right-3 bg-primary-gold rounded-full p-2 shadow-md border-2 border-white">
              <Award className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div className="sm:w-2/3">
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-primary-brown font-['Amiri']">{winner.title}</h3>
            
            <div className="flex items-center mb-4">
              <div className="h-10 w-10 rounded-full overflow-hidden relative mr-2 border-2 border-primary-gold">
                <Image
                  src={winner.author.image || '/placeholder-avatar.png'}
                  alt={winner.author.name || 'User'}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-primary-brown">{winner.author.name || 'Anonymous'}</span>
            </div>
            
            <div className="mb-4 p-3 bg-white bg-opacity-50 rounded-md border border-primary-gold border-opacity-30">
              <span className="text-primary-brown flex items-center">
                <Trophy className="h-5 w-5 text-primary-gold mr-2" />
                <strong className="text-primary-gold">{winner._count.votes}</strong>
                <span className="ml-1">{winner._count.votes === 1 ? 'vote' : 'votes'}</span>
              </span>
            </div>
            
            <Link 
              href={`/posts/${winner.id}`}
              className="inline-block bg-primary-gold hover:bg-secondary-gold text-white px-4 py-2 rounded-md transition-colors shadow-md"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
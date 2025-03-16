'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Trophy, Star, Heart } from 'lucide-react';

// Types for TypeScript
interface Author {
  id: string;
  name: string | null;
  image: string | null;
}

interface Post {
  id: string;
  title: string;
  imageUrl: string;
  author: Author;
  isWinner: boolean;
  _count: {
    votes: number;
  };
}

interface PostsByDateProps {
  postsByDate: Record<string, Post[]>;
}

export default function AdminWinnersClient({ postsByDate }: PostsByDateProps) {
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [winners, setWinners] = useState<Record<string, string>>({});

  // Initialize winners on component mount
  useEffect(() => {
    const initialWinners: Record<string, string> = {};
    
    // Find all current winners and store them
    Object.entries(postsByDate).forEach(([dateString, posts]) => {
      const winner = posts.find(post => post.isWinner);
      if (winner) {
        initialWinners[dateString] = winner.id;
      }
    });
    
    setWinners(initialWinners);
  }, [postsByDate]);

  const handleMarkWinner = async (postId: string, dateString: string) => {
    // Set loading state for this specific button
    setLoading(prev => ({ ...prev, [postId]: true }));
    
    try {
      const response = await fetch(`/api/posts/${postId}/mark-winner`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send empty JSON object, not form data
        body: JSON.stringify({}),
      });
      
      if (response.ok) {
        // Update local state to reflect the change
        if (winners[dateString] === postId) {
          // If this was the winner, remove it
          const newWinners = { ...winners };
          delete newWinners[dateString];
          setWinners(newWinners);
        } else {
          // Mark this as the winner
          setWinners(prev => ({ ...prev, [dateString]: postId }));
        }
      } else {
        const data = await response.json();
        console.error('Error marking winner:', data.error);
        alert('Failed to update winner status. Please try again.');
      }
    } catch (error) {
      console.error('Error marking winner:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      // Clear loading state
      setLoading(prev => ({ ...prev, [postId]: false }));
    }
  };

  const handleDetermineWinner = async (dateString: string) => {
    // Set loading state for this specific date
    setLoading(prev => ({ ...prev, [`date-${dateString}`]: true }));
    
    try {
      const response = await fetch('/api/winner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Send JSON data, not form data
        body: JSON.stringify({ date: dateString }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.winner) {
          // Update local state to reflect the change
          setWinners(prev => ({ ...prev, [dateString]: data.winner.id }));
        }
      } else {
        const data = await response.json();
        console.error('Error determining winner:', data.error);
        alert('Failed to determine winner. Please try again.');
      }
    } catch (error) {
      console.error('Error determining winner:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      // Clear loading state
      setLoading(prev => ({ ...prev, [`date-${dateString}`]: false }));
    }
  };

  if (Object.keys(postsByDate).length === 0) {
    return (
      <div className="bg-sand-light p-8 rounded-lg text-center">
        <p className="text-primary-brown text-lg">No posts found for the past 7 days.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {Object.entries(postsByDate).map(([dateString, posts]) => (
        <div key={dateString} className="bg-cream rounded-lg shadow-md p-6 border border-primary-gold">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-primary-brown font-['Amiri']">
              {format(new Date(dateString), 'EEEE, MMMM d, yyyy')}
            </h2>
            
            <button 
              onClick={() => handleDetermineWinner(dateString)}
              disabled={loading[`date-${dateString}`]}
              className="bg-primary-gold hover:bg-secondary-gold text-white px-4 py-2 rounded-md text-sm disabled:opacity-50"
            >
              {loading[`date-${dateString}`] ? 'Processing...' : 'Determine Winner'}
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map((post) => {
              const isWinner = winners[dateString] === post.id;
              
              return (
                <div 
                  key={post.id} 
                  className={`relative border rounded-md overflow-hidden ${
                    isWinner 
                      ? 'border-primary-gold bg-primary-gold bg-opacity-10' 
                      : 'border-gray-200'
                  }`}
                >
                  {isWinner && (
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
                        width={96}
                        height={96}
                        className="object-cover rounded-md absolute inset-0"
                      />
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-primary-brown">{post.title}</h3>
                      
                      <div className="flex items-center mt-1">
                        <div className="h-6 w-6 rounded-full overflow-hidden relative mr-2">
                          <Image
                            src={post.author.image || '/placeholder-avatar.png'}
                            alt={post.author.name || 'User'}
                            width={24}
                            height={24}
                            className="object-cover absolute inset-0"
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
                        
                        <button 
                          onClick={() => handleMarkWinner(post.id, dateString)}
                          disabled={loading[post.id]}
                          className={`text-sm px-3 py-1 rounded-md ${
                            isWinner 
                              ? 'bg-red-500 hover:bg-red-600 text-white' 
                              : 'bg-primary-gold hover:bg-secondary-gold text-white'
                          } disabled:opacity-50`}
                        >
                          {loading[post.id] ? 'Processing...' : isWinner ? 'Remove Winner' : 'Mark as Winner'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
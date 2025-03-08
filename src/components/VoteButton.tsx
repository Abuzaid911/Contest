'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

interface VoteButtonProps {
  postId: string;
  initialVoted: boolean;
  initialVotes: number;
}

export default function VoteButton({
  postId,
  initialVoted,
  initialVotes,
}: VoteButtonProps) {
  const [voted, setVoted] = useState(initialVoted);
  const [votes, setVotes] = useState(initialVotes);
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/posts/${postId}/vote`, {
        method: 'POST',
      });

      if (response.ok) {
        // Toggle vote state
        setVoted(!voted);
        setVotes(voted ? votes - 1 : votes + 1);
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleVote}
      disabled={isLoading}
      className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all ${
        voted
          ? 'bg-primary-gold bg-opacity-20 text-primary-gold'
          : 'bg-sand-light text-primary-brown hover:bg-primary-gold hover:bg-opacity-20 hover:text-primary-gold'
      } disabled:opacity-50 border ${voted ? 'border-primary-gold' : 'border-transparent hover:border-primary-gold'}`}
    >
      {isLoading ? (
        <div className="ramadan-spinner h-5 w-5 border-2 border-primary-gold border-l-transparent"></div>
      ) : (
        <Heart className={voted ? 'fill-current' : ''} size={20} />
      )}
      <span>{votes}</span>
    </button>
  );
}
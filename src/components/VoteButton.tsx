// components/VoteButton.tsx
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
      className={`flex items-center gap-1 px-4 py-2 rounded-full transition-colors ${
        voted
          ? 'bg-red-100 text-red-500'
          : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
      } disabled:opacity-50`}
    >
      <Heart className={voted ? 'fill-current' : ''} size={20} />
      <span>{votes}</span>
    </button>
  );
}
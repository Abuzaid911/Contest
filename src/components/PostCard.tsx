'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Heart, Trash2, Award } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    createdAt: string;
    isWinner: boolean;
    authorId: string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
      email: string;
    };
    _count: {
      votes: number;
    };
  };
  hasVoted: boolean;
  onVote: () => void;
  onDelete?: () => void;
}

export default function PostCard({ post, hasVoted, onVote, onDelete }: PostCardProps) {
  const { data: session, status } = useSession();
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [votes, setVotes] = useState(post._count.votes);
  const [voted, setVoted] = useState(hasVoted);
  const [isOwner, setIsOwner] = useState(false);
  
  // Check if the current user is the post owner
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      console.log('Session user:', session.user);
      console.log('Post author:', post.author);
      console.log('Post authorId:', post.authorId);
      
      // Try to determine if the logged-in user is the post author
      let currentUserIsOwner = false;
      
      // Check by email (most reliable)
      if (session.user.email && session.user.email === post.author.email) {
        currentUserIsOwner = true;
      }
      
      // Check by IDs if available
      if (session.user.id && session.user.id === post.authorId) {
        currentUserIsOwner = true;
      }
      
      // Special case for NextAuth with OAuth providers
      // @ts-ignore - for sub which might not be in the type
      if (session.user.sub && session.user.sub === post.authorId) {
        currentUserIsOwner = true;
      }
      
      console.log('Is owner detected?', currentUserIsOwner);
      setIsOwner(currentUserIsOwner);
    } else {
      setIsOwner(false);
    }
  }, [status, session, post]);
  
  const handleVote = async () => {
    if (!session || isOwner) return;
    if (isVoting) return;

    setIsVoting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/vote`, {
        method: 'POST',
      });

      if (response.ok) {
        setVoted(!voted);
        setVotes(voted ? votes - 1 : votes + 1);
        onVote();
      }
    } catch (error) {
      console.error('Failed to vote:', error);
    } finally {
      setIsVoting(false);
    }
  };

  const handleDelete = async () => {
    if (!session || !isOwner || isDeleting) return;

    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/delete`, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (onDelete) onDelete();
      } else {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-cream rounded-lg shadow-md overflow-hidden border border-primary-gold post-card">
      <div className="relative h-64 w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
        />
        {post.isWinner && (
          <div className="absolute top-2 right-2 bg-primary-gold text-white font-bold py-1 px-3 rounded-full flex items-center shadow-md border-2 border-white">
            <Award className="h-5 w-5 mr-1" />
            Winner!
          </div>
        )}
        
        {/* Delete button overlay - visible only for post owner */}
        {isOwner && (
          <div className="absolute top-2 left-2 z-10">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md transition-colors flex items-center justify-center"
              title="Delete this post"
            >
              <Trash2 size={20} />
            </button>
          </div>
        )}
      </div>
      
      <div className="p-4">
        {/* Owner indicator - "Your Post" banner */}
        {isOwner && (
          <div className="mb-2 -mt-1 bg-primary-brown bg-opacity-10 py-1 px-2 rounded text-xs text-primary-brown font-medium inline-block">
            Your Post
          </div>
        )}
        
        <div className="flex items-center mb-2">
          <div className="h-10 w-10 rounded-full overflow-hidden relative mr-2 border-2 border-primary-gold">
            <Image
              src={post.author.image || '/placeholder-avatar.png'}
              alt={post.author.name || 'User'}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-primary-brown">{post.author.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        
        <Link href={`/posts/${post.id}`} className="block hover:opacity-80 transition-opacity">
          <h3 className="text-xl font-semibold mb-2 text-primary-brown font-['Amiri']">{post.title}</h3>
          {post.description && (
            <p className="text-primary-brown opacity-80 mb-4 line-clamp-2">{post.description}</p>
          )}
        </Link>
        
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-primary-gold border-opacity-20">
          <button
            onClick={handleVote}
            disabled={!session || isVoting || isOwner}
            className={`flex items-center gap-1 p-2 px-3 rounded-full ${
              voted 
                ? 'bg-primary-gold bg-opacity-20 text-primary-gold' 
                : 'bg-sand-light text-primary-brown hover:bg-primary-gold hover:bg-opacity-20 hover:text-primary-gold'
            } disabled:opacity-50 ${isOwner ? 'cursor-not-allowed' : ''}`}
            title={isOwner ? "You cannot vote on your own post" : (!session ? "Sign in to vote" : "Vote for this meal")}
          >
            <Heart className={voted ? 'fill-current' : ''} size={20} />
            <span>{votes}</span>
          </button>
          
          <Link 
            href={`/posts/${post.id}`}
            className="text-primary-gold hover:text-secondary-gold transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
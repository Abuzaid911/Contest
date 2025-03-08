// components/PostCard.tsx
import { useState } from 'react';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string;
    createdAt: string;
    isWinner: boolean;
    author: {
      id: string;
      name: string | null;
      image: string | null;
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
  const { data: session } = useSession();
  const [isVoting, setIsVoting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [votes, setVotes] = useState(post._count.votes);
  const [voted, setVoted] = useState(hasVoted);

  const isOwnPost = session?.user?.email === post.author.email;

  const handleVote = async () => {
    if (!session || isOwnPost) return;
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
    if (!session || !isOwnPost || isDeleting) return;

    if (!confirm('Are you sure you want to delete this post?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/posts/${post.id}/delete`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onDelete?.();
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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-64 w-full">
        <Image
          src={post.imageUrl}
          alt={post.title}
          fill
          className="object-cover"
        />
        {post.isWinner && (
          <div className="absolute top-2 right-2 bg-yellow-400 text-black font-bold py-1 px-3 rounded-full">
            Winner!
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center mb-2">
          <div className="h-10 w-10 rounded-full overflow-hidden relative mr-2">
            <Image
              src={post.author.image || '/placeholder-avatar.png'}
              alt={post.author.name || 'User'}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="font-medium">{post.author.name || 'Anonymous'}</p>
            <p className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">{post.title}</h3>
        {post.description && (
          <p className="text-gray-700 mb-4">{post.description}</p>
        )}
        <div className="flex items-center justify-between">
          {session && isOwnPost ? (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Post'}
            </button>
          ) : (
            <button
              onClick={handleVote}
              disabled={!session || isVoting || isOwnPost}
              className={`flex items-center gap-1 p-2 rounded-full ${voted ? 'text-red-500' : 'text-gray-500 hover:text-red-500'} transition-colors disabled:opacity-50`}
            >
              <Heart className={voted ? 'fill-current' : ''} size={20} />
              <span>{votes}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
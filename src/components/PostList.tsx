// components/PostList.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PostCard from './PostCard';

interface Post {
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
}

export default function PostList() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserVotes = async () => {
      if (!session?.user) return;
      
      try {
        const response = await fetch('/api/user/votes');
        if (!response.ok) {
          throw new Error('Failed to fetch user votes');
        }
        const data = await response.json();
        setUserVotes(new Set(data.map((vote: { postId: string }) => vote.postId)));
      } catch (err) {
        console.error('Failed to fetch user votes:', err);
      }
    };

    fetchPosts();
    if (session) {
      fetchUserVotes();
    }
  }, [session]);

  const handleVote = () => {
    // Refetch posts to update vote counts
    fetch('/api/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error('Failed to refresh posts:', err));
  };

  if (loading) {
    return <div className="text-center py-8">Loading posts...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">No Iftar meals shared yet today.</p>
        <p className="text-gray-500 mt-2">Be the first to share your meal!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          hasVoted={userVotes.has(post.id)}
          onVote={handleVote}
        />
      ))}
    </div>
  );
}
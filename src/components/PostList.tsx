'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import PostCard from './PostCard';
import { Moon, Calendar } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import { format } from 'date-fns';

interface Post {
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
}

export default function PostList() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [userVotes, setUserVotes] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/posts?date=${selectedDate}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      
      const data = await response.json();
      console.log('Fetched posts:', data);
      setPosts(data);
      setError('');
    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Failed to load posts. Please try again later.');
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

  useEffect(() => {
    fetchPosts();
  }, [selectedDate]);

  useEffect(() => {
    if (session) {
      fetchUserVotes();
    }
  }, [session]);

  const handleVote = () => {
    // Refetch both posts and votes to ensure everything is up-to-date
    fetchPosts();
    fetchUserVotes();
  };

  const handleDelete = (postId: string) => {
    setPosts(currentPosts => currentPosts.filter(post => post.id !== postId));
  };

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="ramadan-spinner mr-3"></div>
        <span className="text-primary-brown">Loading meals...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8 bg-red-50 rounded-lg border border-red-200">
        <p>{error}</p>
        <button 
          onClick={fetchPosts}
          className="mt-4 px-4 py-2 bg-primary-gold text-white rounded-md hover:bg-secondary-gold transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <CountdownTimer />
      </div>
      
      <div className="mb-6 flex items-center justify-between bg-sand-light p-4 rounded-lg border border-primary-gold border-opacity-30">
        <div className="flex items-center gap-2">
          <Calendar className="text-primary-gold" size={20} />
          <span className="text-primary-brown font-medium">Select Date:</span>
        </div>
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="px-3 py-2 rounded-md border border-primary-gold border-opacity-30 bg-white focus:outline-none focus:ring-2 focus:ring-primary-gold focus:border-primary-gold text-primary-brown"
          max={format(new Date(), 'yyyy-MM-dd')}
        />
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-sand-light rounded-lg border border-primary-gold border-opacity-50">
          <Moon className="h-12 w-12 text-primary-gold mx-auto mb-4 opacity-50" />
          <p className="text-primary-brown text-lg font-['Amiri']">No Iftar meals found for {format(new Date(selectedDate), 'MMMM d, yyyy')}.</p>
          {selectedDate === format(new Date(), 'yyyy-MM-dd') && (
            <p className="text-primary-brown opacity-70 mt-2">Be the first to share your meal!</p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              hasVoted={userVotes.has(post.id)}
              onVote={handleVote}
              onDelete={() => handleDelete(post.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
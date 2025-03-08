// app/posts/[id]/page.tsx
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { formatDistanceToNow, format } from 'date-fns';
import { ChevronLeft, Heart, Award } from 'lucide-react';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import VoteButton from '@/components/VoteButton';

interface PostDetailProps {
  params: {
    id: string;
  };
}

export default async function PostDetail({ params }: PostDetailProps) {
  const { id } = params;
  const session = await getServerSession(authOptions);
  
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
      _count: {
        select: {
          votes: true,
        },
      },
    },
  });
  
  if (!post) {
    notFound();
  }
  
  // Check if current user has voted for this post
  let hasVoted = false;
  if (session?.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    
    if (user) {
      const vote = await prisma.vote.findFirst({
        where: {
          postId: id,
          userId: user.id,
        },
      });
      
      hasVoted = !!vote;
    }
  }
  
  // Get all voters for this post
  const voters = await prisma.vote.findMany({
    where: {
      postId: id,
    },
    select: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  
  const postDate = new Date(post.date);
  
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to all posts
      </Link>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={post.imageUrl}
            alt={post.title}
            fill
            className="object-cover"
          />
          {post.isWinner && (
            <div className="absolute top-4 right-4 bg-yellow-400 text-black font-bold py-2 px-4 rounded-full flex items-center">
              <Award className="h-5 w-5 mr-1" />
              Winner!
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="h-12 w-12 rounded-full overflow-hidden relative mr-3">
              <Image
                src={post.author.image || '/placeholder-avatar.png'}
                alt={post.author.name || 'User'}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-medium text-lg">{post.author.name || 'Anonymous'}</p>
              <p className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
          
          {post.description && (
            <p className="text-gray-700 mb-6">{post.description}</p>
          )}
          
          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-gray-600">
              Posted for {format(postDate, 'MMMM d, yyyy')}
            </p>
            
            <div className="flex items-center">
              {session ? (
                <VoteButton
                  postId={post.id}
                  initialVoted={hasVoted}
                  initialVotes={post._count.votes}
                />
              ) : (
                <div className="flex items-center gap-1 text-gray-500">
                  <Heart className="h-5 w-5" />
                  <span>{post._count.votes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {post._count.votes > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            {post._count.votes} {post._count.votes === 1 ? 'Person' : 'People'} Voted for This Meal
          </h2>
          
          <div className="flex flex-wrap gap-3">
            {voters.map((voter) => (
              <div key={voter.user.id} className="flex items-center bg-gray-100 rounded-full px-3 py-1">
                <div className="h-6 w-6 rounded-full overflow-hidden relative mr-2">
                  <Image
                    src={voter.user.image || '/placeholder-avatar.png'}
                    alt={voter.user.name || 'User'}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm">{voter.user.name || 'Anonymous'}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
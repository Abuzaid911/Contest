// app/profile/page.tsx
import { redirect } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { format } from 'date-fns';
import prisma from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect('/api/auth/signin');
  }
  
  const user = await prisma.user.findUnique({
    where: {
      email: session.user?.email as string,
    },
    include: {
      posts: {
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          _count: {
            select: {
              votes: true,
            },
          },
        },
      },
    },
  });
  
  if (!user) {
    redirect('/');
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Your Profile</h1>
      
      <div className="bg-sand-light rounded-lg shadow-md p-6 mb-8 border border-primary-gold">
        <div className="flex items-center">
          <div className="h-20 w-20 rounded-full overflow-hidden relative mr-6 border-2 border-primary-gold">
            <Image
              src={user.image || '/placeholder-avatar.png'}
              alt={user.name || 'User'}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-primary-brown">{user.name || 'Anonymous'}</h2>
            <p className="text-primary-brown opacity-80">{user.email}</p>
            <p className="text-primary-brown opacity-60 text-sm mt-1">
              Member since {format(new Date(user.createdAt), 'MMMM yyyy')}
            </p>
          </div>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">Your Iftar Submissions</h2>
      
      {user.posts.length === 0 ? (
        <div className="bg-sand-light rounded-lg p-8 text-center border border-primary-gold">
          <h3 className="text-lg font-medium text-primary-brown mb-2">
            You haven't shared any Iftar meals yet
          </h3>
          <p className="text-primary-brown opacity-70 mb-4">
            Share your delicious Iftar meals and participate in the daily contest.
          </p>
          <Link
            href="/post"
            className="inline-block bg-primary-gold hover:bg-secondary-gold text-white px-4 py-2 rounded-md transition-colors"
          >
            Share Your Iftar Meal
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {user.posts.map((post) => (
            <div key={post.id} className="bg-sand-light rounded-lg shadow-md overflow-hidden border border-primary-gold">
              <div className="relative h-48 w-full">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                {post.isWinner && (
                  <div className="absolute top-2 right-2 bg-primary-gold text-white font-bold py-1 px-3 rounded-full">
                    Winner!
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-primary-brown">{post.title}</h3>
                <p className="text-primary-brown opacity-60 text-sm mb-3">
                  Posted on {format(new Date(post.createdAt), 'PP')}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-primary-brown">
                    <strong>{post._count.votes}</strong>{' '}
                    {post._count.votes === 1 ? 'vote' : 'votes'}
                  </span>
                  <Link
                    href={`/posts/${post.id}`}
                    className="text-primary-gold hover:text-secondary-gold transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
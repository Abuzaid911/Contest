// app/post/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import PostForm from '@/components/PostForm';

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions);
  
  // Redirect if not logged in
  if (!session) {
    redirect('/api/auth/signin');
  }
  
  // Check if user has already posted today
  if (session.user?.email) {
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    
    if (user) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const todayPost = await prisma.post.findFirst({
        where: {
          authorId: user.id,
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      });
      
      if (todayPost) {
        // User has already posted today, redirect to home
        redirect('/');
      }
    }
  }
  
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Share Your Iftar Meal</h1>
      <PostForm />
    </div>
  );
}
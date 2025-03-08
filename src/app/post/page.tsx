// app/post/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import PostForm from '@/components/PostForm';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function PostPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/api/auth/signin');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Share Your Iftar Meal</h1>
      <PostForm />
    </div>
  );
}
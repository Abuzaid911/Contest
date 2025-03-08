// app/api/posts/[id]/vote/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Vote for a post
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const postId = params.id;
    
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if the post exists
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Prevent users from voting on their own posts
    if (post.authorId === user.id) {
      return NextResponse.json({ error: "Cannot vote on your own post" }, { status: 403 });
    }
    
    // Check if user already voted for this post
    const existingVote = await prisma.vote.findFirst({
      where: {
        userId: user.id,
        postId,
      },
    });
    
    if (existingVote) {
      // Remove vote if it already exists (toggle behavior)
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });
      
      return NextResponse.json({ message: "Vote removed" });
    }
    
    // Create a new vote
    const vote = await prisma.vote.create({
      data: {
        userId: user.id,
        postId,
      },
    });
    
    return NextResponse.json(vote);
  } catch (error) {
    return NextResponse.json({ error: "Failed to vote" }, { status: 500 });
  }
}

// Get votes for a post
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const postId = params.id;
    
    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }
    
    const votes = await prisma.vote.count({
      where: {
        postId,
      },
    });
    
    return NextResponse.json({ votes });
  } catch (error) {
    return NextResponse.json({ error: "Failed to get votes" }, { status: 500 });
  }
}
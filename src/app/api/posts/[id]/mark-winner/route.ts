// app/api/posts/[id]/mark-winner/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const postId = params.id;
    
    // Get the post to check its date
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    });
    
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }
    
    // Check if the post is already marked as winner
    const isCurrentlyWinner = post.isWinner;
    
    if (isCurrentlyWinner) {
      // If it's already a winner, remove the winner status
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          isWinner: false,
        },
      });
      
      return NextResponse.json({ 
        message: "Winner status removed successfully" 
      });
    } else {
      // Get the date of the post
      const postDate = new Date(post.date);
      postDate.setHours(0, 0, 0, 0);
      
      const nextDay = new Date(postDate);
      nextDay.setDate(nextDay.getDate() + 1);
      
      // Remove any existing winners for this day
      await prisma.post.updateMany({
        where: {
          date: {
            gte: postDate,
            lt: nextDay,
          },
          isWinner: true,
        },
        data: {
          isWinner: false,
        },
      });
      
      // Mark this post as winner
      await prisma.post.update({
        where: {
          id: postId,
        },
        data: {
          isWinner: true,
        },
      });
      
      return NextResponse.json({
        message: "Post marked as winner successfully"
      });
    }
  } catch (error) {
    console.error("Error marking post as winner:", error);
    return NextResponse.json(
      { error: "Failed to update winner status" },
      { status: 500 }
    );
  }
}
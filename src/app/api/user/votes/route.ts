// app/api/user/votes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get all votes for the current user
export async function GET(_req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Get today's posts that the user has voted for
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const votes = await prisma.vote.findMany({
      where: {
        userId: user.id,
        post: {
          date: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
      select: {
        id: true,
        postId: true,
      },
    });
    
    return NextResponse.json(votes);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch votes" }, { status: 500 });
  }
}
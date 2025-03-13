// app/api/winner/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Determine winner for a specific date (can be called by a cron job)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const dateParam = body.date;
    
    let date: Date;
    if (dateParam) {
      date = new Date(dateParam);
    } else {
      // Default to yesterday
      date = new Date();
      date.setDate(date.getDate() - 1);
    }
    
    // Set hours to 0 to get all posts for the day
    date.setHours(0, 0, 0, 0);
    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);
    
    // Check if a winner is already marked for this date
    const existingWinner = await prisma.post.findFirst({
      where: {
        date: {
          gte: date,
          lt: nextDay,
        },
        isWinner: true
      }
    });
    
    // If a winner already exists, return it
    if (existingWinner) {
      return NextResponse.json({ 
        message: "A winner has already been determined for this date",
        winner: existingWinner
      });
    }
    
    // Find the post with the most votes for the given date
    const posts = await prisma.post.findMany({
      where: {
        date: {
          gte: date,
          lt: nextDay,
        },
      },
      include: {
        _count: {
          select: {
            votes: true,
          },
        },
      },
      orderBy: {
        votes: {
          _count: "desc",
        },
      },
      take: 1,
    });
    
    if (posts.length === 0) {
      return NextResponse.json({ message: "No posts found for this date" }, { status: 404 });
    }
    
    const winner = posts[0];
    
    // Only mark as winner if it has at least one vote
    if (winner._count.votes > 0) {
      // Update the post to mark it as a winner
      await prisma.post.update({
        where: {
          id: winner.id,
        },
        data: {
          isWinner: true, // Using boolean true, not string "true"
        },
      });
      
      return NextResponse.json({
        message: "Winner determined successfully",
        winner: winner
      });
    } else {
      return NextResponse.json({
        message: "No posts with votes found for this date",
        candidate: winner
      });
    }
  } catch (error) {
    console.error("Error determining winner:", error);
    return NextResponse.json({ error: "Failed to determine winner" }, { status: 500 });
  }
}
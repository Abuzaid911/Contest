// app/api/winner/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Get the winner for a specific date
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const dateParam = url.searchParams.get("date");
    
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
    
    // Find the post with the most votes for the given date
    const posts = await prisma.post.findMany({
      where: {
        date: {
          gte: date,
          lt: nextDay,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
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
    
    // Update the post to mark it as a winner if not already marked
    if (!winner.isWinner) {
      await prisma.post.update({
        where: {
          id: winner.id,
        },
        data: {
          isWinner: true,
        },
      });
    }
    
    return NextResponse.json(winner);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch winner" }, { status: 500 });
  }
}

// Determine winner for a specific date (can be called by a cron job)
export async function POST(req: NextRequest) {
  try {
    const { date: dateParam } = await req.json();
    
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
    
    // Update the post to mark it as a winner
    await prisma.post.update({
      where: {
        id: winner.id,
      },
      data: {
        isWinner: true,
      },
    });
    
    return NextResponse.json(winner);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to determine winner" }, { status: 500 });
  }
}
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get all posts for the current date
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const date = url.searchParams.get("date");
    
    let dateFilter: Date;
    if (date) {
      dateFilter = new Date(date);
    } else {
      dateFilter = new Date();
    }
    
    // Set hours to 0 to get all posts for the day
    dateFilter.setHours(0, 0, 0, 0);
    const nextDay = new Date(dateFilter);
    nextDay.setDate(nextDay.getDate() + 1);
    
    const posts = await prisma.post.findMany({
      where: {
        date: {
          gte: dateFilter,
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
        createdAt: "desc",
      },
    });
    
    return NextResponse.json(posts);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

// Create a new post
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const { title, description, imageUrl } = await req.json();
    
    if (!title || !imageUrl) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    // Check if user already posted today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const existingPost = await prisma.post.findFirst({
      where: {
        authorId: user.id,
        date: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    
    if (existingPost) {
      return NextResponse.json({ error: "You have already posted today" }, { status: 400 });
    }
    
    const post = await prisma.post.create({
      data: {
        title,
        description,
        imageUrl,
        authorId: user.id,
        date: today,
      },
    });
    
    return NextResponse.json(post);
  } catch (_error) {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
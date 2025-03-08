import { PrismaClient } from '@prisma/client';
import { schedule } from 'node-cron';

const prisma = new PrismaClient();

async function determineWinner() {
  try {
    // Get today's date (midnight)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Get tomorrow's date (midnight)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Find the post with the most votes for today
    const posts = await prisma.post.findMany({
      where: {
        date: {
          gte: today,
          lt: tomorrow,
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
          _count: 'desc',
        },
      },
      take: 1,
    });
    
    if (posts.length === 0) {
      console.log('No posts found for today');
      return;
    }
    
    const winnerPost = posts[0];
    
    // Update the winner post
    await prisma.post.update({
      where: {
        id: winnerPost.id,
      },
      data: {
        isWinner: true,
      },
    });
    
    console.log(`Winner determined for ${today.toISOString().split('T')[0]}:`, winnerPost.id);
  } catch (error) {
    console.error('Error determining winner:', error);
  }
}

// Schedule the job to run at 10 PM GMT every day
schedule('0 22 * * *', determineWinner);

console.log('Winner determination scheduler started');
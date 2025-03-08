// scripts/determine-winner.js
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function determineWinner() {
  try {
    console.log('Starting daily winner determination process...');
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    console.log(`Finding winner for date: ${yesterday.toISOString()}`);
    
    // Find posts from yesterday
    const posts = await prisma.post.findMany({
      where: {
        date: {
          gte: yesterday,
          lt: today,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
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
          _count: 'desc',
        },
      },
    });
    
    if (posts.length === 0) {
      console.log('No posts found for yesterday.');
      return;
    }
    
    console.log(`Found ${posts.length} posts from yesterday.`);
    
    // Reset previous winners
    await prisma.post.updateMany({
      where: {
        isWinner: true
      },
      data: {
        isWinner: false
      }
    });

    // Get all posts with the highest vote count
    const maxVotes = posts[0]._count.votes;
    const winners = posts.filter(post => post._count.votes === maxVotes);
    
    if (maxVotes === 0) {
      console.log('No votes found for any posts yesterday.');
      return;
    }
    
    // Log all winners
    winners.forEach(winner => {
      console.log(`Winner: ${winner.title} by ${winner.author.name || 'Anonymous'} with ${winner._count.votes} votes.`);
    });
    
    // Update all winning posts
    await Promise.all(winners.map(winner =>
      prisma.post.update({
        where: {
          id: winner.id,
        },
        data: {
          isWinner: true,
        },
      })
    ));
    
    console.log(`Updated post ${winner.id} as the daily winner.`);
    
    // Here you could add code to send email notifications
    // to the winner and/or all participants
    
    console.log('Daily winner determination completed successfully.');
  } catch (error) {
    console.error('Error determining daily winner:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the function
determineWinner()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
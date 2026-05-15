import { Queue, Worker, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

// Ensure this matches your Redis server configuration
const connection = new IORedis({
  host: '127.0.0.1', // Since it's installed on the same machine
  port: 6379,
  maxRetriesPerRequest: null,
});

export const siegeQueueName = 'DRKCNAY-siege-queue';

export const siegeQueue = new Queue(siegeQueueName, { connection });

// Helper to add jobs to the queue
export async function addSiegeJob(jobName: string, data: any) {
  return await siegeQueue.add(jobName, data, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: true, // Keep Redis memory clean
    removeOnFail: false, // Keep failed jobs for inspection
  });
}

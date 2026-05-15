import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { generateGodModeOmniContent } from '../ai-seo';

const connection = new IORedis({
  host: '127.0.0.1',
  port: 6379,
  maxRetriesPerRequest: null,
});

export const worker = new Worker(
  'DRKCNAY-siege-queue',
  async (job) => {
    console.log(`[WORKER] Processing job ${job.id} of type ${job.name}`);
    
    if (job.name === 'generate-edge-content') {
      const { city, district } = job.data;
      
      console.log(`[WORKER] Generating God Mode content for ${city} ${district}...`);
      
      // Simulate or actually generate content
      // In a real scenario, you might save this to DB so the CF worker can fetch it instantly
      const content = await generateGodModeOmniContent({
        host: 'vipescorthizmeti.com',
        city,
        district,
        category: 'VIP Escort'
      });
      
      console.log(`[WORKER] Content generated successfully for ${city} ${district}.`);
      return { status: 'success', city, district };
    }
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`[WORKER] Job ${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`[WORKER] Job ${job?.id} has failed with ${err.message}`);
});

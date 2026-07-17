import { Worker } from "bullmq";
import { env } from "../config/env";
import IORedis from "ioredis";
import { logger } from "../lib/logger";
import { io } from "../socket";

const isRedisAvailable = env.REDIS_URL && !env.REDIS_URL.includes("localhost");

let notificationWorker: any;

if (isRedisAvailable) {
  try {
    const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
    
    notificationWorker = new Worker("notifications", async (job) => {
      logger.info(`Processing notification job ${job.id}`);
      
      if (job.name === "send_realtime") {
        const { workspaceId, event, payload } = job.data;
        if (io) {
          io.to(workspaceId).emit(event, payload);
          logger.info(`Emitted ${event} to workspace ${workspaceId}`);
        }
      }
    }, { connection });

    notificationWorker.on("completed", (job: any) => {
      logger.info(`Job ${job.id} has completed!`);
    });

    notificationWorker.on("failed", (job: any, err: any) => {
      logger.error(`Job ${job?.id} has failed with ${err.message}`);
    });
  } catch (error) {
    logger.warn("Redis connection failed, workers not started.");
  }
}

export const startWorkers = () => {
  if (notificationWorker) {
    logger.info("BullMQ Workers started");
  } else {
    logger.warn("BullMQ Workers skipped (Redis not available)");
  }
};

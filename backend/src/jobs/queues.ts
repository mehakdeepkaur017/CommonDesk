import { Queue } from "bullmq";
import { env } from "../config/env";
import IORedis from "ioredis";

// In local development on Windows without Docker, Redis might not be available.
// We use a mock queue unless REDIS_URL explicitly points to a remote server or we force enable it.
const isRedisAvailable = env.REDIS_URL && !env.REDIS_URL.includes("localhost");

class MockQueue {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
  async add(name: string, data: any) {
    console.log(`[MockQueue ${this.name}] Added job: ${name}`);
    return { id: Math.random().toString(), name, data };
  }
}

const createQueue = (name: string) => {
  if (isRedisAvailable) {
    try {
      const connection = new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null });
      return new Queue(name, { connection }) as any;
    } catch (error) {
      console.error("Failed to connect to Redis for BullMQ, using mock queue");
      return new MockQueue(name) as any;
    }
  }
  return new MockQueue(name) as any;
};

export const notificationQueue = createQueue("notifications");
export const emailQueue = createQueue("emails");
export const cleanupQueue = createQueue("cleanup");

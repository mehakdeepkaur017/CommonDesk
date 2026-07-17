import { Redis } from "ioredis";
import { env } from "../config/env";

const isRedisAvailable = env.REDIS_URL && !env.REDIS_URL.includes("localhost");

class MockRedis {
  private cache: Record<string, string> = {};

  async sadd() { return 1; }
  async srem() { return 1; }
  async smembers() { return []; }
  
  async get(key: string) { return this.cache[key] || null; }
  async setex(key: string, seconds: number, value: string) { 
    this.cache[key] = value;
    // We won't simulate expiration for the mock to keep it simple
    return 'OK'; 
  }
  
  on() { return this; }
}

export const redis = isRedisAvailable 
  ? new Redis(env.REDIS_URL, { maxRetriesPerRequest: null })
  : new MockRedis() as any;

if (isRedisAvailable) {
  redis.on("error", (err: any) => {
    console.error("Redis error:", err);
  });
}

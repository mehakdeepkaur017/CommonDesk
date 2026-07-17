import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default("5000"),
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  CLIENT_URL: z.string().url(),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(1),
  JWT_REFRESH_SECRET: z.string().min(1),
  REDIS_URL: z.string().url().default("redis://localhost:6379"),
  CLOUDINARY_CLOUD_NAME: z.string().default("demo"),
  CLOUDINARY_API_KEY: z.string().default("demo"),
  CLOUDINARY_API_SECRET: z.string().default("demo"),
});

export const env = envSchema.parse(process.env);

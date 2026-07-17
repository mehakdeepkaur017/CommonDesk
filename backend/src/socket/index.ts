import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { env } from "../config/env";
import { redis } from "../lib/redis";
import { logger } from "../lib/logger";

export let io: Server;

export const initSocket = (server: HttpServer) => {
  io = new Server(server, {
    cors: {
      origin: env.CLIENT_URL,
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join a workspace room
    socket.on("join_workspace", async (workspaceId: string) => {
      socket.join(workspaceId);
      logger.info(`Socket ${socket.id} joined workspace ${workspaceId}`);
      // Record presence in redis
      await redis.sadd(`workspace:${workspaceId}:online`, socket.id);
      io.to(workspaceId).emit("presence_update", { active: true });
    });

    socket.on("leave_workspace", async (workspaceId: string) => {
      socket.leave(workspaceId);
      await redis.srem(`workspace:${workspaceId}:online`, socket.id);
    });

    socket.on("disconnect", async () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      // In a real app we would map socket.id to user/workspace and remove from all redis sets
    });
  });

  return io;
};

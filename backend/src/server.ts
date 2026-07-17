import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { errorHandler } from "./middleware/errorHandler";
import { notFoundHandler } from "./middleware/notFoundHandler";
import { apiLimiter } from "./middleware/rateLimiter";
import { requestContextMiddleware } from "./middleware/requestContext";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { initSocket } from "./socket";
import { startWorkers } from "./jobs/worker";
import authRoutes from "./routes/authRoutes";
import workspaceRoutes from "./routes/workspaceRoutes";
import memberRoutes from "./routes/memberRoutes";
import roleRoutes from "./routes/roleRoutes";
import invitationRoutes from "./routes/invitationRoutes";
import projectRoutes from "./routes/projectRoutes";
import taskRoutes from "./routes/taskRoutes";
import activityRoutes from "./routes/activityRoutes";
import labelRoutes from "./routes/labelRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import dashboardRoutes from "./routes/dashboardRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import searchRoutes from "./routes/searchRoutes";
import fileRoutes from "./routes/fileRoutes";

const app = express();

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors({
  origin: env.CLIENT_URL,
  credentials: true,
}));
app.use(apiLimiter);

// Parsing Middleware
app.use(requestContextMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging Middleware
if (env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/workspaces", workspaceRoutes);
app.use("/api/v1/workspaces/members", memberRoutes);
app.use("/api/v1/workspaces/invitations", invitationRoutes);
app.use("/api/v1/roles", roleRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/activity", activityRoutes);
app.use("/api/v1/labels", labelRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/search", searchRoutes);
app.use("/api/v1/files", fileRoutes);

// Static Uploads
app.use("/uploads", (req, res, next) => {
  if (req.query.download === '1') {
    res.setHeader('Content-Disposition', 'attachment');
  }
  next();
}, express.static(path.join(process.cwd(), "uploads")));

// Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Swagger Documentation
const swaggerDocument = YAML.load(path.join(__dirname, "swagger.yaml"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const PORT = env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});

// Initialize WebSockets
initSocket(server);

// Start BullMQ Workers
startWorkers();

export default server;

import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs for development
  message: { error: true, code: "TOO_MANY_REQUESTS", message: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true,
  legacyHeaders: false,
});

export const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 1000 requests per windowMs for development
  message: { error: true, code: "TOO_MANY_REQUESTS", message: "Too many login attempts, please try again after a minute" },
  standardHeaders: true,
  legacyHeaders: false,
});

import { Router } from "express";
import * as notificationController from "../controllers/notificationController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/", notificationController.listNotifications);
router.patch("/mark-all-read", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);

export default router;

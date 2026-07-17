import { Router } from "express";
import * as analyticsController from "../controllers/analyticsController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/", requireRole(["ADMIN"]), analyticsController.getAnalytics);

export default router;

import { Router } from "express";
import * as dashboardController from "../controllers/dashboardController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/member", dashboardController.getMemberDashboard);
router.get("/admin", requireRole(["ADMIN"]), dashboardController.getAdminDashboard);

export default router;

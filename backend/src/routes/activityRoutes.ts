import { Router } from "express";
import * as activityController from "../controllers/activityController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/", activityController.listActivity);

export default router;

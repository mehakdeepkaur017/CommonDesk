import { Router } from "express";
import * as searchController from "../controllers/searchController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/", searchController.search);

export default router;

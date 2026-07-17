import { Router } from "express";
import * as memberController from "../controllers/memberController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { requireRole } from "../middleware/requireRole";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/", memberController.listMembers);

router.use(requireRole(["ADMIN"]));

router.delete("/:id", memberController.removeMember);
router.patch("/:id/suspend", memberController.suspendMember);
router.patch("/:id/reactivate", memberController.reactivateMember);
router.patch("/:id/role", memberController.updateRole);

export default router;

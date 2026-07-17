import { Router } from "express";
import * as invitationController from "../controllers/invitationController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { requireRole } from "../middleware/requireRole";
import { validateRequest } from "../middleware/validateRequest";
import { inviteMemberSchema, acceptInvitationSchema } from "../validations/invitationValidation";

const router = Router();

// Accept invitation doesn't require workspace context since user might not be part of it yet
router.post("/:token/accept", validateRequest(acceptInvitationSchema), invitationController.acceptInvitation);

router.use(requireAuth);
router.use(requireWorkspace);
router.use(requireRole(["ADMIN"]));

router.post("/", validateRequest(inviteMemberSchema), invitationController.inviteMember);

export default router;

import { Router } from "express";
import * as workspaceController from "../controllers/workspaceController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { requireRole } from "../middleware/requireRole";
import { validateRequest } from "../middleware/validateRequest";
import { updateWorkspaceSchema } from "../validations/workspaceValidation";
import { upload } from "../middleware/uploadHandler";

const router = Router();

router.use(requireAuth);

// Routes that DO NOT require a specific workspace context
router.get("/", workspaceController.listWorkspaces);
router.post("/", workspaceController.createWorkspace);

// Routes that DO require a specific workspace context
router.get("/current", requireWorkspace, workspaceController.getCurrentWorkspace);
router.get("/current/audit-logs", requireWorkspace, requireRole(["ADMIN"]), workspaceController.getAuditLogs);
router.patch("/current", requireWorkspace, requireRole(["ADMIN"]), validateRequest(updateWorkspaceSchema), workspaceController.updateWorkspace);
router.delete("/current", requireWorkspace, requireRole(["ADMIN"]), workspaceController.deleteWorkspace);

// Logo upload
router.post("/current/logo", requireWorkspace, requireRole(["ADMIN"]), upload.single("logo"), workspaceController.uploadLogo);

router.get("/current/stats", requireWorkspace, workspaceController.getWorkspaceStats);
router.get("/current/join-requests", requireWorkspace, requireRole(["ADMIN"]), workspaceController.getJoinRequests);
router.post("/current/join-requests/:id/approve", requireWorkspace, requireRole(["ADMIN"]), workspaceController.approveJoinRequest);
router.post("/current/join-requests/:id/reject", requireWorkspace, requireRole(["ADMIN"]), workspaceController.rejectJoinRequest);
router.patch("/current/code", requireWorkspace, requireRole(["ADMIN"]), workspaceController.regenerateCode);

export default router;

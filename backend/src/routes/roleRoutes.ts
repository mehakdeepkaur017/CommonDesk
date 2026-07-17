import { Router } from "express";
import * as roleController from "../controllers/roleController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { requireRole } from "../middleware/requireRole";
import { validateRequest } from "../middleware/validateRequest";
import { createRoleSchema, updateRoleSchema } from "../validations/roleValidation";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/", roleController.listRoles);
router.post("/", requireRole(["ADMIN"]), validateRequest(createRoleSchema), roleController.createRole);
router.patch("/:id", requireRole(["ADMIN"]), validateRequest(updateRoleSchema), roleController.updateRole);
router.delete("/:id", requireRole(["ADMIN"]), roleController.deleteRole);

export default router;

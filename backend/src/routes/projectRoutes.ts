import { Router } from "express";
import * as projectController from "../controllers/projectController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { requirePermission } from "../middleware/requirePermission";
import { requireProjectRole } from "../middleware/requireProjectRole";
import { validateRequest } from "../middleware/validateRequest";
import { createProjectSchema, updateProjectSchema } from "../validations/projectValidation";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/", projectController.listProjects);
router.post("/", requirePermission("create:project"), validateRequest(createProjectSchema), projectController.createProject);
router.get("/:id", 
  requireProjectRole([], req => req.params.id as string), 
  projectController.getProject
);

// For updating project, require owner or manager
router.patch("/:id", 
  requireProjectRole(["owner", "manager"], req => req.params.id as string), 
  validateRequest(updateProjectSchema), 
  projectController.updateProject
);

// For deleting project, require owner
router.delete("/:id", 
  requireProjectRole(["owner"], req => req.params.id as string), 
  projectController.deleteProject
);

// Project Members
// Managing members requires owner or manager
router.post("/:id/members", 
  requireProjectRole(["owner", "manager"], req => req.params.id as string), 
  projectController.addMember
);
router.delete("/:id/members/:userId", 
  requireProjectRole(["owner", "manager"], req => req.params.id as string), 
  projectController.removeMember
);

export default router;

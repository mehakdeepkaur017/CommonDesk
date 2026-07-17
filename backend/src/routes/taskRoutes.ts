import { Router } from "express";
import * as taskController from "../controllers/taskController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { validateRequest } from "../middleware/validateRequest";
import { createTaskSchema, updateTaskSchema, bulkTaskOperationSchema, addChecklistItemSchema, updateChecklistItemSchema } from "../validations/taskValidation";
import { createCommentSchema } from "../validations/commentValidation";
import { assignLabelSchema } from "../validations/labelValidation";
import { requireProjectRole } from "../middleware/requireProjectRole";
import prisma from "../lib/prisma";

const getProjectIdFromTask = async (req: any) => {
  const taskId = req.params.id;
  if (!taskId) return null;
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  return task?.projectId || null;
};

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/", taskController.listTasks);

router.post("/bulk",
  validateRequest(bulkTaskOperationSchema),
  taskController.bulkTasksOperation
);

router.post("/", 
  requireProjectRole([], (req) => req.body.projectId), 
  validateRequest(createTaskSchema), 
  taskController.createTask
);
router.get("/:id", taskController.getTask);

router.patch("/:id", 
  requireProjectRole([], getProjectIdFromTask), 
  validateRequest(updateTaskSchema), 
  taskController.updateTask
);

router.delete("/:id", 
  requireProjectRole(["owner", "manager"], getProjectIdFromTask), 
  taskController.deleteTask
);

// Checklist Endpoints
router.post("/:id/checklists",
  requireProjectRole([], getProjectIdFromTask),
  validateRequest(addChecklistItemSchema),
  taskController.addChecklistItem
);

router.patch("/:id/checklists/:itemId",
  requireProjectRole([], getProjectIdFromTask),
  validateRequest(updateChecklistItemSchema),
  taskController.updateChecklistItem
);

router.delete("/:id/checklists/:itemId",
  requireProjectRole([], getProjectIdFromTask),
  taskController.removeChecklistItem
);

// Task Comments
router.post("/:id/comments", 
  requireProjectRole([], getProjectIdFromTask), 
  validateRequest(createCommentSchema), 
  taskController.addComment
);
router.get("/:id/comments", taskController.listComments);

// Task Labels
router.post("/:id/labels", 
  requireProjectRole(["owner", "manager"], getProjectIdFromTask), 
  validateRequest(assignLabelSchema), 
  taskController.assignLabel
);

export default router;

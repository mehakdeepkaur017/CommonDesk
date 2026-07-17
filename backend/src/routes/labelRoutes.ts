import { Router } from "express";
import * as labelController from "../controllers/labelController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { validateRequest } from "../middleware/validateRequest";
import { createLabelSchema } from "../validations/labelValidation";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

router.get("/", labelController.listLabels);
router.post("/", validateRequest(createLabelSchema), labelController.createLabel);
router.delete("/:id", labelController.deleteLabel);

export default router;

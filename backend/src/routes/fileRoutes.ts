import { Router } from "express";
import * as fileController from "../controllers/fileController";
import { requireAuth } from "../middleware/requireAuth";
import { requireWorkspace } from "../middleware/requireWorkspace";
import { requireProjectRole } from "../middleware/requireProjectRole";
import { upload } from "../middleware/uploadHandler";
import prisma from "../lib/prisma";

const router = Router();

router.use(requireAuth);
router.use(requireWorkspace);

const getProjectIdFromFile = async (req: any) => {
  const fileId = req.params.id;
  if (!fileId) return null;
  const file = await prisma.attachment.findUnique({ where: { id: fileId } });
  return file?.projectId || null;
};

// GET /api/files/stats
router.get("/stats", fileController.getStorageStats);

// GET /api/files
router.get("/", fileController.listFiles);

// POST /api/files/upload
router.post("/upload", 
  upload.single("file"), 
  fileController.uploadFile
);

// POST /api/files/:id/versions
router.post("/:id/versions", 
  upload.single("file"),
  fileController.uploadNewVersion
);

// GET /api/files/:id/versions
router.get("/:id/versions", fileController.getVersions);

// PUT /api/files/:id
router.put("/:id",
  requireProjectRole(["owner", "manager", "member"], getProjectIdFromFile, true), // pass true if it's okay for projectId to be null (meaning workspace level)
  fileController.updateFile
);

// DELETE /api/files/:id
router.delete("/:id", 
  requireProjectRole(["owner", "manager"], getProjectIdFromFile, true),
  fileController.deleteFile
);

export default router;

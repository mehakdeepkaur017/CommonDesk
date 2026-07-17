import { Router } from "express";
import * as authController from "../controllers/authController";
import { validateRequest } from "../middleware/validateRequest";
import { registerOrgSchema, joinOrgSchema, loginSchema } from "../validations/authValidation";
import { requireAuth } from "../middleware/requireAuth";
import { authLimiter } from "../middleware/rateLimiter";
import { upload } from "../middleware/uploadHandler";

const router = Router();

router.post("/register-org", authLimiter, validateRequest(registerOrgSchema), authController.registerOrg);
router.post("/join-org", authLimiter, validateRequest(joinOrgSchema), authController.joinOrg);
router.post("/login", authLimiter, validateRequest(loginSchema), authController.login);
router.post("/refresh", authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.getMe);
router.patch("/me", requireAuth, authController.updateProfile);
router.post("/me/avatar", requireAuth, upload.single("avatar"), authController.uploadAvatar);
router.get("/join-status", requireAuth, authController.getJoinStatus);

export default router;

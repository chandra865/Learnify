import { Router } from "express";
import { requestPasswordReset, resetPassword } from "../controllers/PasswordResetToken.controller.js";

const router = Router();

router.route("/password-reset-token").post(requestPasswordReset);
router.route("/password-reset").post(resetPassword);

export default router;

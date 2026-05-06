import { Router } from "express";
import { requestPasswordReset, resetPassword } from "../controllers/PasswordResetToken.controller.js";
import { validate } from "../middlewares/validation.js";
import { requestPasswordResetSchema, resetPasswordSchema } from "../schema/PasswordResetToken.schema.js";

const router = Router();

router.route("/password-reset-token").post(validate(requestPasswordResetSchema), requestPasswordReset);
router.route("/password-reset").post(validate(resetPasswordSchema), resetPassword);

export default router;

import { Router } from "express";
import {
  updateProgress,
  getProgress,
  getCertificate,
  markLectureComplete,
  unmarkLectureComplete,
} from "../controllers/progress.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.js";
import { updateProgressSchema, markLectureCompleteSchema } from "../schema/progress.schema.js";

const router = Router();

router.route("/update-progress").post(verifyJWT, validate(updateProgressSchema), updateProgress);
router.route("/get-progress/:userId/:courseId").get(verifyJWT, getProgress);
router.route("/get-certificate/:userId/:courseId").get(verifyJWT, getCertificate);
router.route("/complete").post(verifyJWT, validate(markLectureCompleteSchema), markLectureComplete);
router.route("/uncomplete").post(verifyJWT, validate(markLectureCompleteSchema), unmarkLectureComplete);

export default router;

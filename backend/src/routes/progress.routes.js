import { Router } from "express";
import {
  updateProgress,
  getProgress,
  getCertificate,
  markLectureComplete,
  unmarkLectureComplete,
} from "../controllers/progress.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/update-progress").post(verifyJWT, updateProgress);
router.route("/get-progress/:userId/:courseId").get(verifyJWT, getProgress);
router.route("/get-certificate/:userId/:courseId").get(verifyJWT, getCertificate);
router.route("/complete").post(verifyJWT, markLectureComplete);
router.route("/uncomplete").post(verifyJWT, unmarkLectureComplete);

export default router;

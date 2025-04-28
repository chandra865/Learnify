import { Router } from "express";
import {
  updateProgress,
  getProgress,
  getCertificate,
  markLectureComplete,
  unmarkLectureComplete,
} from "../controllers/progress.controller.js";

const router = Router();

router.route("/update-progress").post(updateProgress);
router.route("/get-progress/:userId/:courseId").get(getProgress);
router.route("/get-certificate/:userId/:courseId").get(getCertificate);
router.route("/complete").post(markLectureComplete);
router.route("/uncomplete").post(unmarkLectureComplete);

export default router;

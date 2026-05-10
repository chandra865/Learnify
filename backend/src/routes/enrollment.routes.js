import Router from "express"
import {
  getEnrollmentCountForCourse,
  getEnrolledCourseCountForUser,
  checkUserEnrollment,
  getEnrolledCourses
} from "../controllers/enrollment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/course/:courseId").get(verifyJWT, getEnrollmentCountForCourse);
router.route("/user/:userId").get(verifyJWT, getEnrolledCourseCountForUser);
router.route("/:userId/:courseId").get(verifyJWT, checkUserEnrollment);
router.route("/:userId").get(verifyJWT, getEnrolledCourses);

export default router;
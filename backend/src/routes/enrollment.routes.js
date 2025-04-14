import Router from "express"
import {
  getEnrollmentCountForCourse,
  getEnrolledCourseCountForUser,
  checkUserEnrollment,
  getEnrolledCourses
} from "../controllers/enrollment.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/get-course-enrollment/:courseId").get(verifyJWT, getEnrollmentCountForCourse);
router.route("/get-user-enrollment/:userId").get(verifyJWT, getEnrolledCourseCountForUser);
router.route("/check-user-enrollment/:userId/:courseId").get(verifyJWT, checkUserEnrollment);
router.route("/get-enrolled-courses/:userId").get(verifyJWT, getEnrolledCourses);

export default router;
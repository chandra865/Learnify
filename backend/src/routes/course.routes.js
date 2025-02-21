import { Router } from "express";
import { verifyJWT,isAuthorized } from "../middlewares/auth.middleware.js";
import { createCourse, addLecture, instructorCourses, courseEnrollment,stuCourses} from "../controllers/course.controller.js";

const router = Router();

router.route("/Add-course").post(verifyJWT, isAuthorized("instructor"), createCourse);
router.route("/Add-lecture/:courseId").post(verifyJWT, isAuthorized("instructor"), addLecture);
router.route("/inst-courses").get(verifyJWT, isAuthorized("instructor"), instructorCourses);
router.route("/enrolle/:courseId").post(verifyJWT, isAuthorized("student"), courseEnrollment);
router.route("/stu-courses").get(verifyJWT, isAuthorized("student"), stuCourses);




export default router;
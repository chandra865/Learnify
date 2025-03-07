import { Router } from "express";
import { verifyJWT,isAuthorized } from "../middlewares/auth.middleware.js";
import { createCourse, addLecture, instructorCourses, courseEnrollment,stuCourses, getAllCourses, getCourse,getLectures,publishCourse} from "../controllers/course.controller.js";

const router = Router();

router.route("/Add-course").post(verifyJWT, isAuthorized("instructor"), createCourse);
router.route("/Add-lecture/:courseId").post(verifyJWT, isAuthorized("instructor"), addLecture);
router.route("/inst-courses").get(verifyJWT, isAuthorized("instructor"), instructorCourses);
router.route("/enrolle/:courseId").post(verifyJWT, isAuthorized("student"), courseEnrollment);
router.route("/stu-courses").get(verifyJWT, isAuthorized("student"), stuCourses);
router.route("/all-courses").get(getAllCourses);
router.route("/fetchcourse/:courseId").get(getCourse);
router.route("/lectures/:courseId").get(getLectures);
router.route("/publish/:courseId").patch(verifyJWT, isAuthorized("instructor"), publishCourse);



export default router;
import { Router } from "express";
import { verifyJWT, isAuthorized } from "../middlewares/auth.middleware.js";
import {
  createCourse,
  addLecture,
  instructorCourses,
  courseEnrollment,
  stuCourses,
  getAllCourses,
  getCourse,
  getLectures,
  changePublishStatus,
  updateCourse,
  courseRecommend,
  courseSearch,
  completeQuiz
} from "../controllers/course.controller.js";
import { validate } from "../middlewares/validation.js";
import {
  createCourseSchema,
  updateCourseSchema,
  addLectureSchema,
  completeQuizSchema
} from "../schema/course.schema.js";

const router = Router();

// Static and specialized routes (must come before dynamic :courseId routes)
router.route("/").get(getAllCourses);
router.route("/search").get(courseSearch);
router.route("/quiz").post(verifyJWT, isAuthorized("student"), validate(completeQuizSchema), completeQuiz);

router
  .route("/")
  .post(verifyJWT, isAuthorized("instructor"), validate(createCourseSchema), createCourse);

router
  .route("/lectures/:courseId")
  .post(verifyJWT, isAuthorized("instructor"), validate(addLectureSchema), addLecture);

router
  .route("/:instructorId/instructor")
  .get(verifyJWT, isAuthorized("instructor"), instructorCourses);

router
  .route("/:courseId/enrollments")
  .post(verifyJWT, isAuthorized("student"), courseEnrollment);

router
  .route("/:studentId/student")
  .get(verifyJWT, isAuthorized("student"), stuCourses);

// Dynamic routes
router.route("/:courseId").get(getCourse);

router.route("/lectures/:courseId").get(verifyJWT, getLectures);

router
  .route("/status/:courseId")
  .patch(verifyJWT, isAuthorized("instructor"), changePublishStatus);

router
    .route("/:courseId")
    .patch(verifyJWT, isAuthorized("instructor"), validate(updateCourseSchema), updateCourse);

router
    .route("/recommend/:courseId").get(courseRecommend);

export default router;

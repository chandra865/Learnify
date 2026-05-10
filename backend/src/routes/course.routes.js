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

//pagenatation and sorting
router.route("/").get(getAllCourses);
router.route("/:courseId").get(getCourse);

//pagenatation and sorting
router.route("/lectures/:courseId").get(verifyJWT, getLectures);
router
  .route("/status/:courseId")
  .patch(verifyJWT, isAuthorized("instructor"), changePublishStatus);

router
    .route("/:courseId")
    .patch(verifyJWT, isAuthorized("instructor"), validate(updateCourseSchema), updateCourse);

//pagenatation and sorting
router
    .route("/recommend/:courseId").get(courseRecommend);

//pagenatation and sorting
router
    .route("/search").get(courseSearch);
router
    .route("/quiz")
    .post(verifyJWT, isAuthorized("student"), validate(completeQuizSchema), completeQuiz);


export default router;

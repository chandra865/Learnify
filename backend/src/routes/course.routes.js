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

const router = Router();

router
  .route("/Add-course")
  .post(verifyJWT, isAuthorized("instructor"), createCourse);

router
  .route("/Add-lecture/:courseId")
  .post(verifyJWT, isAuthorized("instructor"), addLecture);

router
  .route("/inst-courses")
  .get(verifyJWT, isAuthorized("instructor"), instructorCourses);

router
  .route("/enrolle/:courseId")
  .post(verifyJWT, isAuthorized("student"), courseEnrollment);

router
  .route("/stu-courses")
  .get(verifyJWT, isAuthorized("student"), stuCourses);

router.route("/all-courses").get(getAllCourses);
router.route("/fetchcourse/:courseId").get(getCourse);
router.route("/lectures/:courseId").get(verifyJWT, getLectures);
router
  .route("/change-publish-status/:courseId")
  .patch(verifyJWT, isAuthorized("instructor"), changePublishStatus);

router
    .route("/update-course/:courseId")
    .patch(verifyJWT, isAuthorized("instructor"), updateCourse);
  
router
    .route("/recommend/:courseId").get(courseRecommend);
router
    .route("/course-search").get(courseSearch);
router
    .route("/complete-quiz")
    .post(verifyJWT, isAuthorized("student"), completeQuiz);


export default router;

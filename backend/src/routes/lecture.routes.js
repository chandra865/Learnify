import { Router } from "express";
import { verifyJWT, isAuthorized } from "../middlewares/auth.middleware.js";
import {
  createLecture,
  deleteLecture,
  getLecturesBySection,
  updateLecture,
  addVideoToLecture,
  uploadToAwsBucket,
  deleteVideo,
  getLecture
} from "../controllers/lecture.controller.js";

const router = Router();

router.route("/add-lecture").post(verifyJWT, isAuthorized("instructor"), createLecture);
router
  .route("/get-lecture-by-section/:sectionId")
  .get(verifyJWT, getLecturesBySection);
router.route("/delete-lecture").delete(verifyJWT, isAuthorized("instructor"), deleteLecture);
router.route("/update-lecture/:lectureId").patch(verifyJWT, isAuthorized("instructor"), updateLecture);
router.route("/add-video-lecture").post(verifyJWT,isAuthorized("instructor"), addVideoToLecture);
router.route("/upload-signed-aws-url").post(verifyJWT,  uploadToAwsBucket);
router.route("/delete-video").delete(verifyJWT, isAuthorized("instructor"), deleteVideo);
router.route("/get-lecture/:lectureId").get(verifyJWT, getLecture);

export default router;

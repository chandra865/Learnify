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
import { validate } from "../middlewares/validation.js";
import {
  createLectureSchema,
  updateLectureSchema,
  addVideoSchema,
  uploadAwsSchema
} from "../schema/lecture.schema.js";

const router = Router();

router.route("/").post(verifyJWT, isAuthorized("instructor"), validate(createLectureSchema), createLecture);
router
  .route("/:sectionId")
  .get(verifyJWT, getLecturesBySection);
router.route("/:lectureId").delete(verifyJWT, isAuthorized("instructor"), deleteLecture);
router.route("/:lectureId").patch(verifyJWT, isAuthorized("instructor"), validate(updateLectureSchema), updateLecture);
router.route("/video").post(verifyJWT,isAuthorized("instructor"), validate(addVideoSchema), addVideoToLecture);
router.route("/upload-signed-aws-url").post(verifyJWT, validate(uploadAwsSchema), uploadToAwsBucket);
router.route("/video").delete(verifyJWT, isAuthorized("instructor"), deleteVideo);
router.route("/:lectureId").get(verifyJWT, getLecture);

export default router;

import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {createLecture, deleteLecture, getLecturesBySection, updateLecture} from "../controllers/lecture.controller.js";

const router = Router();

router.route("/add-lecture").post(verifyJWT, createLecture);
router.route("/get-lecture-by-section/:sectionId").get(verifyJWT, getLecturesBySection);
router.route("/delete-lecture/:lectureId").delete(verifyJWT, deleteLecture);
router.route("/update-lecture/:lectureId").patch(verifyJWT,updateLecture);


export default router;


import Router from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createSection, deleteSection, getSectionsByCourse, updateSection } from "../controllers/section.controller.js";

const router = Router();

router.route("/add-section").post(verifyJWT,createSection);
router.route("/get-section-by-course/:courseId").get(verifyJWT, getSectionsByCourse);
router.route("/delete-section/:sectionId").delete(verifyJWT,deleteSection);
router.route("/update-section/:sectionId").patch(verifyJWT, updateSection);
export default router;
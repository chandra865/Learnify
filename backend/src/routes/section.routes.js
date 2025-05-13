import Router from "express";
import { verifyJWT , isAuthorized} from "../middlewares/auth.middleware.js";
import { createSection, deleteSection, getSectionsByCourse, updateSection } from "../controllers/section.controller.js";

const router = Router();

router.route("/add-section").post(verifyJWT, isAuthorized("instructor"), createSection);
router.route("/get-section-by-course/:courseId").get(verifyJWT, getSectionsByCourse);
router.route("/delete-section/:sectionId").delete(verifyJWT, isAuthorized("instructor"), deleteSection);
router.route("/update-section/:sectionId").patch(verifyJWT, isAuthorized("instructor"), updateSection);
export default router;
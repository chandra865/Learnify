import Router from "express";
import { verifyJWT , isAuthorized} from "../middlewares/auth.middleware.js";
import { createSection, deleteSection, getSectionsByCourse, updateSection } from "../controllers/section.controller.js";
import { validate } from "../middlewares/validation.js";
import { createSectionSchema, updateSectionSchema } from "../schema/section.schema.js";

const router = Router();

router.route("/").post(verifyJWT, isAuthorized("instructor"), validate(createSectionSchema), createSection);
router.route("/:courseId").get( getSectionsByCourse);
router.route("/:sectionId").delete(verifyJWT, isAuthorized("instructor"), deleteSection);
router.route("/:sectionId").patch(verifyJWT, isAuthorized("instructor"), validate(updateSectionSchema), updateSection);
export default router;
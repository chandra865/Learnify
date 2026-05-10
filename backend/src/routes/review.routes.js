import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addReview, deleteReview, getCourseReviews } from "../controllers/review.controller.js";
import { validate } from "../middlewares/validation.js";
import { addReviewSchema } from "../schema/review.schema.js";

const router = Router();

router.route("/").post(verifyJWT, validate(addReviewSchema), addReview);
router.route("/:courseId").get(getCourseReviews);
router.route("/").delete(verifyJWT, deleteReview);

export default router;
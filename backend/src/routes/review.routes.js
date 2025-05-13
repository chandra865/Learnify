import { Router } from "express";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { addReview, deleteReview, getCourseReviews } from "../controllers/review.controller.js";

const router = Router();

router.route("/add-review").post(verifyJWT, addReview);
router.route("/get-review/:courseId").get(getCourseReviews);
router.route("/delete-review").delete(verifyJWT, deleteReview);

export default router;
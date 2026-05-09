import { Router } from "express";
import { verifyJWT, isAuthorized } from "../middlewares/auth.middleware.js";
import { createQuiz, deleteQuiz, getAllQuizzes, getQuizById,hasCompletedQuiz } from "../controllers/quiz.controller.js";
import { validate } from "../middlewares/validation.js";
import { createQuizSchema } from "../schema/quiz.schema.js";

const router = Router();

router.route("/completed").get(verifyJWT, hasCompletedQuiz)
router.route("/").post(verifyJWT, isAuthorized("instructor"), validate(createQuizSchema), createQuiz)
router.route("/:quizId").delete(verifyJWT, isAuthorized("instructor"), deleteQuiz)
router.route("/get-all-quiz/:Id").get(verifyJWT, getAllQuizzes)
router.route("/:quizId").get(verifyJWT, getQuizById)


export default router;
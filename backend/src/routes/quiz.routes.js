import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createQuiz, deleteQuiz, getAllQuizzes, getQuizById,hasCompletedQuiz } from "../controllers/quiz.controller.js";

const router = Router();

router.route("/create-quiz").post(verifyJWT, createQuiz)
router.route("/delete-quiz/:quizId").delete(verifyJWT, deleteQuiz)
router.route("/get-all-quiz/:Id").get(verifyJWT, getAllQuizzes)
router.route("/get-quiz/:quizId").get(verifyJWT, getQuizById)
router.route("/has-completed-quiz").get(verifyJWT, hasCompletedQuiz)


export default router;
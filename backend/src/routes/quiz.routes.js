import { Router } from "express";
import { verifyJWT, isAuthorized } from "../middlewares/auth.middleware.js";
import { createQuiz, deleteQuiz, getAllQuizzes, getQuizById,hasCompletedQuiz } from "../controllers/quiz.controller.js";

const router = Router();

router.route("/create-quiz").post(verifyJWT, isAuthorized("instructor"), createQuiz)
router.route("/delete-quiz/:quizId").delete(verifyJWT, isAuthorized("instructor"), deleteQuiz)
router.route("/get-all-quiz/:Id").get(verifyJWT, getAllQuizzes)
router.route("/get-quiz/:quizId").get(verifyJWT, getQuizById)
router.route("/has-completed-quiz").get(verifyJWT, hasCompletedQuiz)


export default router;
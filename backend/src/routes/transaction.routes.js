import { Router } from "express";
import { createOrder, verifyPayment, getCourseTransactions, getUserTransactions} from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-order").post(verifyJWT, createOrder);
router.route("/verify-payment").post(verifyJWT, verifyPayment);
router.route("/get-user-transactions/:userId").get(verifyJWT, getUserTransactions);
router.route("/get-course-transactions/:courseId").get(verifyJWT, getCourseTransactions);

export default router;
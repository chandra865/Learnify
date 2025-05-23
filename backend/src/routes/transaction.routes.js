import { Router } from "express";
import {
  createOrder,
  verifyPayment,
  getCourseTransactions,
  getUserInstructorTransactions,
  getOrderHistory,
} from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-order").post(verifyJWT, createOrder);
router.route("/verify-payment").post(verifyJWT, verifyPayment);
router
  .route("/get-user-instructor-transactions/:instructorId")
  .get(verifyJWT, getUserInstructorTransactions);
router
  .route("/get-course-transactions/:courseId")
  .get(verifyJWT, getCourseTransactions);
router.route("/get-order-history").get(verifyJWT, getOrderHistory);
export default router;

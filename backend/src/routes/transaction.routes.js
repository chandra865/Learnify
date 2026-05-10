import { Router } from "express";
import {
  createOrder,
  verifyPayment,
  getCourseTransactions,
  getUserInstructorTransactions,
  getOrderHistory,
} from "../controllers/transaction.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.js";
import { createOrderSchema, verifyPaymentSchema } from "../schema/transaction.schema.js";

const router = Router();

router.route("/order").post(verifyJWT, validate(createOrderSchema), createOrder);
router.route("/payment").post(verifyJWT, validate(verifyPaymentSchema), verifyPayment);
router
  .route("/instructor/:instructorId")
  .get(verifyJWT, getUserInstructorTransactions);
router
  .route("/course/:courseId")
  .get(verifyJWT, getCourseTransactions);
router.route("/history").get(verifyJWT, getOrderHistory);
export default router;

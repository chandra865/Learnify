import Router from "express";
import {
  createCoupon,
  validateCoupon,
  getCouponsByCourse,
  deleteCoupon,
  markCouponAsUsed,
  toggleCouponStatus,
} from "../controllers/coupon.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-coupon").post(verifyJWT, createCoupon);
router.route("/validate-coupon").get(verifyJWT, validateCoupon);
router.route("/get-coupon/:courseId").get(verifyJWT, getCouponsByCourse);
router.route("/delete-coupon/:couponId").delete(verifyJWT, deleteCoupon);
router.route("/toggle-coupon/:couponId").patch(verifyJWT, toggleCouponStatus);

export default router;

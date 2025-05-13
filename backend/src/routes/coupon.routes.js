import Router from "express";
import {
  createCoupon,
  validateCoupon,
  getCouponsByCourse,
  deleteCoupon,
  markCouponAsUsed,
  toggleCouponStatus,
} from "../controllers/coupon.controller.js";
import { verifyJWT, isAuthorized } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/create-coupon").post(verifyJWT, isAuthorized("instructor"), createCoupon);
router.route("/validate-coupon").get(verifyJWT, isAuthorized("instructor"), validateCoupon);
router.route("/get-coupon/:courseId").get(verifyJWT, isAuthorized("instructor"), getCouponsByCourse);
router.route("/delete-coupon/:couponId").delete(verifyJWT, isAuthorized("instructor"), deleteCoupon);
router.route("/toggle-coupon/:couponId").patch(verifyJWT, isAuthorized("instructor"), toggleCouponStatus);

export default router;

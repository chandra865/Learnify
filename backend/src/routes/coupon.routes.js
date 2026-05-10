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
import { validate } from "../middlewares/validation.js";
import { createCouponSchema } from "../schema/coupon.schema.js";

const router = Router();

router.route("/").post(verifyJWT, isAuthorized("instructor"), validate(createCouponSchema), createCoupon);
router.route("/validate").post(verifyJWT, isAuthorized("instructor"), validateCoupon);
router.route("/:courseId").get(verifyJWT, isAuthorized("instructor"), getCouponsByCourse);
router.route("/:couponId").delete(verifyJWT, isAuthorized("instructor"), deleteCoupon);
router.route("/:couponId").patch(verifyJWT, isAuthorized("instructor"), toggleCouponStatus);

export default router;

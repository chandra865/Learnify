import { Coupon } from "../models/coupon.model.js";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountPercentage, expiresAt, usageLimit, courseId } = req.body;

  if (!code || !discountPercentage || !expiresAt || !usageLimit || !courseId) {
    throw new ApiError(400, "All coupon fields are required");
  }

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const existing = await Coupon.findOne({ code });
  if (existing) throw new ApiError(400, "Coupon code already exists");

  const coupon = await Coupon.create({
    code: code.toUpperCase(),
    discountPercentage,
    expiresAt,
    usageLimit,
    courseId,
  });

  return res.status(201).json(new ApiResponse(201, coupon, "Coupon created successfully"));
});


// VALIDATE COUPON
const validateCoupon = asyncHandler(async (req, res) => {
  const { code, courseId, userId } = req.body;

  if (!code || !courseId || !userId) {
    throw new ApiError(400, "Code, courseId, and userId are required");
  }

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), courseId });

  if (!coupon) throw new ApiError(404, "Invalid coupon code");

  if (coupon.expiresAt < new Date()) throw new ApiError(400, "Coupon expired");

  if (coupon.usedBy.includes(userId)) throw new ApiError(400, "Coupon already used by user");

  if (coupon.usedBy.length >= coupon.usageLimit) {
    throw new ApiError(400, "Coupon usage limit reached");
  }

  return res.status(200).json(
    new ApiResponse(200, { discountPercentage: coupon.discountPercentage }, "Coupon is valid")
  );
});


// MARK COUPON AS USED (call this after successful payment)
const markCouponAsUsed = asyncHandler(async (userId, couponCode) => {
  const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
  if (!coupon) return;

  // Prevent double usage
  if (!coupon.usedBy.includes(userId)) {
    coupon.usedBy.push(userId);
    await coupon.save();
  }
});


const deleteCoupon = asyncHandler(async (req, res) => {
  const { code } = req.params;

  const coupon = await Coupon.findOneAndDelete({ code: code.toUpperCase() });

  if (!coupon) throw new ApiError(404, "Coupon not found");

  return res.status(200).json(new ApiResponse(200, {}, "Coupon deleted successfully"));
});

export { createCoupon, validateCoupon, markCouponAsUsed, deleteCoupon };

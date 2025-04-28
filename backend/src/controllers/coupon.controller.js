import { Coupon } from "../models/coupon.model.js";
import { Course } from "../models/course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { updateCourseFinalPrice } from "../utils/updateCoursePrice.js";

const createCoupon = asyncHandler(async (req, res) => {
  const { code, discountPercentage, expiresAt, courseId } = req.body;

  if (!code || !discountPercentage || !expiresAt || !courseId) {
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
    courseId,
  });
  await updateCourseFinalPrice(courseId);
  return res
    .status(201)
    .json(new ApiResponse(201, coupon, "Coupon created successfully"));
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

  if (coupon.usedBy.includes(userId))
    throw new ApiError(400, "Coupon already used by user");

  // if (coupon.usedBy.length >= coupon.usageLimit) {
  //   throw new ApiError(400, "Coupon usage limit reached");
  // }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { discountPercentage: coupon.discountPercentage },
        "Coupon is valid"
      )
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

const getCouponsByCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const coupons = await Coupon.find({ courseId }).sort({ createdAt: -1 });
  if (!coupons) {
    throw new ApiError(404, "coupon not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, coupons, "coupon fectched successfully"));
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { couponId } = req.params;
  //console.log(couponId);
  const coupon = await Coupon.findOneAndDelete({ _id: couponId });

  if (!coupon) throw new ApiError(404, "Coupon not found");
  await updateCourseFinalPrice(coupon.courseId);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Coupon deleted successfully"));
});

// Toggle coupon status
const toggleCouponStatus = asyncHandler(async (req, res) => {
  const { couponId } = req.params;

  const coupon = await Coupon.findById(couponId);
  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }

  // Toggle logic
  coupon.status = coupon.status === "active" ? "inactive" : "active";
  await coupon.save();
  await updateCourseFinalPrice(coupon.courseId);
  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon status updated successfully"));
});

export {
  createCoupon,
  validateCoupon,
  markCouponAsUsed,
  deleteCoupon,
  getCouponsByCourse,
  toggleCouponStatus,
};

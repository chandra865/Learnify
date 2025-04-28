import { Coupon } from "../models/coupon.model.js"; 
import { Course } from "../models/course.model.js";

export const updateCourseFinalPrice = async (courseId) => {
  const course = await Course.findById(courseId);
  if (!course) throw new Error("Course not found");

  const now = new Date();

  // 1. Get all active and non-expired coupons
  const coupons = await Coupon.find({
    courseId,
    status: "active",
    expiresAt: { $gt: now },
  });

  if (!coupons.length) {
    // 2. No valid coupons → reset to original price
    course.finalPrice = course.price;
    await course.save();
    return;
  }

  // 3. Pick the highest discount
  const bestCoupon = coupons.reduce((max, coupon) =>
    coupon.discountPercentage > max.discountPercentage ? coupon : max
  );

  const discountAmount = (course.price * bestCoupon.discountPercentage) / 100;
  const finalPrice = Math.floor(Math.max(0, course.price - discountAmount)); // no negative price

  // 4. Update the course
  course.finalPrice = finalPrice;
  await course.save();
};

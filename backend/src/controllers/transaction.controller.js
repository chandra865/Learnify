import Razorpay from "razorpay";
import crypto from "crypto";
import { Transaction } from "../models/transactionSchema.model.js";
import { Course } from "../models/course.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Cart } from "../models/cart.model.js";

const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const options = {
    amount: amount * 100, // amount in smallest currency unit
    currency: "INR",
  };

  const order = await razorpay.orders.create(options);
  //const order = true;
  //   console.log(order);
  if (!order) {
    throw new ApiError(500, "Unable to create order");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order created successfully"));
});

// const verifyPayment = asyncHandler(async (req, res) => {
//   const {
//     razorpay_order_id,
//     razorpay_payment_id,
//     razorpay_signature,
//     userId,
//     courseId,
//     amount,
//     paymentMethod,
//     discountCode,
//   } = req.body;

//   // Step 1: Verify Signature
//   const sign = razorpay_order_id + "|" + razorpay_payment_id;
//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
//     .update(sign)
//     .digest("hex");

//   const isValid = expectedSignature === razorpay_signature;
//   if (!isValid) {
//     throw new ApiError(400, "Invalid signature");
//   }

//   // Step 2: Store in DB
//   const course = await Course.findById(courseId);
//   if (!course) {
//     throw new ApiError(404, "Course not found");
//   }

//   const transaction = await Transaction.create({
//     userId,
//     courseId,
//     instructorId: course?.instructor,
//     razorpay: {
//       orderId: razorpay_order_id,
//       paymentId: razorpay_payment_id,
//       signature: razorpay_signature,
//     },
//     amount,
//     currency: "INR",
//     discountCode: discountCode || null,
//     finalPrice: amount,
//     status: "success",
//     paymentMethod,
//     courseAccessGranted: true,
//   });

//   if (!transaction) {
//     throw new ApiError(500, "Transaction not created");
//   }

//   if (transaction.courseAccessGranted) {
//     const course = await Course.findById(courseId);
//     if (!course) throw new ApiError(404, "course not found");

//     const existing = await Enrollment.findOne({
//       user: userId,
//       course: courseId,
//     });

//     if (existing) {
//       throw new ApiError(400, "You are already enrolled in this course");
//     }

//     // Create new enrollment
//     const enrollment = new Enrollment({
//       user: userId,
//       course: courseId,
//     });

//     await enrollment.save();

//     if (!enrollment) {
//       throw new ApiError(404, "enrollment not created");
//     }

//     await Course.findByIdAndUpdate(courseId, {
//       $inc: { studentenrolled: 1 },
//     });
//     await User.findByIdAndUpdate(userId, {
//       $inc: { coursesEnrolled: 1 },
//     });
//   }

//   return res
//     .status(200)
//     .json(new ApiResponse(200, transaction, "Payment verified successfully"));
// });

const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    type, // "single" or "cart"
    courseId,
    amount,
    paymentMethod,
    discountCode,
  } = req.body;

  // Step 1: Verify Razorpay Signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(sign)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;
  if (!isValid) throw new ApiError(400, "Invalid Razorpay signature");

  let courseIds = [];

  if (type === "single") {
    if (!courseId) throw new ApiError(400, "Course ID is required for single payment");
    courseIds.push(courseId);
  } else if (type === "cart") {
    const cart = await Cart.findOne({ userId }).populate("courses");
    if (!cart || cart.courses.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }

    courseIds = cart.courses.map(course => course._id);
  } else {
    throw new ApiError(400, "Invalid payment type");
  }

  // Step 2: Create Transaction
  const transaction = await Transaction.create({
    userId,
    courses: courseIds,
    razorpay: {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    },
    amount,
    currency: "INR",
    discountCode: discountCode || null,
    status: "success",
    paymentMethod,
    courseAccessGranted: true,
  });

  if (!transaction) throw new ApiError(500, "Transaction creation failed");

  // Step 3: Enroll user in courses
  for (const courseId of courseIds) {
    const course = await Course.findById(courseId);
    if (!course) continue;

    const alreadyEnrolled = await Enrollment.findOne({ user: userId, course: courseId });
    if (!alreadyEnrolled) {
      const enrollment = new Enrollment({
        user: userId,
        course: courseId,
      });

      await enrollment.save();

      await Course.findByIdAndUpdate(courseId, { $inc: { studentenrolled: 1 } });
      await User.findByIdAndUpdate(userId, { $inc: { coursesEnrolled: 1 } });
    }
  }

  // Step 4: Clear Cart (if it's a cart purchase)
  if (type === "cart") {
    await Cart.findOneAndDelete({ userId });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, transaction, "Payment verified and courses enrolled"));
});

const getUserInstructorTransactions = asyncHandler(async (req, res) => {
  const { instructorId } = req.params;

  const instructorCourses = await Course.find({ instructor: instructorId });
  const instructorCourseIds = instructorCourses.map(course => course._id.toString());
  //console.log(instructorCourseIds);
  const transactions = await Transaction.find({
    courses: { $in: instructorCourseIds },
    status: "success", // optional: only successful transactions
  }).populate("courses");

  //console.log(transactions);
  if (!transactions) {
    throw new ApiError(404, "No transactions found for this user");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, transactions, "Transactions fetched successfully")
    );
});

const getCourseTransactions = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const transactions = await Transaction.find({ courseId });
  if (!transactions) {
    throw new ApiError(404, "No transactions found for this course");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, transactions, "Transactions fetched successfully")
    );
});

const getOrderHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const transactions = await Transaction.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "courses",
      select: "title thumbnail price finalPrice",
    });

  if (!transactions) {
    return res.status(404).json(new ApiError(404, "No transactions found"));
  }

  return res.status(200).json(
    new ApiResponse(200, transactions, "Transactions fetched successfully")
  );
});

export {
  createOrder,
  verifyPayment,
  getCourseTransactions,
  getUserInstructorTransactions,
  getOrderHistory
};

import Razorpay from "razorpay";
import crypto from "crypto";
import { Transaction } from "../models/transactionSchema.model.js";
import { Course } from "../models/course.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

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

const verifyPayment = asyncHandler(async (req, res) => {
  console.log("verifyPayment called");
  console.log(req.body);
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    courseId,
    amount,
    paymentMethod,
    discountCode,
  } = req.body;

  // Step 1: Verify Signature
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
    .update(sign)
    .digest("hex");

  const isValid = expectedSignature === razorpay_signature;
  if (!isValid) {
    throw new ApiError(400, "Invalid signature");
  }

  // Step 2: Store in DB
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  const transaction = await Transaction.create({
    userId,
    courseId,
    instructorId: course?.instructor,
    razorpay: {
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    },
    amount,
    currency: "INR",
    discountCode: discountCode || null,
    finalPrice: amount,
    status: "success",
    paymentMethod,
    courseAccessGranted: true,
  });

  if (!transaction) {
    throw new ApiError(500, "Transaction not created");
  }

  if (transaction.courseAccessGranted) {
    const course = await Course.findById(courseId);
    if (!course) throw new ApiError(404, "course not found");

    if (course.enrolledStudents.includes(userId)) {
      throw new ApiError(400, "You are already enrolled in this course");
    }

    await Course.findByIdAndUpdate(
      courseId,
      {
        $push: { enrolledStudents: userId },
      },
      { new: true, runValidators: false }
    );

    const user = await User.findById(userId);
      if (!user) throw new ApiError(404, "user not found");
      user.enrolledCourses.push(courseId);
      await user.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, transaction, "Payment verified successfully"));
});

const getUserTransactions = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const transactions = await Transaction.find({ userId }).populate("courseId");

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

export {
  createOrder,
  verifyPayment,
  getCourseTransactions,
  getUserTransactions,
};

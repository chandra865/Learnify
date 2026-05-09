import mongoose from "mongoose";
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
  const { amount, type, courseId, discountCode } = req.body;
  const userId = req.user._id;

  // Check if user is already enrolled (for single course purchase)
  if (type === "single" && courseId) {
    const existingEnrollment = await Enrollment.findOne({
      user: userId,
      course: courseId,
    });
    if (existingEnrollment) {
      throw new ApiError(400, "You are already enrolled in this course");
    }
  } else if (type === "cart") {
    // Optional: Check if all courses in cart are already enrolled
    const cart = await Cart.findOne({ userId }).populate("courses");
    if (!cart || cart.courses.length === 0) {
      throw new ApiError(400, "Cart is empty");
    }
    
    const courseIdsInCart = cart.courses.map(c => c._id);
    const existingEnrollments = await Enrollment.find({
      user: userId,
      course: { $in: courseIdsInCart }
    });
    
    if (existingEnrollments.length === cart.courses.length) {
      throw new ApiError(400, "You are already enrolled in all courses in your cart");
    }
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const options = {
    amount: Math.round(amount * 100), // amount in smallest currency unit
    currency: "INR",
    notes: {
      userId: userId.toString(),
      type,
      courseId: courseId || "",
      discountCode: discountCode || "",
    }
  };

  const order = await razorpay.orders.create(options);
  if (!order) {
    throw new ApiError(500, "Unable to create order");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order created successfully"));
});

/**
 * Shared logic to process successful payment, enroll users, and ensure idempotency.
 * Now optimized for Atomicity (using Sessions) and Performance (fixing N+1 problem).
 */
const processSuccessfulPayment = async (data) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    type,
    courseId,
    amount, // amount in paise
    paymentMethod = "unknown",
    discountCode,
  } = data;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Idempotency check: Check if transaction already exists
    const existingTransaction = await Transaction.findOne({
      "razorpay.paymentId": razorpay_payment_id,
    }).session(session);

    if (existingTransaction) {
      await session.endSession();
      return existingTransaction;
    }

    let courseIds = [];
    if (type === "single") {
      if (!courseId)
        throw new ApiError(400, "Course ID is required for single payment");
      courseIds.push(courseId);
    } else if (type === "cart") {
      const cart = await Cart.findOne({ userId })
        .populate("courses")
        .session(session);
      if (!cart || cart.courses.length === 0) {
        throw new ApiError(400, "Cart is empty or already processed");
      }
      courseIds = cart.courses.map((course) => course._id);
    } else {
      throw new ApiError(400, "Invalid payment type");
    }

    // N+1 Optimization: Filter courses that need enrollment
    const existingEnrollments = await Enrollment.find({
      user: userId,
      course: { $in: courseIds },
    }).session(session);

    const enrolledCourseIds = existingEnrollments.map((e) =>
      e.course.toString()
    );
    const coursesToEnroll = courseIds.filter(
      (id) => !enrolledCourseIds.includes(id.toString())
    );

    // Create Transaction (create returns an array when session is used)
    const transactionRecord = await Transaction.create(
      [
        {
          userId,
          courses: courseIds,
          razorpay: {
            orderId: razorpay_order_id,
            paymentId: razorpay_payment_id,
            signature: razorpay_signature,
          },
          amount: amount / 100, // store in rupees
          currency: "INR",
          discountCode: discountCode || null,
          status: "success",
          paymentMethod,
          courseAccessGranted: true,
        },
      ],
      { session }
    );

    if (coursesToEnroll.length > 0) {
      // Bulk create enrollments
      await Enrollment.insertMany(
        coursesToEnroll.map((cId) => ({ user: userId, course: cId })),
        { session }
      );

      // Bulk update course student counts
      await Course.updateMany(
        { _id: { $in: coursesToEnroll } },
        { $inc: { studentenrolled: 1 } },
        { session }
      );

      // Update user enrolled courses count in one go
      await User.findByIdAndUpdate(
        userId,
        { $inc: { coursesEnrolled: coursesToEnroll.length } },
        { session }
      );
    }

    // Clear Cart (if it's a cart purchase)
    if (type === "cart") {
      await Cart.findOneAndDelete({ userId }, { session });
    }

    await session.commitTransaction();
    await session.endSession();
    
    return transactionRecord[0];
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    // Log error for debugging if needed
    console.error("Payment processing error (aborted):", error);
    throw error;
  }
};


const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    type,
    courseId,
    amount, // amount in rupees from frontend
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

  // Step 2: Use shared logic
  const transaction = await processSuccessfulPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    userId,
    type,
    courseId,
    amount: amount * 100, // convert to paise for helper
    paymentMethod,
    discountCode,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, transaction, "Payment verified and processed successfully"));
});

const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers["x-razorpay-signature"];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!signature) {
    throw new ApiError(400, "Webhook signature missing");
  }

  // Verify Webhook Signature
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    throw new ApiError(400, "Invalid webhook signature");
  }

  const payload = req.body;

  // Only handle payment.captured event
  if (payload.event === "payment.captured") {
    const payment = payload.payload.payment.entity;
    const { userId, type, courseId, discountCode } = payment.notes;

    await processSuccessfulPayment({
      razorpay_order_id: payment.order_id,
      razorpay_payment_id: payment.id,
      razorpay_signature: signature, // Webhook signature is different but we use it as placeholder or capture from payment entity if available
      userId,
      type,
      courseId: courseId || null,
      amount: payment.amount,
      paymentMethod: payment.method,
      discountCode: discountCode || null,
    });
  }

  return res.status(200).json({ status: "ok" });
});

const getUserInstructorTransactions = asyncHandler(async (req, res) => {
  const { instructorId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const instructorCourses = await Course.find({ instructor: instructorId });
  const instructorCourseIds = instructorCourses.map(course => course._id.toString());
  
  // Aggregated Stats (Total Revenue, Students, etc.)
  // Note: We compute these for ALL time because they power the dashboard cards
  const stats = await Transaction.aggregate([
    { 
      $match: { 
        courses: { $in: instructorCourseIds.map(id => new mongoose.Types.ObjectId(id)) },
        status: "success"
      } 
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$amount" },
        totalTransactions: { $sum: 1 },
        studentIds: { $addToSet: "$userId" }
      }
    }
  ]);

  const totalItems = await Transaction.countDocuments({
    courses: { $in: instructorCourseIds },
    status: "success",
  });

  const transactions = await Transaction.find({
    courses: { $in: instructorCourseIds },
    status: "success",
  })
    .populate("courses")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  if (!transactions) {
    throw new ApiError(404, "No transactions found for this instructor");
  }

  const totalPages = Math.ceil(totalItems / limit);
  const resultStats = stats[0] || { totalRevenue: 0, totalTransactions: 0, studentIds: [] };

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        list: transactions,
        stats: {
          totalRevenue: resultStats.totalRevenue,
          coursesSold: resultStats.totalTransactions,
          totalStudents: resultStats.studentIds.length
        },
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Transactions fetched successfully"
    )
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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalItems = await Transaction.countDocuments({ userId });
  const transactions = await Transaction.find({ userId })
    .sort({ createdAt: -1 })
    .populate({
      path: "courses",
      select: "title thumbnail price finalPrice",
    })
    .skip(skip)
    .limit(limit);

  if (!transactions) {
    return res.status(404).json(new ApiError(404, "No transactions found"));
  }

  const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json(
    new ApiResponse(
      200, 
      {
        list: transactions,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        }
      }, 
      "Transactions fetched successfully"
    )
  );
});

export {
  createOrder,
  verifyPayment,
  handleWebhook,
  getCourseTransactions,
  getUserInstructorTransactions,
  getOrderHistory
};

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },

  amount: {
    type: Number,
  },
  currency: { type: String, default: "INR" },
  discountCode: {
    type: String,
  },
  finalPrice: {
    type: Number,
  },

  status: {
    type: String,
    enum: ["success", "pending", "failed", "refunded"],
    default: "pending",
  },
  paymentMethod: {
    type:String,
  },

  courseAccessGranted: { type: Boolean, default: false },

},
{ timestamps: true }
);

export const Transaction = mongoose.model("Transaction", transactionSchema);
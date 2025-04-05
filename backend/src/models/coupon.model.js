import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: /^[A-Z0-9]+$/, // only capital letters and numbers
      trim: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usageLimit: {
      type: Number,
      required: true,
      min: 1,
    },
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  { timestamps: true }
);

export const Coupon = mongoose.model("Coupon", couponSchema);

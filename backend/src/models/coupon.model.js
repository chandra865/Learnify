import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      match: /^[A-Z][A-Z0-9]*[0-9]$/, // must start with letter and end with number
      trim: true,
    },
    discountPercentage: { 
      type: Number,
      required: true,
      min: 1,
      max: 100, // allow full free coupons if you want
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],  // Only allowed values
      default: "active",             // By default coupon is active
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

import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courses: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Course", 
        required: true 
      },
  ],
  totalAmount: { type: Number, default: 0 },
});

export const Cart = mongoose.model("Cart", cartSchema);

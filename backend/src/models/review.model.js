import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
},
{timestamps:true}
);


export const Review = mongoose.model('Review', reviewSchema);
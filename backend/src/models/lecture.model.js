import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
      index: true, // Faster queries
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    videoUrl: {
      publicId: { type: String, required: true }, // Cloudinary's public ID
      url: { type: String, required: true }, // Secure video URL
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFree: {
      type: Boolean,
      default: false, // Default is paid
    },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);

import mongoose, { Schema } from "mongoose";

const lectureSchema = new Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
      required: true,
    },
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    videoFileName: {
      type: String, 
    },
    videoUrl: {
      type: String,
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },
    order:{
      type:Number,
      required:true,
    },
    isFree: {
      type: Boolean,
      default: false, // Default is paid
    },
  },
  { timestamps: true }
);

export const Lecture = mongoose.model("Lecture", lectureSchema);

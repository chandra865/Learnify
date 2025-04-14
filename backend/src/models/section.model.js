import mongoose from "mongoose";

const sectionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    lectures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
    duration: {
        type: Number,
        default: 0,
        min: 0,
    },
    order:{
        type:Number,
        require:true,
    },
    published: {
        type: Boolean,
        default: false,
    },


  },
  { timestamps: true }
);

export const Section = mongoose.model("Section", sectionSchema);
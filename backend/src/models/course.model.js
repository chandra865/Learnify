import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      default: 0,
      required: true,
    },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lecture: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],

    enrolledStudents: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    reviews: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],

    thumbnail: {
      public_id: { type: String, required: true },
      url: { type: String, required: true },
    },

    whatYouWillLearn: [
      {
        type: String,
        required: true,
      },
    ],

    courseIncludes: [
      {
        type: String,
        required: true,
      },
    ],

    language: {
      type: String,
      required: true,
    },

    preview: {
      publicId: { type: String, required: true }, 
      url: { type: String, required: true },
    },

    published: { 
      type: Boolean, 
      default: false 
    }
  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);

import mongoose, { Schema } from "mongoose";

const courseSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    subtitle: {
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

    subcategory: {
      type: String,
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "AllLevels"],
      default: "Beginner",
      required: true,
    },

    price: {
      type: Number,
      default: 0,
      required: true,
    },

    finalPrice:{
      type:Number,
      default:0,
      required:true,
    },

    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentenrolled:{
        type:Number,
    },

    sections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
      },
    ],

    averageRating: {
      type: Number,
    },

    thumbnail: {
      publicId: { type: String, required: true },
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

    certificateOption: {
      type: String,
      enum: ["direct", "quiz"],
      default: "direct",
    }, 
    quiz: {
      type: Schema.Types.ObjectId,
      ref: "Quiz",
    },

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
      default: false,
    },

  },
  { timestamps: true }
);

export const Course = mongoose.model("Course", courseSchema);

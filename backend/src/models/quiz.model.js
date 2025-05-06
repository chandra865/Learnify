import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
      default: null,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
      },
    ],
    usersAttempted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    passingScore: { type: Number, default: 50 },
  },
  { timestamps: true }
);

export const Quiz = mongoose.model("Quiz", quizSchema);

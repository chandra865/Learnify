import mongoose from "mongoose";

const quizSchema = new mongoose.Schema(
  {
    title:{
        type:String,
        required: true
    },
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: "Lecture", default:null },
    course :{type:mongoose.Schema.Types.ObjectId, ref:"Course", default:null},
    questions: [
      {
        questionText: { type: String, required: true },
        options: [{ type: String, required: true }], // Multiple choice options
        correctAnswer: { type: String, required: true }, // Correct option
      },
    ],
    passingScore: { type: Number, default: 50 }, // Minimum % required to pass
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

export const Quiz = mongoose.model("Quiz", quizSchema);

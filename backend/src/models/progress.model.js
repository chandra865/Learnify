import mongoose from "mongoose";

const UserProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  completedLectures: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
  progressPercentage: { type: Number, default: 0 },
  lastAccessed: { type: Date, default: Date.now }
});

export const Progress = mongoose.model("Progress", UserProgressSchema);


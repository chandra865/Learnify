import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  startYear: { type: Number, required: true },
  endYear: { type: Number },
  description: { type: String },
});

export const Experience = mongoose.model("Experience", experienceSchema);

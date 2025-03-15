import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    startYear: { type: Number, required: true },
    endYear: { type: Number, required: true},
    cgpa: { type: Number, required: true }
  },
  { timestamps: true }
);

export const Education = mongoose.model("Education", educationSchema);

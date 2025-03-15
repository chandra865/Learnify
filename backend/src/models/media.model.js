import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    thumbnail: { 
      publicId: { type: String},
      url: { type: String,},
    },

    video: {
      publicId: { type: String, },
      url: { type: String,},
    },

    profilepic: {
      publicId: { type: String, },
      url: { type: String,},
    }
  },
  { timestamps: true }
);

export const Media = mongoose.model("Media", mediaSchema);


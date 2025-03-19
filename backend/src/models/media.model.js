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
      duration : {
        type:Number,
        default:0
      }
    },

    profilepic: {
      publicId: { type: String, },
      url: { type: String,},
    }
  },
  { timestamps: true }
);

export const Media = mongoose.model("Media", mediaSchema);


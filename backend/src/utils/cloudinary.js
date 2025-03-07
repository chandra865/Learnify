import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";
import fs from "fs";
import {config} from "dotenv";
config({
    path : "./.env"   
})


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File to Cloudinary
export const uploadToCloudinary = async (file, folder) => {
  try {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder,
    });

    if (!result || result.error) {
      throw new ApiError(500, "Cloudinary upload failed.");
    }

    return {
      public_id: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    console.error(error);
    throw new ApiError(500, "Error uploading to Cloudinary.");
  }
};

export const uploadVideo = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: "video",
      folder: "lectures", // Change folder as needed
    });

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    throw new Error("Video upload failed");
  }
};
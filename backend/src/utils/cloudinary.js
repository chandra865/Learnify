import { v2 as cloudinary } from "cloudinary";
import { ApiError } from "./ApiError.js";
import { config } from "dotenv";

config({ path: "./.env" });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Upload File to Cloudinary
export const uploadToCloudinary = async (file, type) => {
  try {
    if (!file || !file.tempFilePath) {
      throw new ApiError(400, "Invalid file upload");
    }

    const options = {
      resource_type: type === "video" ? "video" : "image", // Determine resource type
      folder: type === "video" ? "lectures" : "Course_Thumbnails",
    };

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, options);

    if (!result || result.error) {
      throw new ApiError(500, "Cloudinary upload failed.");
    }

    return {
      publicId: result.public_id,
      url: result.secure_url,
    };
  } catch (error) {
    throw new ApiError(500, `Error while uploading ${type} to Cloudinary.`);
  }
};

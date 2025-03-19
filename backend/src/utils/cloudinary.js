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
    // console.log(result);
    if (!result || result.error) {
      throw new ApiError(500, "Cloudinary upload failed.");
    }

    // Include duration only if it's a video
    const response = {
      publicId: result.public_id,
      url: result.secure_url,
    };

    if (type === "video" && result.duration) {
      response.duration = result.duration; // Add duration only for videos
    }

    return response;
  } catch (error) {
    throw new ApiError(500, `Error while uploading ${type} to Cloudinary.`);
  }
};


//Not working properly
export const getVideoDuration = async (publicId, retries = 3) => {
  try {
    for (let i = 0; i < retries; i++) {
      const result = await cloudinary.api.resource(publicId, { resource_type: "video" });
      console.log(result);
      if (result?.duration) {
        console.log("Duration:", result.duration);
        return result.duration;
      }

      console.log(`Retry ${i + 1}: Video processing, waiting...`);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }

    throw new Error("Failed to fetch video duration after retries.");
  } catch (error) {
    console.error("Error fetching video duration:", error);
    return null;
  }
};

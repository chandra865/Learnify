import { asyncHandler } from "../utils/asyncHandler.js";
import { Media } from "../models/media.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadMedia = asyncHandler(async (req, res) => {
  const { mediaType } = req.body;


  if (!req.files || !req.files.media) {
    throw new ApiError(400, "No files found");
  }

  
  // Upload file to Cloudinary
  const mediaResponse = await uploadToCloudinary(
    req.files.media,
    mediaType === "profilepic" ? "thumbnail" : mediaType
  );

  if (!mediaResponse.publicId || !mediaResponse.url) {
    throw new ApiError(500, "Something went wrong while uploading the media");
  }

  // Create new media entry if it doesn't exist (ensure both fields exist)
  const newMedia = await Media.create({
    thumbnail:
      mediaType === "thumbnail"
        ? { publicId: mediaResponse.publicId, url: mediaResponse.url }
        : { publicId: "", url: "" },
    video:
      mediaType === "video"
        ? {
            publicId: mediaResponse.publicId,
            url: mediaResponse.url,
            duration: mediaResponse.duration,
          }
        : { publicId: "", url: "" },
    profilepic:
      mediaType === "profilepic"
        ? { publicId: mediaResponse.publicId, url: mediaResponse.url }
        : { publicId: "", url: "" },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, newMedia, "Media uploaded successfully"));
});


export { uploadMedia };

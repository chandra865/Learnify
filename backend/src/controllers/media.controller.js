import {asyncHandler} from "../utils/asyncHandler.js";
import {Media} from "../models/media.model.js";
import {ApiError} from "../utils/ApiError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const uploadMedia = asyncHandler(async (req, res) => {
  const { mediaType } = req.body;

  console.log(mediaType);

  if (!req.files || !req.files.media) {
    throw new ApiError(400, "No files found");
  }

  // Upload file to Cloudinary
  const { publicId, url } = await uploadToCloudinary(
    req.files.media,
    mediaType === "profilepic"?"thumbnail":mediaType
  );

  if (!publicId || !url) {
    throw new ApiError(500, "Something went wrong while uploading the media");
  }

  // Create new media entry if it doesn't exist (ensure both fields exist)
  const newMedia = await Media.create({
    thumbnail: mediaType === "thumbnail" ? { publicId, url } : { publicId: "", url: "" },
    video: mediaType === "video" ? { publicId, url } : { publicId: "", url: "" },
    profilepic: mediaType === "profilepic" ?{ publicId, url } : { publicId: "", url: "" },
  });

  return res.status(201).json(new ApiResponse(201, newMedia, "Media uploaded successfully"));
});

export { uploadMedia };

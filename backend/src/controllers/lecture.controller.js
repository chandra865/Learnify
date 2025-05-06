import { Lecture } from "../models/lecture.model.js";
import { Section } from "../models/section.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {
  generateUploadUrl,
  deleteFolderFromS3,
} from "../utils/awsBucketConfig.js";

const createLecture = asyncHandler(async (req, res) => {
  const { title, sectionId, isFree } = req.body;

  if (!title || !sectionId) {
    throw new ApiError(400, "Missing required fields for lecture");
  }

  const lectureCount = await Lecture.countDocuments({ sectionId });

  const lecture = await Lecture.create({
    title,
    sectionId,
    isFree,
    order: lectureCount + 1,
  });

  const section = await Section.findByIdAndUpdate(sectionId, {
    $push: { lectures: lecture._id },
    $inc: { duration: lecture.duration || 0 }, // Add lecture duration to section
  });

  // If it was unpublished before and now has at least one lecture, mark it published
  if (!section.published) {
    const totalLectures = await Lecture.countDocuments({ sectionId });
    if (totalLectures > 0) {
      section.published = true;
      await section.save();
    }
  }

  return res
    .status(201)
    .json(new ApiResponse(201, lecture, "Lecture created successfully"));
});

const addVideoToLecture = asyncHandler(async (req, res) => {
  const { videoFileName, duration, lectureId, courseId, sectionId } = req.body;

  const lecture = await Lecture.findById(lectureId);

  if (!lecture) {
    throw ApiError(404, "lecture not found");
  }

  lecture.duration = duration;
  lecture.videoFileName = videoFileName;
  lecture.videoUrl = `${process.env.CLOUDFRONT_DOMAIN}/course-${courseId}/section-${sectionId}/lecture-${lectureId}/HLS/video.m3u8`;

  await lecture.save();
  const section = await Section.findByIdAndUpdate(sectionId, {
    $inc: { duration: duration || 0 }, // Add lecture duration to section
  });

  
  return res
    .status(200)
    .json(new ApiResponse(200, lecture, "video added successfully"));
});

const uploadToAwsBucket = asyncHandler(async (req, res) => {
  const { courseId, sectionId, lectureId, contentType, fileName } = req.body;

  if (!courseId || !sectionId || !lectureId || !contentType || !fileName) {
    throw new ApiError(400, "Missing required fields");
  }

  // Add a timestamp or unique ID to avoid overwrites
  const timestamp = Date.now();
  const key = `raw-videos/course-${courseId}/section-${sectionId}/lecture-${lectureId}/${timestamp}-${fileName}`;

  const uploadUrl = await generateUploadUrl({
    bucket: process.env.S3_UPLOAD_BUCKET,
    key,
    contentType,
  });

  if (!uploadUrl) {
    throw new ApiError(500, "Failed to generate upload URL");
  }

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { uploadUrl, key },
        "Upload URL generated successfully"
      )
    );
});

const getLecturesBySection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;

  const lectures = await Lecture.find({ sectionId });

  return res
    .status(200)
    .json(new ApiResponse(200, lectures, "Lectures fetched successfully"));
});

const deleteLecture = asyncHandler(async (req, res) => {
  const { lectureId, courseId, sectionId } = req.query;

  if (!courseId || !sectionId || !lectureId) {
    throw new ApiError(400, "Missing required fields");
  }

  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  // const sectionId = lecture.sectionId;
  const deletedOrder = lecture.order;

  // Remove video from lecture
  if (lecture.videoUrl) {
    const prefix = `raw-videos/course-${courseId}/section-${sectionId}/lecture-${lectureId}/`;

    //delete video from s3
    await deleteFolderFromS3({
      bucket: process.env.S3_UPLOAD_BUCKET,
      prefix,
    });

    const outputPrefix = `course-${courseId}/section-${sectionId}/lecture-${lectureId}/`;

    //delete video from s3
    await deleteFolderFromS3({
      bucket: process.env.S3_OUTPUT_BUCKET,
      prefix: outputPrefix,
    });
  }
  // Delete the lecture
  await lecture.deleteOne();

  const section = await Section.findByIdAndUpdate(sectionId, {
    $pull: { lectures: lectureId },
    $inc: { duration: -lecture.duration }, // Adjust section duration
  });

  const totalLectures = await Lecture.countDocuments({ sectionId });
  if (totalLectures === 0) {
    section.published = false;
    await section.save();
  }
  //Decrement order of lecture with higher order in the same section
  await Lecture.updateMany(
    {
      sectionId,
      order: { $gt: deletedOrder },
    },
    {
      $inc: { order: -1 },
    }
  );
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Lecture deleted successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { courseId, sectionId, lectureId } = req.query;

  // Get the lecture
  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  const prefix = `raw-videos/course-${courseId}/section-${sectionId}/lecture-${lectureId}/`;

  // Delete video folder from S3
  await deleteFolderFromS3({
    bucket: process.env.S3_UPLOAD_BUCKET,
    prefix,
  });

  const outputPrefix = `course-${courseId}/section-${sectionId}/lecture-${lectureId}/`;

  //delete video from s3
  await deleteFolderFromS3({
    bucket: process.env.S3_OUTPUT_BUCKET,
    prefix: outputPrefix,
  });

  // Update lecture: clear video data
  const updatedLecture = await Lecture.findByIdAndUpdate(
    lectureId,
    {
      $set: {
        videoUrl: null,
        videoFileName: null,
        duration: 0,
      },
    },
    { new: true }
  );

  // Also subtract duration from the section
  const section = await Section.findByIdAndUpdate(sectionId, {
    $inc: { duration: -lecture.duration || 0 },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedLecture, "Video deleted successfully"));
});

const updateLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;
  const { title } = req.body;

  const lecture = await Lecture.findByIdAndUpdate(
    lectureId,
    { title },
    { new: true }
  );

  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, lecture, "lecture updated successfully"));
});

const getLecture = asyncHandler(async(req, res) =>{
    const {lectureId} = req.params;

    const lecture = await Lecture.findById(lectureId);

    if(!lecture){
      throw new ApiError(404, "Lecture not found");
    }

    return res
    .status(200)
    .json(new ApiResponse(200, lecture, "lecture fetched succesfully"));
})

export {
  createLecture,
  getLecturesBySection,
  deleteLecture,
  updateLecture,
  addVideoToLecture,
  uploadToAwsBucket,
  deleteVideo,
  getLecture
};

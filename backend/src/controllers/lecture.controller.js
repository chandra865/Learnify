import { Lecture } from "../models/lecture.model.js";
import { Section } from "../models/section.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createLecture = asyncHandler(async (req, res) => {
  const { title, sectionId, videoFile, isFree } = req.body;

  if (!title || !sectionId || !videoFile) {
    throw new ApiError(400, "Missing required fields for lecture");
  }

  const videoData = await JSON.parse(videoFile);

  const videoIdUrl = {
    publicId: videoData.publicId,
    url: videoData.url,
  };

  const videoDuration = videoData.duration;

  const lectureCount = await Lecture.countDocuments({ sectionId });

  const lecture = await Lecture.create({
    title,
    sectionId,
    videoUrl: videoIdUrl || "",
    duration: videoDuration,
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

const getLecturesBySection = asyncHandler(async (req, res) => {
  const { sectionId } = req.params;

  const lectures = await Lecture.find({ sectionId });

  return res
    .status(200)
    .json(new ApiResponse(200, lectures, "Lectures fetched successfully"));
});

const deleteLecture = asyncHandler(async (req, res) => {
  const { lectureId } = req.params;

  const lecture = await Lecture.findById(lectureId);
  if (!lecture) {
    throw new ApiError(404, "Lecture not found");
  }

  const sectionId = lecture.sectionId;
  const deletedOrder = lecture.order;

  // Remove lecture from the section

  // Delete the lecture
  await lecture.deleteOne();

  await Section.findByIdAndUpdate(sectionId, {
    $pull: { lectures: lectureId },
    $inc: { duration: -lecture.duration }, // Adjust section duration
  });

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
export { createLecture, getLecturesBySection, deleteLecture, updateLecture };

import { Progress } from "../models/progress.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const updateProgress = asyncHandler(async (req, res) => {
  const { userId, courseId, lectureId, watchTime, totalDuration } = req.body;

  let progress = await Progress.findOne({ userId, courseId });

  if (!progress) {
    progress = await Progress.create({
      userId,
      courseId,
      completedLectures: [],
    });
  }

  if (
    watchTime / totalDuration >= 0.9 &&
    !progress.completedLectures.includes(lectureId)
  ) {
    progress.completedLectures.push(lectureId);
  }

  progress.progressPercentage = (progress.completedLectures.length / 10) * 100;
  await progress.save();

  return res
    .status(201)
    .json(new ApiResponse(200, progress, "progress Updated Successfully"));
});

const getProgress = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;

    const progress = await Progress.findOne({ userId, courseId });

    if (!progress) {
      throw new ApiError(404,"progress not found");
    }

    return res
    .status(201)
    .json(new ApiResponse(200,progress,"progress fetched successfully"));

});



export { updateProgress, getProgress };

import { Progress } from "../models/progress.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Course } from "../models/course.model.js";

const updateProgress = asyncHandler(async (req, res) => {
  const { userId, courseId, lectureId, watchTime, totalDuration } = req.body;

  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course Not Found");
  }

  const totalLecture = course.lecture.length;

  // Find or create progress document
  const progress = await Progress.findOneAndUpdate(
    { userId, courseId },
    {
      ...(watchTime / totalDuration >= 0.9
        ? { $addToSet: { completedLectures: lectureId } }
        : {}), // Only add lecture if it's completed
    },
    { new: true, upsert: true }
  );

  // Recalculate progress percentage after update
  const updatedProgress = await Progress.findOne({ userId, courseId });
  updatedProgress.progressPercentage =
    (updatedProgress.completedLectures.length / totalLecture) * 100;
  await updatedProgress.save();

  return res.status(201).json(new ApiResponse(200, updatedProgress, "Progress Updated Successfully"));
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

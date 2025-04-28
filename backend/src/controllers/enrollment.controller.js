import { Enrollment } from "../models/enrollment.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// Get enrollments for a user
const getUserEnrollments = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const enrollments = await Enrollment.find({ user: userId })
    .populate("course", "title description thumbnail")
    .populate("progress.completedLectures");

  // const enrollments = await Enrollment.find({ user: userId }).populate({
  //   path: "course",
  //   select: "title description thumbnail instructor",
  //   populate: {
  //     path: "instructor",
  //     select: "name",
  //   },
  // });

  if (!enrollments) {
    throw new ApiError(404, "enrollments not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, enrollments, "enrollments fetch successfully"));
});

// Mark a lecture as completed
const completeLecture = asyncHandler(async (req, res) => {
  const { userId, courseId, lectureId } = req.body;

  const enrollment = await Enrollment.findOne({
    user: userId,
    course: courseId,
  });

  if (!enrollment) {
    throw new ApiError(404, "enrollments not found");
  }

  if (!enrollment.progress.completedLectures.includes(lectureId)) {
    enrollment.progress.completedLectures.push(lectureId);
    await enrollment.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Complete Marked Successfully"));
});

//check user is enrolled or not
const checkUserEnrollment = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;
  const existing = await Enrollment.findOne({ user: userId, course: courseId });

  if (existing) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { enrollmentStatus: true }, "user is enrolled")
      );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, { enrollmentStatus: false }, "user is not enrolled")
    );
});

//give how many student enrolled in a particular course
const getEnrollmentCountForCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const count = await Enrollment.countDocuments({ course: courseId });

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { courseId, enrolledUsers: count },
        "enrolled student find successfully"
      )
    );
});

//give a user enrolled in how many courses
const getEnrolledCourseCountForUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const count = await Enrollment.countDocuments({ user: userId });

  res
    .status(200)
    .json(new ApiResponse(200, { userId, enrolledCourses: count }, ""));
});

// Controller function to fetch all courses the user is enrolled in
const getEnrolledCourses = asyncHandler(async (req, res) => {
  const { userId } = req.params; // Get the userId from the URL parameters

  // Find all enrollments for the user
  const enrollments = await Enrollment.find({ user: userId }).populate({
    path:"course",
    select : "",
    populate: {
        path: "instructor",
        select: "name",
    },
  }
  );

  if (!enrollments || enrollments.length === 0) {
    throw new ApiError(404, "No courses found for this user.");
  }

  // Extract the course details from the populated enrollments
  const courses = enrollments.map((enrollment) => enrollment.course);

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "courses fetched successfully"));
});
export {
  getUserEnrollments,
  completeLecture,
  getEnrollmentCountForCourse,
  getEnrolledCourseCountForUser,
  checkUserEnrollment,
  getEnrolledCourses,
};

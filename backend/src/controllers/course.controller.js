import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { Media } from "../models/media.model.js";
import { getVideoDuration } from "../utils/cloudinary.js";

const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    category,
    price,
    whatYouWillLearn,
    courseIncludes,
    language,
    thumbnail,
    videoFile,
  } = req.body;

  // console.log(req.body);
  // console.log(thumbnail);
  // console.log(videoFile);
  // console.log(req.files);

  if (
    !title ||
    !description ||
    !category ||
    !price ||
    !language ||
    !thumbnail ||
    !videoFile
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Instructor ID from logged-in user
  const instructor = req.user._id;

  const thumbnailData = await JSON.parse(thumbnail);
  const videoFileData = await JSON.parse(videoFile);

  const videoIdUrl = {
    publidId : videoFileData.publicId,
    url : videoFileData.url
  };
  // Create Course with Thumbnail
  const course = await Course.create({
    title,
    description,
    category,
    price,
    instructor,
    whatYouWillLearn: whatYouWillLearn ? whatYouWillLearn.split(",") : [],
    courseIncludes: courseIncludes ? courseIncludes.split(",") : [],
    language,
    thumbnail: thumbnailData,
    preview: videoIdUrl,
  });

  if (!course) {
    throw new ApiError(500, "Something went wrong while creating the course.");
  }

  // Associate course with the instructor
  const user = await User.findById(instructor);
  if (user) {
    user.createdCourses.push(course._id);
    await user.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course Created Successfully"));
});

const getCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "course not found");

  return res
    .status(201)
    .json(new ApiResponse(200, course, "Course fetched successfully"));
});

const addLecture = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { title, isFree, videoFile } = req.body; // Added isFree field
  // Check if course exists
  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const videoData = await JSON.parse(videoFile);

  const videoIdUrl = {
    publicId : videoData.publicId,
    url : videoData.url
  }

  const videoDuration = videoData.duration;
  // Create new lecture
  const newLecture = await Lecture.create({
    course: courseId,
    title,
    videoUrl: videoIdUrl, // Stores { publicId, url }
    isFree: isFree ?? false, // Default to false if not provided
    duration: videoDuration,
  });
  // console.log(newLecture);
  await Course.findByIdAndUpdate(
    courseId,
    { $push: { lecture: newLecture._id } },
    { new: true }
  );

    // // Add lecture to course
    // course.lecture.push(newLecture._id), await course.save({ validateBeforeSave: false });

  return res
    .status(201)
    .json(
      new ApiResponse(201, { course, newLecture }, "Lecture added successfully")
    );
});

const instructorCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("createdCourses");

  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.createdCourses, "Courses fetched successfully")
    );
});

const courseEnrollment = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "course not found");

  if (course.enrolledStudents.includes(req.user._id)) {
    throw new ApiError(400, "You are already enrolled in this course");
  }

  course.enrolledStudents.push(req.user._id);
  await course.save();

  const user = await User.findById(req.user._id);
  if (!user) throw new ApiError(404, "user not found");
  user.enrolledCourses.push(courseId);
  await user.save();

  return res
    .status(201)
    .json(new ApiResponse(200, course, "Course enrollment successfully"));
});

const stuCourses = asyncHandler(async (req, res) => {
  // Fetch user and populate enrolledCourses with full course details
  const user = await User.findById(req.user._id).populate("enrolledCourses");

  if (!user) throw new ApiError(404, "User not found");

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.enrolledCourses, "Courses fetched successfully")
    );
});

const getAllCourses = asyncHandler(async (req, res) => {
  const course = await Course.find({});

  if (!course) throw new ApiError(404, "failed to fetch course");
  return res
    .status(201)
    .json(new ApiResponse(200, course, "Courses fetched successfully"));
});

const getLectures = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lecture");

    if (!course) {
      return next(new ApiError(404, "Course not found"));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { lectures: course.lecture },
          "Lectures fetched successfully"
        )
      );
  } catch (error) {
    next(new ApiError(500, error.message || "Server Error"));
  }
};

const publishCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    // Toggle publish status
    course.published = !course.published;
    await course.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { published: course.published },
          "Course publish status updated successfully"
        )
      );
  } catch (error) {
    next(new ApiError(500, error.message || "Internal Server Error"));
  }
};

const updateCourse = async (req, res) => {
  const { courseId } = req.params;

  const {
    title,
    description,
    category,
    price,
    whatYouWillLearn,
    courseIncludes,
    language,
    thumbnail,
    videoFile,
  } = req.body;

  // console.log(req.body);
  // console.log(thumbnail);
  // console.log(videoFile);
  // console.log(req.files);

  if (!title || !description || !category || !price || !language) {
    throw new ApiError(400, "All fields are required");
  }

  // console.log("nthumbnail:-", thumbnail);
  // console.log("nvideo", videoFile);

  const thumbnailData = await JSON.parse(thumbnail);
  const videoFileData = await JSON.parse(videoFile);

  console.log("thumbnail:-", thumbnailData);
  console.log("video:-", videoFileData);

  // Handle file uploads if present
  let updatedFields = {
    title,
    description,
    category,
    price,
    language,
    whatYouWillLearn: whatYouWillLearn ? whatYouWillLearn.split(",") : [],
    courseIncludes: courseIncludes ? courseIncludes.split(",") : [],
    thumbnail: thumbnailData,
    preview: videoFileData,
  };

  // Find and update the course
  const updatedCourse = await Course.findByIdAndUpdate(
    courseId,
    updatedFields,
    { new: true }
  );

  if (!updatedCourse) {
    throw new ApiError(404, "Course not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedCourse, "Course updated successfully"));
};

export {
  createCourse,
  addLecture,
  instructorCourses,
  courseEnrollment,
  stuCourses,
  getAllCourses,
  getCourse,
  getLectures,
  publishCourse,
  updateCourse,
};

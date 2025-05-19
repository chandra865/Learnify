import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";
import { Media } from "../models/media.model.js";
import { getVideoDuration } from "../utils/cloudinary.js";
import { Quiz } from "../models/quiz.model.js";
import { Section } from "../models/section.model.js";

const createCourse = asyncHandler(async (req, res) => {
  const {
    title,
    subtitle,
    description,
    category,
    subcategory,
    level,
    price,
    whatYouWillLearn,
    courseIncludes,
    language,
    thumbnail,
    videoFile,
    certificateOption 
  } = req.body;

  if (
    !title ||
    !subtitle ||
    !description ||
    !category ||
    !subcategory ||
    !level ||
    !price ||
    !language ||
    !thumbnail ||
    !videoFile ||
    !certificateOption
  ) {
    throw new ApiError(400, "All fields are required");
  }

  // Instructor ID from logged-in user
  const instructor = req.user._id;

  const thumbnailData = await JSON.parse(thumbnail);
  const videoFileData = await JSON.parse(videoFile);

  const videoIdUrl = {
    publicId: videoFileData.publicId,
    url: videoFileData.url,
  };


  // Create Course with Thumbnail
  const course = await Course.create({
    title,
    subtitle,
    description,
    category,
    price,
    instructor,
    whatYouWillLearn: whatYouWillLearn ? whatYouWillLearn.split(",") : [],
    courseIncludes: courseIncludes ? courseIncludes.split(",") : [],
    language,
    subcategory,
    level,
    thumbnail: thumbnailData,
    preview: videoIdUrl,
    certificateOption,
    finalPrice:price,
  });

  if (!course) {
    throw new ApiError(500, "Something went wrong while creating the course.");
  }

  // Associate course with the instructor
  // const user = await User.findById(instructor);
  // if (user) {
  //   user.createdCourses.push(course._id);
  //   await user.save();
  // }

  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course Created Successfully"));
});

const getCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId).populate("instructor", "name profilePicture bio");
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
    publicId: videoData.publicId,
    url: videoData.url,
  };

  const videoDuration = videoData.duration;
  // Create new lecture
  const newLecture = await Lecture.create({
    course: courseId,
    title,
    videoUrl: videoIdUrl, // Stores { publicId, url }
    isFree: isFree ?? false, // Default to false if not provided
    duration: videoDuration,
  });
 
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
  const instructorId = req.user._id;

  const courses = await Course.find({ instructor: instructorId });

  if (!courses || courses.length === 0) {
    throw new ApiError(404, "No courses found for this instructor");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});

//not using because we do this is payment
const courseEnrollment = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "course not found");

  if (course.enrolledStudents.includes(req.user._id)) {
    throw new ApiError(400, "You are already enrolled in this course");
  }

  await Course.findByIdAndUpdate(
    courseId,
    {
      $push: { enrolledStudents: req.user._id },
    },
    { new: true, runValidators: false }
  );

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
  const course = await Course.find({}).populate("instructor","name profilePicture bio");

  if (!course) throw new ApiError(404, "failed to fetch course");
  return res
    .status(201)
    .json(new ApiResponse(200, course, "Courses fetched successfully"));
});

// Function to handle quiz completion
const completeQuiz = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user._id;

  // Find the quiz for the course
  const quiz = await Quiz.findOne({ course: courseId });

  if (!quiz) {
    throw new ApiError(404, "Quiz not found for this course");
  }

  // Check if user already completed the quiz
  const alreadyAttempted = quiz.usersAttempted.includes(userId);

  if (alreadyAttempted) {
    throw new ApiError(400, "You have already completed the quiz for this course");
  }

  // Add user to attempted list
  quiz.usersAttempted.push(userId);
  await quiz.save();

  return res
    .status(200)
    .json(new ApiResponse(200, quiz, "Quiz completed successfully"));
});

const getLectures = asyncHandler (async (req, res) => {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lecture");

    if (!course) {
      throw new ApiError(404, "Course not found");
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
});

const changePublishStatus = asyncHandler( async (req, res) => {

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
  
});

const updateCourse = asyncHandler(async (req, res) => {
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
    certificateOption
  } = req.body;

 
 

  if (!title || !description || !category || !price || !language ||!certificateOption) {
    throw new ApiError(400, "All fields are required");
  }


  const thumbnailData = await JSON.parse(thumbnail);
  const videoFileData = await JSON.parse(videoFile);


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
    certificateOption
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
});

const courseRecommend = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }
  // Find courses with similar categories or tags
  const recommendedCourses = await Course.find({
    _id: { $ne: course._id }, // Exclude the selected course
    published:true,
    $or: [{ category: course.category }, { subcategory: course.subcategory }],
  }).limit(8); // Limit recommendations

  return res
    .status(200)
    .json(
      new ApiResponse(
        201,
        recommendedCourses,
        "recommeded course fetched successfully"
      )
    );
});

const courseSearch = asyncHandler(async (req, res) => {
  const { title, rating, price, language } = req.query;

  let query = {};

  if (language) query.language = language;
  if (rating) query.averageRating = { $gte: Number(rating) };
  if (price) query.price = { $gte: Number(price) };

  // Flexible search logic for 'title'
  if (title) {
    const words = title.trim().split(/\s+/); // Split by whitespace
    query.$or = [];

    for (const word of words) {
      const regex = new RegExp(word, "i"); // Case-insensitive partial match
      query.$or.push(
        { title: { $regex: regex } },
        { subtitle: { $regex: regex } },
        { category: { $regex: regex } },
        { subcategory: { $regex: regex } }
      );
    }
  }

  const courses = await Course.find(query)
    .populate("instructor", "name") // Only show instructor name
    .exec();

  if (!courses.length) {
    throw new ApiError(404, "Courses Not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses fetched successfully"));
});


export {
  createCourse,
  addLecture,
  instructorCourses,
  courseEnrollment,
  stuCourses,
  getAllCourses,
  getCourse,
  getLectures,
  changePublishStatus,
  updateCourse,
  courseRecommend,
  courseSearch,
  completeQuiz
};

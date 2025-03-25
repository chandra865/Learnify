import { Quiz } from "../models/quiz.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Lecture } from "../models/lecture.model.js";
import { Course } from "../models/course.model.js";
// Create a new quiz
const createQuiz = asyncHandler(async (req, res) => {
  const { title, lectureId, courseId, questions, passingScore } = req.body;
  const { quizFor } = req.query; // "lecture" or "course"

  // Validate query parameter
  if (quizFor !== "lecture" && quizFor !== "course") {
    throw new ApiError(400,"Invalid quizFor value. Use 'lecture' or 'course'." );
  }

  if (!title || !questions || !questions.length) {
    throw new ApiError(400, "Lecture and questions are required");
  }


  // Ensure the correct ID is provided based on `quizFor`
  if (quizFor === "lecture" && !lectureId) {
    throw new ApiError(400,"Lecture ID is required for a lecture-level quiz.");
  }
  if (quizFor === "course" && !courseId) {
    throw new ApiError(400,"Course ID is required for a course-level quiz.");
  }

  // Create the quiz
  const newQuiz = new Quiz({
    title,
    lecture: quizFor === "lecture" ? lectureId : null,
    course: quizFor === "course" ? courseId : null,
    questions,
    passingScore: passingScore || 50,
  });
  await newQuiz.save();


  if (quizFor === "lecture") {
    await Lecture.findByIdAndUpdate(
      lectureId,
      { $push: { quiz: newQuiz._id } },
      { new: true }
    );
  }
//   console.log(quizFor);
  if (quizFor === "course") {
    await Course.findByIdAndUpdate(
      courseId,
      { $push: { quiz: newQuiz._id } },
      { new: true}
    );
  }

  return res
    .status(201)
    .json(new ApiResponse(200, newQuiz, "Quiz created successfully"));
});

//Get all quizzes
const getAllQuizzes = asyncHandler(async (req, res) => {
  const { quizFor } = req.query;
  const { Id } = req.params; // Extract lectureId from URL params

  if (!quizFor || !Id) {
    throw new ApiError(400, "Lecture ID is required");
  }

  let quizzes;
  if(quizFor === "lecture"){
    quizzes = await Quiz.find({ lecture: Id});
  }else{
    quizzes = await Quiz.find({ course: Id});
  }
  

  return res
    .status(200)
    .json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});

// Get a single quiz by ID
const getQuizById = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const quiz = await Quiz.findById(quizId).populate("lecture", "title");

  if (!quiz) throw new ApiError(404, "Quiz not found");

  return res
    .status(201)
    .json(new ApiError(200, quiz, "quiz fetched succesfully"));
});

// Update a quiz
const updateQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;
  const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, req.body, {
    new: true,
  });

  if (!updatedQuiz) throw new ApiError(404, "Quiz not found");

  return res
    .status(201)
    .json(new ApiResponse(200, updatedQuiz, "Quiz updated successfully"));
});

// Delete a quiz
const deleteQuiz = asyncHandler(async (req, res) => {
  const { quizId } = req.params;

  const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
  if (!deletedQuiz) throw new ApiError(404, "Quiz not found");

  // Remove quiz reference from the lecture
  await Lecture.findByIdAndUpdate(
    deletedQuiz.lecture._id,
    { $pull: { quiz: quizId } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Quiz Deleted Successfully"));
});

export { createQuiz, deleteQuiz, updateQuiz, getQuizById, getAllQuizzes };

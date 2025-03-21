import { Quiz } from "../models/quiz.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Lecture } from "../models/lecture.model.js";

// Create a new quiz
const createQuiz = asyncHandler( async (req, res) => {
    const { title, lecture, questions, passingScore } = req.body;

    if (!title || !lecture || !questions || questions.length === 0) {
      throw new ApiError(400,"Lecture and questions are required");
    }

    const newQuiz = new Quiz({title, lecture, questions, passingScore });
    await newQuiz.save();

    await Lecture.findByIdAndUpdate(
        lecture,
        { $push: { quiz: newQuiz._id } },
        { new: true, useFindAndModify: false }
      );
    return res
    .status(201)
    .json(new ApiResponse(200,newQuiz, "Quiz created successfully"))
});

//Get all quizzes
const getAllQuizzes = asyncHandler(async (req, res) => {
    const { lectureId } = req.params; // Extract lectureId from URL params

    if (!lectureId) {
        throw new ApiError(400, "Lecture ID is required");
    }

    const quizzes = await Quiz.find({ lecture: lectureId });

    return res
        .status(200)
        .json(new ApiResponse(200, quizzes, "Quizzes fetched successfully"));
});


// Get a single quiz by ID
const getQuizById = asyncHandler( async (req, res) => {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate("lecture", "title");

    if (!quiz) throw new ApiError(404,"Quiz not found");

    return res
    .status(201)
    .json(new ApiError(200,quiz,"quiz fetched succesfully"));
});

// Update a quiz
const updateQuiz = asyncHandler( async (req, res) => {
    const { quizId } = req.params;
    const updatedQuiz = await Quiz.findByIdAndUpdate(quizId, req.body, { new: true });

    if (!updatedQuiz) throw new ApiError(404,"Quiz not found");

    return res
    .status(201)
    .json(new ApiResponse(200,updatedQuiz, "Quiz updated successfully", ));
});

// Delete a quiz
const deleteQuiz = asyncHandler(async (req, res) => {
    const { quizId } = req.params;

    const deletedQuiz = await Quiz.findByIdAndDelete(quizId);
    if (!deletedQuiz) throw new ApiError(404, "Quiz not found");

    // Remove quiz reference from the lecture
    await Lecture.findByIdAndUpdate(
        deletedQuiz.lecture._id,
        { $pull: { quiz  : quizId } },
        { new: true }
    );

    return res
        .status(200)
        .json(new ApiResponse(200, "", "Quiz Deleted Successfully"));
});


export{
    createQuiz,
    deleteQuiz,
    updateQuiz,
    getQuizById,
    getAllQuizzes,
}

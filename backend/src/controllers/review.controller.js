import { Review } from "../models/review.model.js";
import { Course } from "../models/course.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const addReview = asyncHandler(async (req, res) => {
  const { courseId, rating, comment } = req.body;
  const userId = req.user.id; // Assuming authentication middleware

  const newReview = await Review.create({ courseId, userId, rating, comment });
  if (!newReview) {
    throw new ApiError(400, "review not created");
  }
  // Update course average rating
  const reviews = await Review.find({ courseId });
  if (!reviews) {
    throw new ApiError(404, "review not found");
  }
  const avgRating =
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  await Course.findByIdAndUpdate(courseId, { averageRating: avgRating });

  return res.status(201).json(new ApiResponse(201, newReview, "Review added"));
});

const getCourseReviews = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const totalItems = await Review.countDocuments({ courseId });
  const reviews = await Review.find({ courseId })
    .populate("userId", "name profilePicture.url")
    .skip(skip)
    .limit(limit);

  if (!reviews) {
    throw new ApiError(404, "Reveiw not found");
  }

  const totalPages = Math.ceil(totalItems / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        list: reviews,
        pagination: {
          totalItems,
          totalPages,
          currentPage: page,
          limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      "Review fetched successfully"
    )
  );
});

const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "review not found");
  }

  if (review.userId.toString() !== req.user.id) {
    throw new ApiError(403, "not authorized to delete review");
  }

  await review.remove();

  return res.status(200).json(201, "", "Review deleted");
});

export { addReview, getCourseReviews, deleteReview };

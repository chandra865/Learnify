import { Cart } from "../models/cart.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Course } from "../models/course.model.js";
import { User } from "../models/user.model.js";

const addCart = asyncHandler(async (req, res) => {
  const { userId, courseId, price } = req.body;

  let cart = await Cart.findOne({ userId });

  if (!cart) {
    cart = await Cart.create({ userId, courses: [], totalAmount: 0 });
  }

  // Prevent duplicate courses in cart
  const isAlreadyInCart = cart.courses.some(
    (c) => c.toString() === courseId.toString()
  );

  if (!isAlreadyInCart) {
    cart.courses.push(courseId);
    cart.totalAmount += price;
    await cart.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Course added to cart"));
});


const getCart = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Find cart by userId and optionally populate course details
  const cart = await Cart.findOne({ userId }).populate("courses");

  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});


const removeFromCart = asyncHandler(async (req, res) => {
  const { userId, courseId } = req.params;

  if (!userId || !courseId) {
    throw new ApiError(400, "Missing userId or courseId");
  }

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    throw new ApiError(404, "Cart not found");
  }

  // Check if course exists in cart
  const isInCart = cart.courses.some(
    (course) => course.toString() === courseId
  );

  if (!isInCart) {
    throw new ApiError(404, "Course not found in cart");
  }

  // Get course price from DB
  const course = await Course.findById(courseId);
  if (!course) {
    throw new ApiError(404, "Course not found");
  }

  // Remove course from cart
  cart.courses = cart.courses.filter(
    (course) => course.toString() !== courseId
  );

  // Subtract price from totalAmount
  cart.totalAmount -= course.price;
  if (cart.totalAmount < 0) cart.totalAmount = 0; // just in case

  await cart.save();

  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Item removed from cart successfully"));
});


export { addCart, getCart, removeFromCart};

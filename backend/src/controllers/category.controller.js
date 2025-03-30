import Category from "../models/category.model.js";
import mongoose from "mongoose";
import { categories } from "../Data/categoryData.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
const seedCategories = async () => {
  
  const existingCategories = await Category.countDocuments();
  if (categories.length === existingCategories) {
    console.log("Categories already exist, skipping seeding.");
    return;
  }

  try {
    await Category.deleteMany(); // Clears old data
    await Category.insertMany(categories);
    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
};

const getAllCategories = asyncHandler( async (req, res) => {
   
      const categories = await Category.find();
      if(!categories){
        throw new ApiError(404, "Categories not found");
      }
      return res
        .status(200)
        .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

export {
    seedCategories,
    getAllCategories
};


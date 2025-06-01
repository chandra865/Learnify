import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Education } from "../models/Education.js";
import jwt from "jsonwebtoken";
import { Experience } from "../models/Experience.js";
import passport from "passport";
import { Course } from "../models/course.model.js";
import { Enrollment } from "../models/enrollment.model.js";
import { Review } from "../models/review.model.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check required fields
  if ([email, password].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }

  // Generate a name from email
  let rawName = email.split("@")[0];
  let cleanName = rawName.replace(/[^a-zA-Z]/g, "");
  let name = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);

  // Check if user exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.emailVerified) {
      throw new ApiError(
        409,
        "User with this email already exists and is verified"
      );
    } else {
      // Overwrite existing unverified user’s password and name
      existingUser.password = password;
      existingUser.name = name;
      await existingUser.save();
    }
  } else {
    // Create new user
    await User.create({
      name,
      email,
      password,
      role: "student",
    });
  }

  const user = await User.findOne({ email }).select("-password -refreshToken");

  return res
    .status(201)
    .json(
      new ApiResponse(
        200,
        user,
        "User Registered Successfully. Please verify OTP."
      )
    );
});

const switchUserRole = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { newRole } = req.body;

  if (!["student", "instructor"].includes(newRole)) {
    throw new ApiError(400, "Invalid role switch request");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(403, "Cannot change role of admin");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { role: newRole },
    { new: true, runValidators: true }
  );

  res
    .status(200)
    .json(new ApiResponse(200, updatedUser, `Role changed to ${newRole}`));
});

const getCurrUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, loggedInUser, "User fetched Successfully"));
});

const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

const googleAuthCallback = asyncHandler(async (req, res) => {
  const { user } = req.user;
  const { accessToken, refreshToken } = req.user.tokens;
  if (!user || !accessToken || !refreshToken) {
    return res.redirect(`${process.env.CORS_ORIGIN}/login`); //?error=AuthenticationFailed
  }
  // if (!user || !accessToken || !refreshToken) {
  //   throw new ApiError(401,`Authentication failed ${user} ${accessToken} ${refreshToken}}`);
  // }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

  return res.redirect(`${process.env.CORS_ORIGIN}`);
});

const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  //username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie

  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "role, email and password is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }
  if (!user.emailVerified) {
    throw new ApiError(401, "Email is not verified");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "User Password does not match");
  }

  //if role not matched
  // if (user.role !== role) {
  //   throw new ApiError(401, "Invalid User role");
  // }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only true in production (HTTPS)
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Important!
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  // clear cookies
  // clear refreshToken and accessToken

  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Only true in production (HTTPS)
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Important!
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const addEducation = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract from JWT
  const { degree, institution, startYear, endYear, cgpa } = req.body;

  if (!degree || !institution || !startYear || !endYear || !cgpa) {
    throw new ApiError(400, "All field are required");
  }
  const education = await Education.create({
    user: userId,
    degree,
    institution,
    startYear,
    endYear,
    cgpa,
  });

  if (!education) {
    throw new ApiError(500, "something went worng while adding education");
  }

  const user = await User.findByIdAndUpdate(userId, {
    $push: { education: education._id },
  });

  if (!user) {
    throw new ApiError(500, "error while adding education in user");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(201)
    .json(new ApiResponse(201, loggedInUser, "Education Added Successfully"));
});

const updateEducation = asyncHandler(async (req, res) => {
  const { educationId } = req.params;
  const { degree, institution, startYear, endYear, cgpa } = req.body;

  if (!degree || !institution || !startYear || !endYear || !cgpa) {
    throw new ApiError(400, "All field are required");
  }
  const updatedEducation = await Education.findByIdAndUpdate(
    educationId,
    {
      degree,
      institution,
      startYear,
      endYear,
      cgpa,
    },
    { new: true }
  );

  if (!updatedEducation) {
    throw ApiError(404, "Education not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedEducation, "Education is updated"));
});

const deleteEducation = asyncHandler(async (req, res) => {
  const { educationId } = req.params;
  const userId = req.user._id; // Assuming authentication middleware sets `req.user`

  // Find the education record
  const education = await Education.findById(educationId);
  if (!education) {
    throw new ApiError(404, "Education not found");
  }

  // Check if the education belongs to the logged-in user
  if (education.user.toString() !== userId.toString()) {
    throw new ApiError(403, "not authorized to delete this education");
  }

  // Delete education record
  await Education.findByIdAndDelete(educationId);

  // Remove education reference from User model
  await User.findByIdAndUpdate(userId, {
    $pull: { education: educationId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Education deleted successfully"));
});

const getEducation = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming authentication middleware sets req.user
  const user = await User.findById(userId).populate("education");

  if (!user) {
    throw new ApiError(404, "Inside user education not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.education, "Education fetched succesfully")
    );
});

const addExperience = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract from JWT

  const { jobTitle, company, startYear, endYear, description } = req.body;

  if (!jobTitle || !company || !startYear || !endYear) {
    throw new ApiError(400, "All field are required");
  }

  const experience = await Experience.create({
    user: userId,
    jobTitle,
    company,
    startYear,
    endYear,
    description,
  });

  if (!experience) {
    throw new ApiError(500, "something went worng while adding education");
  }

  const user = await User.findByIdAndUpdate(userId, {
    $push: { experience: experience._id },
  });

  if (!user) {
    throw new ApiError(500, "error while adding education in user");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(201)
    .json(new ApiResponse(201, loggedInUser, "experience Added Successfully"));
});

const updateExperience = asyncHandler(async (req, res) => {
  const { experienceId } = req.params;

  const { jobTitle, company, startYear, endYear, description } = req.body;

  if (!jobTitle || !company || !startYear || !endYear) {
    throw new ApiError(400, "All field are required");
  }
  const updatedExperience = await Experience.findByIdAndUpdate(
    experienceId,
    {
      jobTitle,
      company,
      startYear,
      endYear,
      description,
    },
    { new: true }
  );

  if (!updatedExperience) {
    throw ApiError(404, "Experience not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedExperience, "Experience is updated"));
});

const getExperience = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Assuming authentication middleware sets req.user
  const user = await User.findById(userId).populate("experience");

  if (!user) {
    throw new ApiError(404, "Inside user experience not found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, user.experience, "Experience fetched succesfully")
    );
});

// Delete Experience Controller
const deleteExperience = asyncHandler(async (req, res) => {
  const { experienceId } = req.params;
  const userId = req.user._id; // Assuming authentication middleware sets `req.user`

  // Find the experience record
  const experience = await Experience.findById(experienceId);
  if (!experience) {
    throw new ApiError(404, "experience not found");
  }

  // Check if the experience belongs to the logged-in user
  if (experience.user.toString() !== userId.toString()) {
    throw new ApiError(403, "not authorized to delete this experience");
  }

  // Delete experience record
  await Experience.findByIdAndDelete(experienceId);

  // Remove education reference from User model
  await User.findByIdAndUpdate(userId, {
    $pull: { experience: experienceId },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "", "experience deleted successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only true in production (HTTPS)
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Important!
    };

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken: accessToken,
            refreshToken: newRefreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const updateProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id; // Assuming user ID is extracted from JWT middleware
  const { name, profilePicture, bio, socialLinks } = req.body;

  const newProfilePicture = await JSON.parse(profilePicture);
  const newSocialLinks = await JSON.parse(socialLinks);

  // Update fields
  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        name,
        profilePicture: newProfilePicture,
        bio,
        socialLinks: newSocialLinks,
      },
    },
    { new: true, runValidators: true } // Return updated user & validate fields
  );

  if (!updatedUser) {
    throw new ApiError(404, "User not found");
  }

  const loggedInUser = await User.findById(updatedUser._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, loggedInUser, "User Profile Updated Successfully")
    );
});

// Add expertise
const addExpertise = asyncHandler(async (req, res) => {
  const { expertise } = req.body;
  const userId = req.user._id;

  if (!expertise) {
    throw new ApiError(400, "expertise is required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.expertise.includes(expertise)) {
    throw new ApiError(400, "Skill already exits");
  }

  user.expertise.push(expertise);
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, user.expertise, "Expertise added successfully"));
});

// Delete expertise
const deleteExpertise = asyncHandler(async (req, res) => {
  const { expertise } = req.query;
  const userId = req.user._id;

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const expertiesIndex = user.expertise.indexOf(expertise);
  if (expertiesIndex === -1) {
    throw new ApiError(400, "Skill not found");
  }

  user.expertise.splice(expertiesIndex, 1);
  await user.save();

  return res
    .status(200)
    .json(new ApiError(200, user.expertise, "expertise removed successfully"));
});

// get experties

const getExperties = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  res
    .status(200)
    .json(
      new ApiResponse(200, user.expertise, "exprtise fetched successfully")
    );
  res.json({ skills: user.skills });
});

const getInstructorStats = asyncHandler(async (req, res) => {
  const { instructorId } = req.params;

  if (!instructorId) {
    throw new ApiError(400, "Instructor ID is required");
  }

  // 1. Get all courses created by instructor
  const courses = await Course.find({ instructor: instructorId }).select("_id");
  const courseIds = courses.map((c) => c._id);
  const courseCount = courseIds.length;

  if (courseCount === 0) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalCourses: 0,
          totalStudents: 0,
        },
        "No courses found for this instructor"
      )
    );
  }

  // 2. Get enrollments for these courses
  const enrollments = await Enrollment.find({
    course: { $in: courseIds },
  }).select("user");

  // 3. Get unique students
  const studentIds = new Set(enrollments.map((e) => e.user.toString()));
  const totalStudents = studentIds.size;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalCourses: courseCount,
        totalStudents,
      },
      "Instructor stats fetched successfully"
    )
  );
});

const getInstructorRatingAndReviews = asyncHandler(async (req, res) => {
  const { instructorId } = req.params;

  if (!instructorId) {
    throw new ApiError(400, "Instructor ID is required");
  }

  // Step 1: Find all courses by this instructor
  const courses = await Course.find({ instructor: instructorId }).select("_id");

  if (!courses.length) {
    return res
      .status(404)
      .json(new ApiResponse(404, {}, "No courses found for this instructor"));
  }

  const courseIds = courses.map((course) => course._id);

  // Step 2: Find all reviews for these courses
  const reviews = await Review.find({ courseId: { $in: courseIds } });

  if (!reviews.length) {
    return res.status(200).json(
      new ApiResponse(
        200,
        {
          totalReviews: 0,
          averageRating: 0,
        },
        "No reviews found for this instructor"
      )
    );
  }

  // Step 3: Calculate total reviews and average rating
  const totalReviews = reviews.length;
  const averageRating =
    reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews;

  res.status(200).json(
    new ApiResponse(
      200,
      {
        totalReviews,
        averageRating: Number(averageRating.toFixed(2)), // Rounded to 2 decimal places
      },
      "Instructor rating and reviews fetched successfully"
    )
  );
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrUser,
  addEducation,
  addExperience,
  updateEducation,
  updateExperience,
  updateProfile,
  getEducation,
  deleteEducation,
  getExperience,
  deleteExperience,
  addExpertise,
  deleteExpertise,
  getExperties,
  googleAuthCallback,
  googleAuth,
  generateAccessAndRefreshToken,
  switchUserRole,
  getInstructorStats,
  getInstructorRatingAndReviews,
};

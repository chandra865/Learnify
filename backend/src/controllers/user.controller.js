import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Education } from "../models/Education.js";
import jwt from "jsonwebtoken";
import { Experience } from "../models/Experience.js";

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
  const { name, email, password, role } = req.body;
  //    console.log(req.body);
  // check for field are not empty
  if ([name, email, password, role].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All field are required");
  }

  //check user exist or not
  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "User with email already exist");
  }

  //now create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  //   console.log(user);
  //check is created or not
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User Registered Successfully"));
});

const getCurrUser = asyncHandler(async (req, res) => {
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  return res.status(200).json(
    new ApiResponse(
      200,
      loggedInUser,
      "User fetched Successfully"
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
  //req body -> data
  //username or email
  //find the user
  //password check
  //access and refresh token
  //send cookie

  const { role, email, password } = req.body;

  if (!role || !email || !password) {
    throw new ApiError(400, "role, email and password is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "User Password does not match");
  }

  //if role not matched
  if (user.role !== role) {
    throw new ApiError(401, "Invalid User role");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
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
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const addEducation = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract from JWT
  const { degree, institution, startYear, endYear,cgpa } = req.body;


  if(!degree || !institution || !startYear || !endYear || !cgpa){
    throw new ApiError(400, "All field are required");
  }
  const education = await Education.create({
    user: userId,
    degree,
    institution,
    startYear,
    endYear,
    cgpa
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
  const { degree, institution, startYear, endYear,cgpa } = req.body;

  if(!degree || !institution || !startYear || !endYear || !cgpa){
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
      throw new ApiError(404,"Education not found");
    }

    // Check if the education belongs to the logged-in user
    if (education.user.toString() !== userId.toString()) {
      throw new ApiError(403,"not authorized to delete this education");
    }

    // Delete education record
    await Education.findByIdAndDelete(educationId);

    // Remove education reference from User model
    await User.findByIdAndUpdate(userId, {
      $pull: { education: educationId },
    });

    return res
    .status(200)
    .json(new ApiResponse(200,"","Education deleted successfully"));
    
});

const getEducation = asyncHandler(async (req, res) => {

  const userId = req.user._id; // Assuming authentication middleware sets req.user
  const user = await User.findById(userId).populate("education");

  if (!user) {
    throw new ApiError(404,"Inside user education not found");
  }

  return res
  .status(200)
  .json(new ApiResponse(200,user.education,"Education fetched succesfully"));
});

const addExperience = asyncHandler(async (req, res) => {
  const userId = req.user._id; // Extract from JWT

  const { jobTitle, company, startYear, endYear, description } = req.body;
  
  if(!jobTitle || !company || !startYear || !endYear){
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

  const { jobTitle, company, startYear, endYear, description} = req.body;

  if(!jobTitle || !company || !startYear || !endYear){
    throw new ApiError(400, "All field are required");
  }
  const updatedExperience = await Experience.findByIdAndUpdate(
    experienceId,
    {
      jobTitle,
      company,
      startYear,
      endYear,
      description
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

const getExperience = asyncHandler( async (req, res) => {
  const userId = req.user._id; // Assuming authentication middleware sets req.user
  const user = await User.findById(userId).populate("experience");

  if (!user) {
    throw new ApiError(404,"Inside user experience not found");
  }

  return res
  .status(200)
  .json(new ApiResponse(200,user.experience,"Experience fetched succesfully"));
});

// Delete Experience Controller
const deleteExperience = asyncHandler( async (req, res) => {
  const { experienceId } = req.params;
    const userId = req.user._id; // Assuming authentication middleware sets `req.user`

    // Find the experience record
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      throw new ApiError(404,"experience not found");
    }

    // Check if the experience belongs to the logged-in user
    if (experience.user.toString() !== userId.toString()) {
      throw new ApiError(403,"not authorized to delete this experience");
    }

    // Delete experience record
    await Experience.findByIdAndDelete(experienceId);

    // Remove education reference from User model
    await User.findByIdAndUpdate(userId, {
      $pull: { experience: experienceId },
    });

    return res
    .status(200)
    .json(new ApiResponse(200,"","experience deleted successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  // console.log(incomingRefreshToken)
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
      secure: true,
    };
    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);
    // console.log(newRefreshToken)
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

const updateProfile = asyncHandler(async(req, res)=>{
    const userId = req.user.id; // Assuming user ID is extracted from JWT middleware
    const { name, profilePicture, bio, socialLinks } = req.body;

    const newProfilePicture = await JSON.parse(profilePicture);
    const newSocialLinks = await JSON.parse(socialLinks);

    console.log(newProfilePicture);
    console.log(newSocialLinks);

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
    .json(new ApiResponse(200, loggedInUser, "User Profile Updated Successfully"));
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
  deleteExperience
};

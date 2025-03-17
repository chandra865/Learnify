import { Router } from "express";
import {
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
  getExperties
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/getuser").get(verifyJWT, getCurrUser);
router.route("/add-education").post(verifyJWT, addEducation);
router.route("/add-experience").post(verifyJWT, addExperience);
router.route("/update-education/:educationId").post(verifyJWT, updateEducation);
router.route("/update-experience/:experienceId").post(verifyJWT, updateExperience);
router.route("/update-profile").post(verifyJWT, updateProfile);
router.route("/get-education").get(verifyJWT,getEducation);
router.route("/delete-education/:educationId").delete(verifyJWT,deleteEducation);
router.route("/get-experience").get(verifyJWT,getExperience);
router.route("/delete-experience/:experienceId").delete(verifyJWT,deleteExperience);

router.route("/get-expertise").get(verifyJWT, getExperties);
router.route("/add-expertise").post(verifyJWT, addExpertise);
router.route("/delete-expertise").delete(verifyJWT, deleteExpertise);

router.route("/refresh-token").post(refreshAccessToken);

export default router;

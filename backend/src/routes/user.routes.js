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
  updateProfile
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/getuser").get(verifyJWT, getCurrUser);
router.route("/add-education").post(verifyJWT, addEducation);
router.route("/add-experience").post(verifyJWT, addExperience);
router.route("/update-education").post(verifyJWT, updateEducation);
router.route("/update-experience").post(verifyJWT, updateExperience);
router.route("/update-profile").post(verifyJWT, updateProfile);

router.route("/refresh-token").post(refreshAccessToken);

export default router;

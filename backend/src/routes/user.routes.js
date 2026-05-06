import { Router } from "express";
import passport from "../../config/passport.js";
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
  getExperties,
  googleAuth,
  googleAuthCallback,
  switchUserRole,
  getInstructorStats,
  getInstructorRatingAndReviews
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.js";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
  educationSchema,
  experienceSchema,
  expertiseSchema
} from "../schema/user.schema.js";

const router = Router();

router.route("/register").post(validate(registerSchema), registerUser);
router.route("/login").post(validate(loginSchema), loginUser);
router.route("/logout").get(verifyJWT, logoutUser);
router.route("/getuser").get(verifyJWT, getCurrUser);
router.route("/add-education").post(verifyJWT, validate(educationSchema), addEducation);
router.route("/add-experience").post(verifyJWT, validate(experienceSchema), addExperience);
router.route("/update-education/:educationId").post(verifyJWT, validate(educationSchema), updateEducation);
router
  .route("/update-experience/:experienceId")
  .post(verifyJWT, validate(experienceSchema), updateExperience);
router.route("/update-profile").post(verifyJWT, validate(updateProfileSchema), updateProfile);
router.route("/get-education").get(verifyJWT, getEducation);
router
  .route("/delete-education/:educationId")
  .delete(verifyJWT, deleteEducation);
router.route("/get-experience").get(verifyJWT, getExperience);
router
  .route("/delete-experience/:experienceId")
  .delete(verifyJWT, deleteExperience);

router.route("/get-expertise").get(verifyJWT, getExperties);
router.route("/add-expertise").post(verifyJWT, validate(expertiseSchema), addExpertise);
router.route("/delete-expertise").delete(verifyJWT, deleteExpertise);
router.route("/switch-user-role").put(verifyJWT,switchUserRole);

router.route("/get-instructor-stats/:instructorId").get(getInstructorStats);
router.route("/get-instructor-rating-and-reviews/:instructorId").get(getInstructorRatingAndReviews);

router.route("/refresh-token").post(refreshAccessToken);
router.route("/auth/google").get(googleAuth);
router
  .route("/auth/google/callback")
  .get(passport.authenticate("google", { session: false }), googleAuthCallback);

export default router;

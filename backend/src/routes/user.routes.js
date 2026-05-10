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
  getExpertise,
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
router.route("/get-user").get(verifyJWT, getCurrUser);

router.route("/profile").put(verifyJWT, validate(updateProfileSchema), updateProfile);


router.route("/refresh-token").post(refreshAccessToken);
router.route("/auth/google").get(googleAuth);
router
  .route("/auth/google/callback")
  .get(passport.authenticate("google", { session: false }), googleAuthCallback);

router.route("/stats/:instructorId").get(getInstructorStats);
router.route("/:instructorId/rating-reviews").get(getInstructorRatingAndReviews);

router.route("/educations").post(verifyJWT, validate(educationSchema), addEducation);
router.route("/educations/:educationId").post(verifyJWT, validate(educationSchema), updateEducation);
router.route("/educations").get(verifyJWT, getEducation);
router
  .route("/educations/:educationId")
  .delete(verifyJWT, deleteEducation);


router.route("/experiences").post(verifyJWT, validate(experienceSchema), addExperience);
router
  .route("/experiences/:experienceId")
  .post(verifyJWT, validate(experienceSchema), updateExperience);
router.route("/experiences").get(verifyJWT, getExperience);
router
  .route("/experiences/:experienceId")
  .delete(verifyJWT, deleteExperience);

router.route("/expertise").get(verifyJWT, getExpertise);
router.route("/expertise").patch(verifyJWT, validate(expertiseSchema), addExpertise);
router.route("/expertise").delete(verifyJWT, deleteExpertise);
router.route("/:userId/role").patch(verifyJWT,switchUserRole);



export default router;

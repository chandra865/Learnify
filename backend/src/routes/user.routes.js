import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, getCurrUser} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router = Router();

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(verifyJWT,logoutUser);
router.route("/getuser").get(verifyJWT, getCurrUser);

router.route("/refresh-token").post(refreshAccessToken);



export default router;
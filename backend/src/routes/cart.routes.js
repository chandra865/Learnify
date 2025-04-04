import {Router} from "express"
import { addCart, getCart, removeFromCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/add-cart").post(verifyJWT, addCart);
router.route("/get-cart/:userId").get(verifyJWT, getCart);
router.route("/remove-from-cart/:userId/:courseId").get(verifyJWT, removeFromCart);

export default router;
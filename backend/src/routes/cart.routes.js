import {Router} from "express"
import { addCart, getCart, removeFromCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.js";
import { addCartSchema } from "../schema/cart.schema.js";

const router = Router();

router.route("/add-cart").post(verifyJWT, validate(addCartSchema), addCart);
router.route("/get-cart/:userId").get(verifyJWT, getCart);
router.route("/remove-from-cart/:userId/:courseId").get(verifyJWT, removeFromCart);

export default router;
import {Router} from "express"
import { addCart, getCart, removeFromCart } from "../controllers/cart.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validation.js";
import { addCartSchema } from "../schema/cart.schema.js";

const router = Router();

router.route("/").post(verifyJWT, validate(addCartSchema), addCart);
router.route("/:userId").get(verifyJWT, getCart);
router.route("/:userId/:courseId").patch(verifyJWT, removeFromCart);

export default router;
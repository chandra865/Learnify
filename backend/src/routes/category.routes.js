import {Router} from "express";
import {getAllCategories} from "../controllers/category.controller.js";

const router = Router();

router.route("/get-categories").get(getAllCategories); 

export default router;
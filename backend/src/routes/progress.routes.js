import {Router} from 'express';
import { updateProgress, getProgress} from '../controllers/progress.controller.js';

const router = Router();

router.route('/update-progress').post(updateProgress);
router.route("/get-progress/:userId/:courseId").get(getProgress);
export default router;
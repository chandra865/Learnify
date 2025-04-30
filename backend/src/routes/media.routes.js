import {Router} from 'express';
import {verifyJWT, isAuthorized} from '../middlewares/auth.middleware.js';
import {uploadMedia} from '../controllers/media.controller.js';

const router = Router();

router.route('/upload-media').post(verifyJWT, uploadMedia);
export default router;
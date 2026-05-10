import {Router} from 'express';
import {verifyJWT, isAuthorized} from '../middlewares/auth.middleware.js';
import {uploadMedia} from '../controllers/media.controller.js';
import { validate } from '../middlewares/validation.js';
import { uploadMediaSchema } from '../schema/media.schema.js';

const router = Router();

router.route('/upload-media').post(verifyJWT, isAuthorized("instructor"), validate(uploadMediaSchema), uploadMedia);
export default router;
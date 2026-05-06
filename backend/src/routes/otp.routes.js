import {Router} from 'express';
import {sendOtp, verifyOtp} from '../controllers/otp.controller.js';
import { validate } from '../middlewares/validation.js';
import { sendOtpSchema, verifyOtpSchema } from '../schema/otp.schema.js';

const router = Router();
router.route('/send-otp').post(validate(sendOtpSchema), sendOtp);
router.route('/verify-otp').post(validate(verifyOtpSchema), verifyOtp);
export default router;
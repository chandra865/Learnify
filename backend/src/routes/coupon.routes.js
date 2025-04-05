import Router from 'express';
import { createCoupon, validateCoupon } from '../controllers/coupon.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/create-coupon').post(verifyJWT, createCoupon);
router.route('/validate-coupon').get(verifyJWT, validateCoupon);

export default router;
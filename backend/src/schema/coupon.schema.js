import {z} from "zod";

const createCouponSchema = z.object({
    code: z.string().min(1, "Code is required"),
    discountPercentage: z.string(),
    expiresAt: z.string().min(1, "Expiration date is required"),
    courseId: z.string().min(1, "Course ID is required"),
});

export {
    createCouponSchema
};

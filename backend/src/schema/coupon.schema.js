import {z} from "zod";

const createCouponSchema = z.object({
    code: z.string().min(1, "Code is required"),
    discountType: z.enum(["percentage", "fixed"]),
    discountAmount: z.preprocess((val) => Number(val), z.number().min(0)),
    expirationDate: z.string().min(1, "Expiration date is required"),
    courseId: z.string().min(1, "Course ID is required"),
    usageLimit: z.preprocess((val) => Number(val), z.number().min(1).optional()),
});

export {
    createCouponSchema
};

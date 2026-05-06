import {z} from "zod";

const createOrderSchema = z.object({
    amount: z.preprocess((val) => Number(val), z.number().min(1)),
});

const verifyPaymentSchema = z.object({
    razorpay_order_id: z.string().min(1, "Order ID is required"),
    razorpay_payment_id: z.string().min(1, "Payment ID is required"),
    razorpay_signature: z.string().min(1, "Signature is required"),
    userId: z.string().min(1, "User ID is required"),
    type: z.enum(["single", "cart"]),
    courseId: z.string().optional(),
    amount: z.preprocess((val) => Number(val), z.number().min(1)),
    paymentMethod: z.string().min(1, "Payment method is required"),
    discountCode: z.string().optional(),
});

export {
    createOrderSchema,
    verifyPaymentSchema
};

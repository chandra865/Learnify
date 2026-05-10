import {z} from "zod";

const sendOtpSchema = z.object({
    email: z.email("Invalid email format"),
});

const verifyOtpSchema = z.object({
    email: z.email("Invalid email format"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export {
    sendOtpSchema,
    verifyOtpSchema
};

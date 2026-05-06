import {z} from "zod";

const requestPasswordResetSchema = z.object({
    email: z.string().email("Invalid email format"),
});

const resetPasswordSchema = z.object({
    email: z.string().email("Invalid email format"),
    token: z.string().min(1, "Token is required"),
    newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

export {
    requestPasswordResetSchema,
    resetPasswordSchema
};

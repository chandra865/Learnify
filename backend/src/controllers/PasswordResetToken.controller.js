import crypto from "crypto";
import { PasswordResetToken } from "../models/PasswordResetToken.model.js";
import { sendEmail } from "../utils/sendEmail.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const requestPasswordReset = asyncHandler( async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) 
    throw new ApiError(404, "User not found");

  const token = crypto.randomBytes(32).toString("hex");
  await PasswordResetToken.deleteMany({ email }); // clear old tokens
  await PasswordResetToken.create({ email, token });

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}&email=${email}`;

  await sendEmail({
    to: email,
    subject: "Password Reset",
    text: `Reset your password using this link: ${resetUrl}`
  });

  return res.status(200).json(new ApiResponse(200, null, "Password reset email sent successfully"));
});

const resetPassword = asyncHandler( async (req, res) => {
  const { email, token, newPassword } = req.body;

  const tokenEntry = await PasswordResetToken.findOne({ email, token });
  if (!tokenEntry) 
    throw new ApiError(400, "Invalid or expired token");

  const user = await User.findOne({ email });
  if (!user) 
    throw new ApiError(404, "User not found");

  user.password = newPassword; // Should be hashed automatically by Mongoose middleware
  await user.save();
  await PasswordResetToken.deleteMany({ email });

  return res.status(200).json(new ApiResponse(200, null, "Password reset successfully"));
  
});
export { requestPasswordReset, resetPassword };
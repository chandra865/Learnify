import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Otp } from "../models/otp.model.js";

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // const existingUser = await User.findOne({ email });
  // if (existingUser) throw new ApiError(400, "Email already registered");

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.deleteMany({ email }); // clear previous

  await Otp.create({ email, otp });

  // Use nodemailer (or a service like Resend, Mailgun, etc.)
  await sendEmail({
    to: email,
    subject: "Your OTP for Registration",
    text: `Your OTP is ${otp}`,
  });

  return res.status(200).json(new ApiResponse(200, null, "OTP sent successfully"));
});

const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email });
  if (!record) throw new ApiError(400, "OTP expired or not found");

  if (record.otp !== otp) throw new ApiError(400, "Invalid OTP");

  await Otp.deleteOne({ email });

  // You can create the user now, or just mark it verified
  const user = await User.findOneAndUpdate(
    { email },
    { emailVerified: true },
    { new: true }
  );

  return res.status(200).json(new ApiResponse(200, user, "OTP verified successfully"));
});

export { sendOtp, verifyOtp };
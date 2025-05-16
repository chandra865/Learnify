import mongoose from 'mongoose';

const passwordResetTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 } // 10 min expiry
});

export const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema);

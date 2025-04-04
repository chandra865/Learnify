import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    
    profilePicture: {
      publicId: { type: String,}, 
      url: { type: String,},
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      required: true,
    },
    refreshToken: {
      type: String,
    },

    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    createdCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],

    expertise:[
      {
        type: String,
      }
    ],

    education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
    experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],

    socialLinks: {
      linkedin: String,
      twitter: String,
      website: String,
      instagram: String,
      youtube: String,
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User", userSchema);

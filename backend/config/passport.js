import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../src/models/user.model.js";
import { generateAccessAndRefreshToken } from "../src/controllers/user.controller.js";
import { config } from "dotenv";
config({
    path : "./.env"   
})

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // console.log("Google accessToken", accessToken);
        // console.log("Google refreshToke", refreshToken);
        // console.log("Google Profile", profile);
        // Check if user exists in DB
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Create new user in DB
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: {
              url: profile.photos[0].value,
            },
            emailVerified: true, // Automatically verified
            password: null, // No password for OAuth users
            role: "student", // Default role
          });
        }

        // Generate JWT token
        const tokens = await generateAccessAndRefreshToken(user._id);

        // Pass token in the request
        done(null, {user, tokens});
      } catch (error) {
        console.log(error);
        done(error, null);
      }
    }
  )
);

export default passport;

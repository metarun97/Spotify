import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from './config/config.js';


/* Server Created */
const app = express();

/* Use morgan for track activities of Server */
app.use(morgan("dev"));

/* Use cookieParser for read cookies */
app.use(cookieParser());

/* Middleware to read req.body data */
app.use(express.json());

/* Middleware to parse form data */
app.use(express.urlencoded({ extended: true }));

/* Middleware to parse form data */
app.use(passport.initialize());

// Configure Passport to use Google OAuth 2.0 strategy
passport.use(new GoogleStrategy({
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback',
}, (accessToken, refreshToken, profile, done) => {
  // Here, you would typically find or create a user in your database
  // For this example, we'll just return the profile
  return done(null, profile);
}));


/* Auth routes with prefix */
app.use("/api/auth", authRoutes);


export default app;

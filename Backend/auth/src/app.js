import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import authRoutes from "./routes/auth.routes.js";
import passport from 'passport';
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from './config/config.js';
import cors from "cors";


/* Server created */
const app = express();

/* Cors setup */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}))

/* For track server's activity */
app.use(morgan("dev"));

/* For read cookies data */
app.use(cookieParser());

/* For read server's req.body data */
app.use(express.json());

/* For parse the form data */
app.use(express.urlencoded({ extended: true }));

/* To cative passport authentication middleware */
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

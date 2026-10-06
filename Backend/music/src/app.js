import express from "express";
import cookieParser from "cookie-parser";
import musicRoutes from "./routes/music.route.js";
import cors from "cors";


/* Server Created */
const app = express();

/* Cors policy setup */
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}))

/* Middleware to read req.body data */
app.use(express.json());

/* Middleware to read cookie data */
app.use(cookieParser());

/* Music router with prefix */
app.use("/api/music", musicRoutes);


export default app;

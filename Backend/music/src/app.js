import express from "express";
import cookieParser from "cookie-parser";
import musicRoutes from "./routes/music.route.js";


/* Server Created */
const app = express();

/* Middleware to read req.body data */
app.use(express.json());

/* Middleware to read cookie data */
app.use(cookieParser());

/* Music router with prefix */
app.use("/api/music", musicRoutes);


export default app;

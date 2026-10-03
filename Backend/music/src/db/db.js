import mongoose from "mongoose";
import config from '../config/config.js';

/* Database connect Function */
const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to database!");
  } catch (err) {
    console.log(" Error to connect database", err);
  }
}


export default connectToDatabase;

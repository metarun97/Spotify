import mongoose from "mongoose";
import config from '../config/config.js';


/* Connect database function */
const connectDatabase = async () => {
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("Connected to Database!");
  } catch (err) {
    console.error("Error to connect database", err)
  }
}

export default connectDatabase;

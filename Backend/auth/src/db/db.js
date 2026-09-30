import mongoose from "mongoose";
import config from '../config/config.js';


/* Connect to database function */
const connectToDb = async () => {
  try {
    await mongoose.connect(config?.MONGO_URI)

    console.log("Connected to database!");

  } catch (err) {

    console.error("Error connecting to database", err);

  }
}


export default connectToDb;

import { config as dotenvConfig } from "dotenv";


dotenvConfig();

/* All credentials stored here */
const _config = {
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
}


export default Object.freeze(_config);

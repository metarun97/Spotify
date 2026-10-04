import jwt from "jsonwebtoken";
import config from '../config/config.js';


/* Artist middleware */
export const authArtistMiddleware = (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized!",
    })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    /* Role check for artist */
    if (decoded.role !== "artist") {
      return res.status(403).json({
        message: "Forbidden!",
      })
    }

    req.user = decoded;
    next();

  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Unauthorized!",
    })
  }
}


/* User middleware */
export const userAuthMiddleware = async (req, res, next) => {

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized!",
    })
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);

    req.user = decoded;

    next();

  } catch (error) {
    console.log(error);

    res.status(401).json({
      message: "Unauthorized!",
    })
  }
}

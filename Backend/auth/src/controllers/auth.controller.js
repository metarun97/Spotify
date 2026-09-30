import userModel from "../models/user.model.js";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";


/**
 * @name register
 * @description accept email and password
 * @access public
 */
export const register = async (req, res) => {
  try {

    const { email, password, fullname: { firstName, lastName } } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email });

    if (isUserAlreadyExists) {
      return res.status(400).json({
        message: "User Already Exists!",
      })
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      email,
      password: hash,
      fullname: { firstName, lastName }
    })

    const token = jwt.sign({
      id: user._id,
      role: user.role,
    }, config.JWT_SECRET, { expiresIn: "2d" });

    res.cookie("token", token);

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      }
    })
  } catch (error) {
    res.status(500).json({
      message: "Error to Register new User",
    })
  }
}


/**
 * @name googleAuthCallback
 * @description it is for login if registered ruther then login user
 * @access public
 */
export const googleAuthCallback = async (req, res) => {

  try {
    const user = req.user;

    /* Check for user already exists */
    const isUserAlreadyExists = await userModel.findOne({
      $or: [
        { email: user.emails[0].value },
        { googleId: user.id },
      ]
    })


    if (isUserAlreadyExists) {
      const token = jwt.sign({
        id: isUserAlreadyExists._id,
        role: isUserAlreadyExists.role,
      }, config.JWT_SECRET, { expiresIn: "2d" })

      res.cookie("token", token);

      return res.status(200).json({
        mesage: "User logged in successfully!",
        user: {
          id: isUserAlreadyExists._id,
          email: isUserAlreadyExists.email,
          fullname: isUserAlreadyExists.fullname,
          role: isUserAlreadyExists.role,
        }
      })
    }


    /*  If user not exists then create a new user */
    const newUser = await userModel.create({
      googleId: user.id,
      email: user.emails[0].value,
      fullname: {
        firstName: user.name.givenName,
        lastName: user.name.familyName,
      }
    })


    const token = jwt.sign({
      id: newUser._id,
      role: newUser.role,

    }, config.JWT_SECRET, { expiresIn: "2d" })


    res.cookie("token", token);


    res.status(200).json({
      mesage: "User created successfully!",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullname: newUser.fullname,
        role: newUser.role,
      }
    })
  } catch (error) {
    res.status(500).json({
      message: "Error to Logon a user / Register a new User",
    })
  }
}

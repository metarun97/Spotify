import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import config from '../config/config.js';
import userModel from './../models/user.model.js';
import { publishToQueue } from '../broker/rabbit.js'


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
      fullname: { firstName, lastName },
    })


    const token = jwt.sign({
      id: user._id,
      role: user.role
    }, config.JWT_SECRET, { expiresIn: "2d" })


    /* Publish to queue used here */
    publishToQueue("user_created", {
      id: user._id,
      email: user.email,
      fullname: user.fullname,
      role: user.role
    })


    res.cookie("token", token)

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({
      message: "Error to Register a user"
    })
  }
}

/**
 * @name login
 * @description accept email and password
 * @access public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(400).json({
        messsage: "Invalid Email or Password!"
      })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
      return res.status(400).json({
        messsage: "Invalid Email or Password!"
      })
    }


    const token = jwt.sign({
      id: user._id,
      role: user.role,
    }, config.JWT_SECRET, { expiresIn: "2d" })


    res.cookie("token", token);

    res.status(200).json({
      message: "User Logged in successfully!",
      user: {
        id: user._id,
        email: user.email,
        fullname: user.fullname,
        role: user.role,
      }
    })

  } catch (error) {
    res.status(500).json({
      message: "Error to Login a user"
    })
  }
}


/**
 * @name googleAuthCallback
 * @description accept email only
 * @access public
 */
export const googleAuthCallback = async (req, res) => {
  try {

    const user = req.user;

    /* Check if user exists then proceed to login  */
    const isUserAlreadyExists = await userModel.findOne({
      $or: [
        { email: user.emails[0].value },
        { googleId: user.id }
      ]
    })

    if (isUserAlreadyExists) {
      const token = jwt.sign({
        id: isUserAlreadyExists._id,
        role: isUserAlreadyExists.role
      }, config.JWT_SECRET, { expiresIn: "2d" })

      res.cookie("token", token);

      res.status(200).json({
        message: "User loggedIn successfully!",
        user: {
          id: isUserAlreadyExists._id,
          email: isUserAlreadyExists.email,
          fullname: isUserAlreadyExists.fullname,
          role: isUserAlreadyExists.role
        }
      })
    }


    const newUser = await userModel.create({
      id: user.id,
      email: user.emails[0].value,
      fullname: {
        firstName: user.name.givenName,
        lastName: user.name.familyName,
      }
    })

    /* Publish to queue used here */
    publishToQueue("user_created", {
      id: newUser._id,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role
    })

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, config.JWT_SECRET, { expiresIn: "2d" })

    res.cookie("token", token);

    res.status(201).json({
      message: "User created successfully!",
      user: {
        id: newUser._id,
        email: newUser.email,
        fullname: newUser.fullname,
        role: newUser.role
      }
    })


  } catch (error) {
    res.status(500).json({
      message: "Error to Register/Login a user"
    })
  }
}

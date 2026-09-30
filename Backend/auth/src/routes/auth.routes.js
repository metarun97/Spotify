import express from 'express';
import * as authController from "../controllers/auth.controller.js";
import * as validatonRules from "../middlewares/validation.middleware.js";
import passport from 'passport';


/* Router Created */
const router = express.Router();

/**
 * @route /api/auth/register
 * @description register a user
 * @access public
 */
router.post("/register", validatonRules.registerUserValidationRules, authController.register);


/**
 * @route /api/auth/google
 * @description register a user
 * @access public
 */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);


/**
 * @route /api/auth/google/callback
 * @description register a user
 * @access public
 */
router.get('/google/callback',
  passport.authenticate('google', { session: false }),
  authController.googleAuthCallback
);



export default router;

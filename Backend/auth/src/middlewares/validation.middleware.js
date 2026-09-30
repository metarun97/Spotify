import { body, validationResult } from "express-validator";


/* Create validate error function */
const validate = async (req, res, next) => {

  const errors = validationResult(req);

  if (!errors.isEmpty()) {

    return res.status().json({ errors: errors.array() })
  }

  next();
}


/* Roles for Registeration */
export const registerUserValidationRules = [
  body("email")
    .isEmail()
    .withMessage("Invalid email address"),

  body("password")
    .isLength({ min: 6 })
    .withMessage("password must be 6 characters long"),

  body("fullname.firstName")
    .notEmpty()
    .withMessage("First name is required"),

  body("fullname.lastName")
    .notEmpty()
    .withMessage("Last name is required"),

  validate,
]

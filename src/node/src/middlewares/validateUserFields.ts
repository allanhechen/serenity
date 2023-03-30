import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const userfields = [
  "username",
  "name",
  "email",
  "password",
  "gender",
  "timezone",
  "color",
];

const validateName = body("name")
  .isLength({ min: 3, max: 255 })
  .withMessage("Name is invalid");

const validateUsername = body("username")
  .trim()
  .isAlphanumeric()
  .isLength({ min: 3, max: 255 })
  .withMessage("Username is invalid");

const validatePassword = body("password")
  .trim()
  .isLength({ min: 10 })
  .withMessage("Password is invalid");

const validateEmail = body("email")
  .normalizeEmail()
  .isLength({ min: 3, max: 255 })
  .isEmail()
  .withMessage("Email is invalid");

const validateGender = body("gender").isIn(["male", "female", "other"]);

// Middleware that validates the UTC offset
const validateUTC = body("timezone")
  .custom(validateUTCOffset)
  .withMessage("Invalid UTC offset")
  .withMessage("Timezone is invalid");

const validateColor = body("color")
  .isHexColor()
  .withMessage("Hex color is invalid");

function validateUserFieldSelection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { field } = req.params;

  if (!userfields.includes(field)) {
    res.status(400).json("Field is invalid");
    return;
  }

  next();
}

function validateSelectedUserField(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { field } = req.params;

  switch (field) {
    case "name":
      validateName(req, res, next);
      break;
    case "email":
      validateEmail(req, res, next);
      break;
    case "gender":
      validateGender(req, res, next);
      break;
    case "timezone":
      validateUTC(req, res, next);
      break;
    case "color":
      validateColor(req, res, next);
      break;
    default:
      res.status(400).json("Field is invalid");
  }
}

function checkValidation(req: Request, res: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    res.send(errors);
  } else {
    next();
  }
}

export {
  validateName,
  validateEmail,
  validateUsername,
  validatePassword,
  validateGender,
  validateUTC,
  validateColor,
  validateUserFieldSelection,
  validateSelectedUserField,
  checkValidation,
};

function validateUTCOffset(value: string) {
  // Check that the value is a valid UTC offset, e.g. +05:30
  if (!/^[+-]\d{2}:\d{2}$/.test(value)) {
    throw new Error("Invalid UTC offset");
  }

  // Parse the hours and minutes from the UTC offset
  const [hours, minutes] = value.substring(1).split(":");
  const totalMinutes = parseInt(hours) * 60 + parseInt(minutes);

  // Check that the UTC offset is within the range -720 to +720 minutes
  if (totalMinutes < -720 || totalMinutes > 720) {
    throw new Error("UTC offset must be between -12:00 and +12:00");
  }

  // Return the validated value
  return value;
}

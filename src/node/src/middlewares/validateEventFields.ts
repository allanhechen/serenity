import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import executeQuery from "../utils/db";
import { getById } from "../utils/db";
import { AuthenticatedRequest } from "../utils/types";
import {
  entityfields,
  validateSelectedEntityField,
} from "./validateEntityFields";

import { validateStartDate, validateEndDate } from "./validateTaskFields";

const eventfields = ["location, start_time, end_time"];

const validateLocation = body("location")
  .trim()
  .isLength({ max: 255 })
  .withMessage("Location is invalid");

function validateEventFieldSelection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { field } = req.params;

  if (!eventfields.includes(field) && !entityfields.includes(field)) {
    res.status(400).json("Field is invalid");
    return;
  }

  next();
}

function validateSelectedEventField(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { field } = req.params;

  if (entityfields.includes(field)) {
    validateSelectedEntityField(req, res, next);
  } else {
    switch (field) {
      case "location":
        validateLocation(req, res, next);
        break;
      case "start_date":
        validateStartDate(req, res, next);
        break;
      case "end_date":
        validateEndDate(req, res, next);
        break;
      default:
        res.status(400).json("Field is invalid");
    }
  }
  next();
}

export {
  eventfields,
  validateStartDate,
  validateEndDate,
  validateLocation,
  validateSelectedEventField,
  validateEventFieldSelection,
};

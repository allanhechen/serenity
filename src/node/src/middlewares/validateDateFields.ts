import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import executeQuery from "../utils/db";
import { getById } from "../utils/db";
import { AuthenticatedRequest } from "../utils/types";
import {
  entityfields,
  validateSelectedEntityField,
} from "./validateEntityFields";

const dateFields = ["date"];

const validateDate = body("date").isDate().withMessage("Date is invalid");

function validateDateFieldSelection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { field } = req.params;

  if (!dateFields.includes(field) && !entityfields.includes(field)) {
    res.status(400).json("Field is invalid");
    return;
  }

  next();
}

function validateSelectedDateField(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { field } = req.params;

  if (entityfields.includes(field)) {
    validateSelectedEntityField(req, res, next);
  } else {
    switch (field) {
      case "date":
        validateDate(req, res, next);
        break;
      default:
        res.status(400).json("Field is invalid");
    }
  }
  next();
}

export {
  dateFields,
  validateDate,
  validateSelectedDateField,
  validateDateFieldSelection,
};

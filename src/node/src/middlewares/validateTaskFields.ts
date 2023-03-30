import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import executeQuery from "../utils/db";
import { getById } from "../utils/db";
import { AuthenticatedRequest } from "../utils/types";
import {
  entityfields,
  validateSelectedEntityField,
} from "./validateEntityFields";

const taskfields = [
  "start_date",
  "end_date",
  "status",
  "frequency",
  "time_required",
];

const validateStatus = body("status")
  .isIn(["untouched", "inprogress", "finished"])
  .withMessage("Status is invalid");

const validateFrequency = body("freuency")
  .isIn(["never", "daily", "weekly", "monthly"])
  .withMessage("Frequency is invalid");

const validateStartDate = body("start_date")
  .isDate()
  .withMessage("Start date is invalid");

const validateEndDate = body("end_date")
  .isDate()
  .withMessage("End date is invalid");

function validateTaskFieldSelection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { field } = req.params;

  if (!taskfields.includes(field) && !entityfields.includes(field)) {
    res.status(400).json("Field is invalid");
    return;
  }

  next();
}

function validateSelectedTaskField(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { field } = req.params;

  if (entityfields.includes(field)) {
    validateSelectedEntityField(req, res, next);
  } else {
    switch (field) {
      case "status":
        validateStatus(req, res, next);
        break;
      case "frequency":
        validateFrequency(req, res, next);
        break;
      case "startdate":
        validateStartDate(req, res, next);
        break;
      case "enddate":
        validateEndDate(req, res, next);
        break;
      default:
        res.status(400).json("Field is invalid");
    }
  }
  next();
}

export {
  taskfields,
  validateStatus,
  validateFrequency,
  validateStartDate,
  validateEndDate,
  validateTaskFieldSelection,
  validateSelectedTaskField,
};

import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import executeQuery from "../utils/db";
import { getById } from "../utils/db";
import { AuthenticatedRequest } from "../utils/types";
import {
  entityfields,
  validateImportanceRating,
  validateDescription,
  validateName,
  validateColor,
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

  if (!entityfields.includes(field)) {
    res.status(400).json("Field is invalid");
    return;
  }
  next();
}

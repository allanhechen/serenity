import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import {
  validateName,
  validateColor,
  checkValidation,
} from "./validateUserFields";
import executeQuery from "../utils/db";
import { getById } from "../utils/db";
import { AuthenticatedRequest } from "../utils/types";

const groupfields = ["id", "group_name"];

const validateGroupName = body("group_name")
  .isLength({ min: 3, max: 255 })
  .withMessage("Name is invalid");

export { groupfields, validateGroupName };

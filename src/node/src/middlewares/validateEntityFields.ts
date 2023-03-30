import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import {
  validateName,
  validateColor,
  checkValidation,
} from "./validateUserFields";
import executeQuery from "../utils/db";
import { getById } from "../utils/db";
import { AuthenticatedRequest } from "../utils/types";

const entityfields = [
  "id",
  "name",
  "importance_rating",
  "descrption",
  "hex_color",
];

const validateImportanceRating = body("importance_rating")
  .isInt({
    min: 1,
    max: 10,
  })
  .withMessage("Importance rating is invalid");

const validateDescription = body("description")
  .trim()
  .isLength({ min: 1, max: 255 })
  .withMessage("Description is invalid");

/**
 * Takes in arguments inside req.params, and checks if firstEntity owns secondEnity. Returns
 * the entity in req.params.id if true, throws an error otherwise.
 * @param firstEntityid id of the owner
 * @param secondEntityid id of the object
 * @param firstEntity the owner
 * @param secondEntity the object being owned
 */
// async function validateid(req: Request, res: Response, next: NextFunction) {
//   const { firstEntityid, secondEntityid, firstEntity, secondEntity } =
//     req.params;
//   const rows = await getById(
//     firstEntityid,
//     secondEntityid,
//     firstEntity,
//     secondEntity
//   );

//   if (!rows.isEmpty()) {
//     console.log(rows);
//     req.params.id = rows;
//     next();
//   } else {
//     throw new Error("Id is invalid");
//   }
// }

// function validateEntityFieldSelection(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { field } = req.params;

//   if (!entityfields.includes(field)) {
//     res.status(400).json("Field is invalid");
//     return;
//   }

//   next();
// }

function validateSelectedEntityField(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { field } = req.params;

  switch (field) {
    case "name":
      validateName(req, res, next);
      break;
    case "importancerating":
      validateImportanceRating(req, res, next);
      break;
    case "description":
      validateDescription(req, res, next);
      break;
    case "color":
      validateColor(req, res, next);
      break;
    default:
      res.status(400).json("Field is invalid");
  }
}

export {
  entityfields,
  validateImportanceRating,
  validateDescription,
  validateName,
  validateColor,
  validateSelectedEntityField,
};

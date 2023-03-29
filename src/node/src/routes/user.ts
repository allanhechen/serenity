import { Router, Request, Response, NextFunction } from "express";
import executeQuery from "../utils/db";
import { AuthenticatedRequest } from "../utils/types";
import {
  validateSelectedUserField,
  validateUserFieldSelection,
  checkValidation,
} from "../middlewares/validateUserFields";
const router = Router();

router
  .route("/:field")
  .get(
    validateUserFieldSelection,
    checkValidation,
    async (req: Request, res) => {
      const { field } = req.params;
      if (field == "password") {
        res.status(400).json("Field is invalid");
        return;
      }
      const query = `SELECT ${field} FROM users WHERE userid = ?`;
      const rows = await executeQuery(query, [
        (req as AuthenticatedRequest).auth.userid,
      ]);
      res.json(rows);
    }
  )
  .patch(
    validateUserFieldSelection,
    validateSelectedUserField,
    checkValidation,
    async (req: Request, res) => {
      const { field } = req.params;

      const query = `UPDATE users SET ${field} = ? WHERE userid = ?`;
      const rows = await executeQuery(query, [
        req.body.name,
        (req as AuthenticatedRequest).auth.userid,
      ]);
      res.send();
    }
  );

router.get("/", async (req: Request, res) => {
  const userid = (req as AuthenticatedRequest).auth.userid;
  const rows = await executeQuery("SELECT * FROM users WHERE userid = ?", [
    userid,
  ]);
  res.json(rows);
});

// router.use("/", (req: Request, res: Response) => {
//   let columns: string = "";
//   const query = `SELECT ${columns} FROM users;`;
// });

export default router;

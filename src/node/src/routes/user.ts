import { Router, Request, Response, NextFunction } from "express";
import executeQuery from "../utils/db";
import { AuthenticatedRequest } from "../utils/types";
import { validateUserFields } from "../middlewares/validate";
const router = Router();

router
  .route("/:field")
  .get((req, res) => {})
  .post((req, res) => {});

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

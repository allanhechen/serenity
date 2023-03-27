import { Router, Request, Response, NextFunction } from "express";
import createConnection from "../utils/db";
const router = Router();

router
  .route("/:field")
  .get((req, res) => {})
  .post((req, res) => {});

router.get("/", async (req, res) => {
  const conn = await createConnection;
  const [rows] = await conn.execute("SELECT * FROM users");
  res.json(rows);
});

// router.use("/", (req: Request, res: Response) => {
//   let columns: string = "";
//   const query = `SELECT ${columns} FROM users;`;
// });

export default router;

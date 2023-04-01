import { Router, Request, Response, NextFunction } from "express";
import executeQuery, { getAllOwned, getById, joinNewEntry } from "../utils/db";
import { AuthenticatedRequest, Task } from "../utils/types";
import {
  validateName,
  validateImportanceRating,
  validateDescription,
  validateColor,
} from "../middlewares/validateEntityFields";
import {
  validateEndDate,
  validateFrequency,
  validateSelectedTaskField,
  validateStartDate,
  validateStatus,
  validateTaskFieldSelection,
  validateTimeRequired,
} from "../middlewares/validateTaskFields";
import { checkValidation } from "../middlewares/validateUserFields";
const router = Router();

router
  .route("/:id/:field")
  .get(
    validateTaskFieldSelection,
    checkValidation,
    async (req: Request, res) => {
      const { id, field } = req.params;
      const userid = (req as AuthenticatedRequest).auth.userid;
      const rows = await getById(userid, id, "user", "task", field);
      res.json(rows);
    }
  )
  .patch(
    validateSelectedTaskField,
    checkValidation,
    async (req: Request, res) => {
      const { id, field } = req.params;
      const query = `UPDATE tasks SET ${field} = ? WHERE taskid = ?`;
      const rows = await executeQuery(query, [req.body[field], id]);
      res.send();
    }
  );

router.route("/:id").get(async (req: Request, res) => {
  const userid = (req as AuthenticatedRequest).auth.userid;
  const taskid = req.params.id;
  const rows = await getById(userid, taskid, "user", "task");

  if (rows.length != 0) {
    res.json(rows);
  } else {
    res.status(400).json("Id is invalid");
  }
});

router
  .route("/")
  .get(async (req: Request, res) => {
    const userid = (req as AuthenticatedRequest).auth.userid;
    const rows = await getAllOwned(userid, "task");
    res.json(rows);
  })
  .post(
    validateName,
    validateImportanceRating,
    validateDescription,
    validateColor,
    validateStatus,
    validateFrequency,
    validateStartDate,
    validateEndDate,
    validateTimeRequired,
    checkValidation,
    async (req: Request, res) => {
      const userid = (req as AuthenticatedRequest).auth.userid;
      const row = await insertTask(req.body);
      await joinNewEntry(userid, row.insertId, "user", "task");
      res.json({ taskid: row.insertId });
    }
  );

async function insertTask(taskData: Task) {
  return await executeQuery(
    "INSERT INTO tasks (name, start_date, end_date, status, importance_rating, frequency, description, time_required, picture_url, hex_color) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);",
    [
      taskData.name,
      taskData.start_date,
      taskData.end_date,
      taskData.status,
      taskData.importance_rating,
      taskData.frequency,
      taskData.description,
      taskData.time_required,
      "path to picture url",
      taskData.color,
    ]
  );
}

// router.use("/", (req: Request, res: Response) => {
//   let columns: string = "";
//   const query = `SELECT ${columns} FROM users;`;
// });

export default router;

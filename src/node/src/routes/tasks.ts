import { Router, Request, Response, NextFunction } from "express";
import executeQuery, {
  getAllOwned,
  getById,
  joinNewEntry,
  testIdExists,
} from "../utils/db";
import { AuthenticatedRequest, Group, Task } from "../utils/types";
import {
  validateName,
  validateImportanceRating,
  validateDescription,
  validateColor,
  validateSelectedId,
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
import { check } from "express-validator";
import { validateGroupName } from "../middlewares/validateGroupFields";
const router = Router();

router
  .route("/groups")
  .get(async (req: Request, res) => {
    const userid = (req as AuthenticatedRequest).auth.userid;
    const rows = await getAllOwned(userid, "taskgroup");
    res.json(rows);
  })
  .post(validateGroupName, validateColor, checkValidation, async (req, res) => {
    if (!req.body.taskids) {
      res.status(400).json("Missing taskids array");
      return;
    }

    let { taskids } = req.body.taskids;
    let userid = (req as AuthenticatedRequest).auth.userid;

    checkIfArray(taskids, res);
    console.log("still here");

    taskids.forEach((taskid) => {
      if (
        /^\d+$/.test(taskid) ||
        !testIdExists(taskid, userid, "taskgroup", "task")
      ) {
        res.status(400).json("Invalid taskids array");
      }
    });
  });

router
  .route("/:id/:field")
  .get(
    validateSelectedId,
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
    validateSelectedId,
    validateSelectedTaskField,
    checkValidation,
    async (req: Request, res) => {
      const { id, field } = req.params;
      const query = `UPDATE tasks SET ${field} = ? WHERE taskid = ?`;
      const rows = await executeQuery(query, [req.body[field], id]);
      res.send();
    }
  );

router
  .route("/:id")
  .get(validateSelectedId, checkValidation, async (req: Request, res) => {
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

function checkIfArray(taskids: any, res) {
  if (!Array.isArray(taskids)) {
    res.status(400).json("Invalid taskids array");
  }
}

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

import { Router, Request, Response, NextFunction } from "express";
import executeQuery, {
  createGroup,
  getAllOwned,
  getGroupById,
  getSingleById,
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
  .route("/groups/:id")
  .get(validateSelectedId, checkValidation, async (req: Request, res) => {
    const userid = (req as AuthenticatedRequest).auth.userid;
    const groupid = req.params.id;

    if (
      !(await testIdExists(groupid, userid, "userstotaskgroups", "taskgroup"))
    ) {
      res.status(400).json("Id is invalid");
      return;
    }

    const rows = await getGroupById(userid, groupid, "task");
    res.json(rows);
  });

router
  .route("/groups")
  .get(async (req: Request, res) => {
    const userid = (req as AuthenticatedRequest).auth.userid;
    const rows = await getAllOwned(userid, "taskgroup");
    res.json(rows);
  })
  .post(validateGroupName, validateColor, checkValidation, async (req, res) => {
    let { body } = req;
    if (!body.taskids) {
      res.status(400).json("Missing taskids array");
      return;
    }

    let { taskids } = body;
    taskids = [...new Set(taskids)];
    let userid = (req as AuthenticatedRequest).auth.userid;

    if (!Array.isArray(taskids)) {
      res.status(400).json("Invalid taskids array");
      return;
    }

    for (let i = 0; i < taskids.length; i++) {
      const taskid = taskids[i];
      if (
        /^\D+$/.test(taskid) ||
        !(await testIdExists(taskid, userid, "userstotasks", "task"))
      ) {
        res.status(400).json("Invalid taskids array");
        return;
      }
    }

    const { insertId } = await createGroup(
      {
        id: null,
        group_name: body.group_name,
        color: body.color,
        picture_url: "path_to_picture",
      },
      "task"
    );
    await joinNewEntry(userid, insertId, "user", "taskgroup");
    taskids.forEach(async (taskid: string) => {
      await joinNewEntry(taskid, insertId, "task", "taskgroup");
    });

    res.json(insertId);
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
      const rows = await getSingleById(userid, id, "user", "task", field);
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
    const rows = await getSingleById(userid, taskid, "user", "task");

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

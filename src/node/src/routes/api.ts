import { Router, Request, Response, NextFunction } from "express";
import auth from "../middlewares/authenticate";
import user from "./user";
import tasks from "./tasks";
const router = Router();

router.use(auth);

router.use("/user", user);
router.use("/tasks", tasks);

router.use("/", (req: Request, res: Response) => {
  res.status(400).json("Bad endpoint");
});

export default router;

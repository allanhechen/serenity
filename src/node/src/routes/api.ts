import { Router, Request, Response, NextFunction } from "express";
import auth from "../middlewares/authenticate";
import users from "./user";
const router = Router();

router.use(auth);

router.use("/user", users);

router.use("/", (req: Request, res: Response) => {
  res.send("this is from the router");
});

export default router;

import { Router, Request, Response, NextFunction } from "express";
import auth from "../middlewares/authenticate";
const router = Router();

router.use(auth);

router.use("/", (req: Request, res: Response) => {
  res.send("this is from the router");
});

export default router;

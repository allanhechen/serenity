import { Router } from "express";
import auth from "../middlewares/auth";
const router = Router();

router.use(auth);

router.get("/", (req, res) => {
  res.send("this is from the router");
});

export default router;

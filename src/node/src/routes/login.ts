import { Router } from "express";
var jwt = require("jsonwebtoken");
const router = Router();

const secret = "your_secret_key";

router.get("/login", (req, res) => {
  const token = jwt.sign({ userId: "one" }, secret, { expiresIn: "1h" });
  res.send(token);
});

export default router;

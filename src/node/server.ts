import { Request, Response, NextFunction } from "express";
import express from "express";
import api from "./src/routes/api";
import auth from "./src/routes/auth";
const app = express();

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err) {
    res.status = err.status;
    res.send(err);
  }
  next();
});
app.use(express.json());

app.use("/api", api);
app.use("/auth", auth);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen("3000");

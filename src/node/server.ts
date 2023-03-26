import express from "express";
import api from "./src/routes/api";
import login from "./src/routes/login";
const app = express();

app.use("/api", api);
app.use("/login", login);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen("3000");

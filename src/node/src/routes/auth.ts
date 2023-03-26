import { Router } from "express";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import createConnection from "../ultils/db";
import checklogin from "../middlewares/checklogin";
const jwt = require("jsonwebtoken");
const router = Router();

const saltRounds = 10;
const secret = "your_secret_key";

router.post("/login", checklogin, async (req, res) => {
  let { username, password } = req.body;

  const conn = await createConnection;
  const [rows] = await conn.execute<RowDataPacket[]>(
    "SELECT userid, password FROM users WHERE username = ?",
    [username]
  );

  const user = rows[0];
  if (!user) {
    res.status(401).send("Invalid username");
    return;
  }

  bcrypt.compare(password, rows[0].password, function (err, result) {
    if (err) {
      res.status(500).send("Internal server error");
      return;
    }

    if (result) {
      const token = jwt.sign({ userid: rows[0].userid }, secret, {
        expiresIn: "1h",
      });
      res.send(token);
    } else {
      res.status(401).send("Invalid username or password");
    }
  });
});

router.post("/signup", async (req, res) => {
  let userData = req.body;

  const conn = await createConnection;
  const [rows] = await conn.execute<RowDataPacket[]>(
    "SELECT username FROM users WHERE username = ?",
    [userData.username]
  );

  if (rows[0]) {
    res.status(400).send("Username already taken");
    return;
  }

  bcrypt.hash(userData.password, saltRounds, async (err, hash) => {
    await conn.execute(
      "INSERT INTO users (name, username, password, email, gender, timezone, color, last_login_date, profile_picture_url) \
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, '/path/to/profile.jpg');",

      [
        userData.name,
        userData.username,
        hash,
        userData.email,
        userData.gender,
        userData.timezone,
        userData.color,
        userData.last_login_date,
      ]
    );
  });

  const token = jwt.sign({ userId: "one" }, secret, { expiresIn: "1h" });
  res.send(token);
});

export default router;

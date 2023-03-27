import { User } from "../utils/types";
import { Router } from "express";
import bcrypt from "bcrypt";
import { RowDataPacket } from "mysql2";
import createConnection from "../utils/db";
import {
  validateEmail,
  validateUsername,
  validatePassword,
  validateGender,
  validateUTC,
  validateColor,
  checkValidation,
} from "../middlewares/validate";

const jwt = require("jsonwebtoken");
const router = Router();

const saltRounds = 10;
const secret = "your_secret_key";

// router.use(checklogin);

router.post(
  "/login",
  validateUsername,
  validatePassword,
  checkValidation,
  async (req, res) => {
    console.log(req.body);
    let { username, password } = req.body;

    const conn = await createConnection;
    const [rows] = await conn.execute<RowDataPacket[]>(
      "SELECT userid, password FROM users WHERE username = ?",
      [username]
    );

    const user = rows[0];
    if (!user) {
      res.status(400).send("Invalid username");
      return;
    }

    bcrypt.compare(password, rows[0].password, function (err, result) {
      if (err) {
        res.status(500).send("Internal server error");
        return;
      }

      if (result) {
        const token = generateToken(user.userid);
        res.send(token);
      } else {
        res.status(400).send("Invalid username or password");
      }
    });
  }
);

router.post(
  "/signup",
  validateEmail,
  validateUsername,
  validatePassword,
  validateGender,
  validateUTC,
  validateColor,
  checkValidation,
  async (req, res) => {
    let userData = req.body;
    const usernameExists = await checkUsernameExists(userData.username);
    if (usernameExists) {
      res.status(400).send("Username already taken");
      return;
    }
    const hashedPassword = await hashPassword(userData.password);
    await insertUser(userData, hashedPassword);
    res.redirect("./login");
  }
);

async function checkUsernameExists(username: string) {
  const conn = await createConnection;
  const [rows] = await conn.execute<RowDataPacket[]>(
    "SELECT username FROM users WHERE username = ?",
    [username]
  );
  return rows[0];
}

async function hashPassword(password: string) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function insertUser(userData: User, hashedPassword: string) {
  const conn = await createConnection;
  await conn.execute(
    "INSERT INTO users (name, username, password, email, gender, timezone, color, last_login_date, profile_picture_url) \
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, '/path/to/profile.jpg');",
    [
      userData.name,
      userData.username,
      hashedPassword,
      userData.email,
      userData.gender,
      userData.timezone,
      userData.color,
      userData.last_login_date,
    ]
  );
}

function generateToken(userid: String) {
  return jwt.sign({ userid: userid }, secret, { expiresIn: "1h" });
}

export default router;

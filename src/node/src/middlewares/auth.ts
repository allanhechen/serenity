import { Request, Response } from "express";
const { expressjwt: jwt } = require("express-jwt");

const secret = "your_secret_key";

const auth = jwt({
  secret: secret,
  algorithms: ["HS256"],
  getToken: function (req: Request, res: Response) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      console.log(req.headers.authorization.split(" ")[1]);
      return req.headers.authorization.split(" ")[1];
    } else if (req.query && req.query.token) {
      console.log(req.query.token);
      return req.query.token;
    }
    return null;
  },
});

export default auth;

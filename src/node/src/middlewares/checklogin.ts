import { Request, Response, NextFunction } from "express";

const checklogin = (req: Request, res: Response, next: NextFunction) => {
  let { username, password } = req.body;
  if (!username || !password) {
    throw new Error("hello");
  }
  next();
};

export default checklogin;

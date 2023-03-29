import { Request } from "express";

export type User = {
  name: string;
  username: string;
  hashedPassword: string;
  email: string | null;
  gender: string | null;
  timezone: string | null;
  color: string | null;
  last_login_date: string;
};

export interface AuthenticatedRequest extends Request {
  auth: {
    userid: string;
    iat: number;
    exp: number;
  };
}

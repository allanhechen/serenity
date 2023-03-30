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

export type Entity = {
  id: string;
  name: string;
  importance_rating: number;
  description: string;
  color: string | null;
};

export type Future = Entity & {
  date: Date;
};

export type Past = Entity & {
  date: Date;
};

export type Task = Entity & {
  start_date: Date;
  end_date: Date;
  status: string;
  frequency: string;
  time_required: number;
};

export type Event = Entity & {
  location: string;
  start_time: Date;
  end_time: Date;
};

export interface AuthenticatedRequest extends Request {
  auth: {
    userid: string;
    iat: number;
    exp: number;
  };
}

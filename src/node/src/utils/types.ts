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

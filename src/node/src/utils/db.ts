import { createConnection, Connection } from "mysql2/promise";

const connection: Promise<Connection> = createConnection({
  host: "localhost",
  user: "root",
  password: "Adt12345",
  database: "serenity",
});

export default connection;

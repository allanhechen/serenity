const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Adt12345",
  database: "serenity",
});

export default pool;

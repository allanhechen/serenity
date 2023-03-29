import {
  createPool,
  Pool,
  PoolConnection,
  RowDataPacket,
} from "mysql2/promise";

const pool: Pool = createPool({
  host: "localhost",
  user: "root",
  password: "Adt12345",
  database: "serenity",
  connectionLimit: 10,
});

async function executeQuery(query: string, params: any[] = []): Promise<any> {
  let conn: PoolConnection | null = null;
  try {
    // Get a connection from the pool
    conn = await pool.getConnection();
    // Execute the query with the given parameters
    const [rows] = await conn.execute<RowDataPacket[]>(query, params);
    // Return the query result
    return rows;
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(`Error executing query: ${error}`);
    throw error;
  } finally {
    // Release the connection back to the pool
    if (conn) conn.release();
  }
}

export default executeQuery;

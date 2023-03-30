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

export async function getById(
  firstEntityid,
  secondEntityid,
  firstEntity,
  secondEntity
) {
  const query = `SELECT *
FROM ${secondEntity}
INNER JOIN ${firstEntity}sto${secondEntity}s ON ${secondEntity}s.${secondEntity}id = ${firstEntity}sto${secondEntity}s.${secondEntity}id
WHERE ${firstEntity}sto${secondEntity}s.${firstEntity}id = ${firstEntityid} AND ${firstEntity}sto${secondEntity}s.${secondEntity}id = ${secondEntityid};`;
  const rows = await executeQuery(query);

  if (!rows.isempty()) {
    return rows;
  } else {
    throw new Error("Id is invalid");
  }
}

/**
 * returns all entities owned by the given userid
 * @param userid
 * @param entity
 * @returns
 */
export async function getAllOwned(userid: string, entity: string) {
  const query = `SELECT *
  FROM ${entity}s
  INNER JOIN usersto${entity}s ON ${entity}s.${entity}id = usersto${entity}s.${entity}id
  WHERE usersto${entity}s.userid = ${userid} AND usersto${entity}s.${entity}id = ${entity}id;`;
  const rows = executeQuery(query);
  return rows;
}

export default executeQuery;

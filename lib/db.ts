import mysql, { type Pool, type PoolConnection } from "mysql2/promise";

declare global { var noirDb: Pool | undefined; }

function createPool() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return mysql.createPool({ uri: url, connectionLimit: 10, enableKeepAlive: true, decimalNumbers: true, charset: "utf8mb4" });
}

export const db = global.noirDb ?? createPool();
if (process.env.NODE_ENV !== "production") global.noirDb = db;

export async function transaction<T>(fn: (connection: PoolConnection) => Promise<T>): Promise<T> {
  const connection = await db.getConnection();
  try { await connection.beginTransaction(); const value = await fn(connection); await connection.commit(); return value; }
  catch (error) { await connection.rollback(); throw error; }
  finally { connection.release(); }
}

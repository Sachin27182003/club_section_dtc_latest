import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./db/schema"; // Verify this path matches your folder structure

// 1. Singleton pattern: Survive Next.js Hot Reloads
const globalForDb = global as unknown as {
  conn: mysql.Pool | undefined;
};

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is missing in .env file");
}

// 2. Create or reuse the connection pool
export const conn =
  globalForDb.conn ??
  mysql.createPool({
    uri: connectionString,
    // Limit connections to prevent MySQL from clogging
    connectionLimit: 10, 
    // Fix for the 'ssl-mode' warning you received
    ssl: {
      rejectUnauthorized: false,
    },
  });

// 3. Save the connection to the global object in development
if (process.env.NODE_ENV !== "production") globalForDb.conn = conn;

// 4. Export the Drizzle instance
export const db = drizzle(conn, { schema, mode: "default" });
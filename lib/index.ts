// lib/db/index.ts
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./db/schema";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE URL IS MISSING");
}

// Create the connection pool using your .env variable
const poolConnection = mysql.createPool({
  uri: process.env.DATABASE_URL,
});

// Export the db instance to use in your server actions
export const db = drizzle(poolConnection, { schema, mode: "default" });

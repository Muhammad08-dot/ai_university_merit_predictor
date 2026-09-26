import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

// On Vercel build time, DATABASE_URL might not be set. 
// We create a dummy pool to prevent build failures.
const pool = new Pool({
  connectionString: databaseUrl || "postgres://dummy:dummy@localhost:5432/dummy",
});

export const db = drizzle(pool);

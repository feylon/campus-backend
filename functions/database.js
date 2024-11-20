import pkg from "pg";
import dotenv from "dotenv"

dotenv.config();
const { user, database_PORT, password, host, database, DatabaseURL} = process.env;
const { Pool } = pkg;
const pool = new Pool({
  // host,
  // database,
  // user,
  // password,
  // port: database_PORT,
  connectionString : DatabaseURL,
  ssl : true
});

export default pool;

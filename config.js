require("dotenv").config();

const { Pool } = require("pg");
const isProduction = process.env.NODE_ENV === "production";

const connectionString = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;



const pool = new Pool({
  connectionString: isProduction ? process.env.DATABASE_URL : connectionString,
  ssl: isProduction,
});

pool.connect()
  .then(() => {
    console.log("✅ Database connected successfully");
    console.log("DB String :-",connectionString);
  })
  .catch((err) => {
    console.log("DB String :-",connectionString);
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  });

module.exports = pool;
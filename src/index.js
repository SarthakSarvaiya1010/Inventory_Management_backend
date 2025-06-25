console.log("hello start node server");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3200;
const path = require("path");
const indexRouter = require("./routes/index");
const imageRouter = require("./routes/images");
var cors = require("cors");
var cookieParser = require("cookie-parser");
const pool = require("../config");

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(cors());
app.use("/", indexRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("public", express.static("public"));
app.use("/images", imageRouter);
app.use(cookieParser());

// ✅ Check PostgreSQL connection on startup
pool
  .query("SELECT NOW()")
  .then((result) => {
    console.log("✅ Database connected successfully at:", result.rows[0].now);
  })
  .catch((err) => {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1); // Exit the server if DB fails
  });

app.get("/getcookie", (req, res) => {
  //show the saved cookies
  res.send(req.cookies);
});
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
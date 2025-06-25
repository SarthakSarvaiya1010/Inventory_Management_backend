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
const pool = require('../config'); // or wherever your pool is




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

app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send({ status: "ok", time: result.rows[0].now });
  } catch (err) {
    res.status(500).send({ status: "error", message: err.message });
  }
});


app.get("/getcookie", (req, res) => {
  //show the saved cookies
  res.send(req.cookies);
});
app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});
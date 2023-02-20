console.log("hello start node server");

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = 3200;
const path = require("path");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const imageRouter = require("./routes/images");
// const PDFDocument = require("pdfkit");
// const doc = new PDFDocument();
// const fs = require("fs");

// doc.pipe(fs.createWriteStream("example12345678.pdf"));
// doc.fontSize(27).text("This the article for GeeksforGeeks", 100, 100);

// doc
//   .addPage()
//   .fontSize(15)
//   .text("Generating PDF with the help of pdfkit", 100, 100);

// doc
//   .scale(0.6)
//   .translate(470, -380)
//   .path("M 250,75 L 323,301 131,161 369,161 177,301 z")
//   .fill("red", "even-odd")
//   .restore();
// doc
//   .addPage()
//   .fillColor("blue")
//   .text("The link for GeeksforGeeks website", 100, 100)

//   .link(100, 100, 160, 27, "https://www.geeksforgeeks.org/");
// doc.end();
app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use("/", indexRouter);
// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/public", express.static("public"));
app.use("/images", imageRouter);

app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

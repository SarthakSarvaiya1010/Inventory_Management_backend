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

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
const allowedOrigins = [
  "http://localhost:3000",           
  "https://inventory-management-kappa.vercel.app/"
];
// app.use(cors());
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like curl or postman)
    if(!origin) return callback(null, true);
    if(allowedOrigins.indexOf(origin) === -1){
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,  // if you use cookies or authorization headers
}));
app.use("/", indexRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("public", express.static("public"));
app.use("/images", imageRouter);
app.use(cookieParser());

app.get("/getcookie", (req, res) => {
  //show the saved cookies
  res.send(req.cookies);
});


app.listen(port, () => {
  console.log(`App running on port ${port}.`);
});

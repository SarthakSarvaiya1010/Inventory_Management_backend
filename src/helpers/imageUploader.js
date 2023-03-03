const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("🚀 ~ file: upload.ts:11 ~ file");
    cb(
      null,
      path.join(  
        path.dirname("/Inventory_Management_backend/render/"),
        "/Inventory_Management_backend/Public/images/"
      )
    );
  },
  filename: function (req, file, cb) {
    cb(null, new Date().getTime() + path.extname(file.originalname));
  },
});

// const fileFilter = (req, file, cb) => {
//   if (
//     file.mimetype === "image/jpeg" ||
//     file.mimetype === "image/png" ||
//     file.mimetype.split("/")[1] === "pdf"
//   ) {
//     cb(null, true);
//   } else {
//     req.fileValidationError = "Forbidden extension";
//     cb(null, false);
//   }
// };

const uploads = multer({
  limits: {
    fileSize: 307200,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Please upload a valid image file"));
    }
    cb(undefined, true);
  },
});

module.exports = {
  upload: uploads,
};

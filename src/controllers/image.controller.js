function upload(req, res) {
  if (req.file.filename) {
    console.log("req.file.filename", req.file.filename);
    res.status(201).json({
      message: "image upload successfully",
      url: req.file.filename,
    });
  } else {
    res.status(500).json({
      message: "Something went Wrong",
    });
  }
}

module.exports = {
  upload: upload,
};

const express = require("express");
const router = express.Router();
const stockcontroller = require("../controllers/Stock.controller");

router.get(
  "/stockreport",
  stockcontroller.StockReport,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;

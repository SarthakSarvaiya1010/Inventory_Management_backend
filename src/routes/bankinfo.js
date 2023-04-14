const express = require("express");
const router = express.Router();
const bankinfocontroller = require("../controllers/bankinfo.controller");

router.get(
  "/bankinfo/:user_id",
  bankinfocontroller.BankInfoList,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.post(
  "/bankinfo",
  bankinfocontroller.AddBankInfo,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;

const express = require("express");
const router = express.Router();
const bankcontroller = require("../controllers/bank.controller");

router.get(
  "/bank",
  bankcontroller.BankList,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.post(
  "/bank",
  bankcontroller.AddBankList,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get(
  "/bank/:purchase_id",
  bankcontroller.BankInfoBypurchase_id,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;

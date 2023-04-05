const express = require("express");
const router = express.Router();
const purchasebillcontroller = require("../controllers/purchasebill.controller");

router.get(
  "/purchasebill",
  purchasebillcontroller.PurchaseBillList,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.post(
  "/addpurchasebill",
  purchasebillcontroller.AddPurchasebill,
  async (req, res, next) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res
      .status(400)
      .send({ message: error.message, status: "failed", statusCode: "400" });
  }
);
router.put(
  "/Updatepurchasebill/:purchase_id",
  purchasebillcontroller.UpdatePurchaseBill,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get(
  "/purchaselistbyid/:purchase_id",
  purchasebillcontroller.GetPurchaseListByID,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.put(
  "/updatepurchasedata/:purchase_id",
  purchasebillcontroller.UpdatePurchaseData,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
module.exports = router;

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
router.get(
  "/purchasebilldeletelist",
  purchasebillcontroller.PurchaseBillDeleteList,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get(
  "/purchasebillfilterlist/:Customer_name",
  purchasebillcontroller.PurchaseBillfilterList,
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
router.delete(
  "/deletepurchase/:purchase_id",
  purchasebillcontroller.DeletePurchase,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete(
  "/permanentDeletepurchase/:purchase_id",
  purchasebillcontroller.PermentDeletePurchase,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get(
  "/getpurchasepage",
  purchasebillcontroller.GetPurchasePage,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
module.exports = router;

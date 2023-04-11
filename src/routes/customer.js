const express = require("express");
const router = express.Router();
const customercontroller = require("../controllers/customers.controller");

router.get(
  "/customers",
  customercontroller.customerList,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get(
  "/delete/customers",
  customercontroller.GetDeletedCustomer,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get(
  "/customersname",
  customercontroller.GetCustomerName,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.post(
  "/customers",
  customercontroller.createCustomers,
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
  "/edit/customers/:customer_id",
  customercontroller.editCustomerinfo,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.delete(
  "/permanent/delete/customers/:customer_id",
  customercontroller.PermentDeleteCustomer,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.delete(
  "/delete/customers/:customer_id",
  customercontroller.Removedcustomer,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.get(
  "/customers/:id",
  customercontroller.customerListById,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
module.exports = router;

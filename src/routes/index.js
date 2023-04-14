const express = require("express");
const users = require("./user");
const products = require("./products");
const customer = require("./customer");
const companylist = require("./companylist");
const tax = require("./tax");
const purchasebill = require("./purchasebill");
const invoice = require("./invoice");
const Stock = require("./Stock");
const bankinfo = require("./bankinfo");
const bank = require("./bank");
const router = express.Router();

// const api = new router();

router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.use(users);
router.use(products);
router.use(customer);
router.use(companylist);
router.use(tax);
router.use(invoice);
router.use(purchasebill);
router.use(Stock);
router.use(bank);
router.use(bankinfo);

module.exports = router;

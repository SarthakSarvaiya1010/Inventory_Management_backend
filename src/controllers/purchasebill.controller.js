require("dotenv").config();
var auth = require("../helpers/auth");
var purchasebill = require("../models/purchasebill");
var filter = require("../helpers/filter");
var formValidation = require("../helpers/formValidation");
var customer = require("../models/customer");
var product = require("../models/products");

const PurchaseBillList = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        purchasebill
          .GetPurchaseBillList(data_s)
          .then(async function (result) {
            return res.status(200).json(result);
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: 400,
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization Error",
        statusCode: "403",
      });
    });
};

const AddPurchasebill = (req, res) => {
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        purchasebill
          .Addpurchasebill(req.body)
          .then(async function (result) {
            const test = [];
            let count = 0;
            console.log("req?.body?.productdata", req?.body?.productdata);
            req?.body?.productdata.map((e, index) => {
              index++;
              product
                .getProductById(e.product_id)
                .then(async function (result) {
                  test.push({
                    product_name: result?.product_name,
                    bill_no: index,
                    hsn: e?.hsn,
                    weight: e?.weight,
                    rate: e?.rate,
                    amount: e?.amount,
                  });
                  count++;
                  if (count === req?.body?.productdata.length) {
                    res.status(200).json({
                      status: "success",
                      statusCode: "200",
                      message: "success! Create Purchase Bill  suucessfully",
                    });
                  }
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 430,
                  });
                });
            });
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: 415,
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (result) {
      return res.status(403).json({
        message: "Authorization error",
        statusCode: "403",
      });
    });
};

const UpdatePurchaseBill = (req, res) => {
  let tokanData = req.headers["authorization"];
  let { purchase_id } = req.params;
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        purchasebill
          .getBypurchasebillId(purchase_id)
          .then(async function (result) {
            if (result) {
              purchasebill
                .UpdatepurchasebillInfo(req.body, purchase_id)
                .then(async function (results) {
                  res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success! Update invoice suucessfully",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: "400",
                  });
                });
            } else {
              return res.status(200).json({
                message: "user not exist",
                statusCode: "400",
              });
            }
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization Error",
        statusCode: "403",
      });
    });
};
const GetPurchaseListByID = (req, res) => {
  const { purchase_id } = req.params;
  let id = purchase_id;
  let tokanData = req.headers["authorization"];
  let InvoiceDataListById = [];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        purchasebill
          .getPurchaseListById(id)
          .then(async function (invoicelistbyid) {
            purchasebill
              .getproductListByPurchaseId(id)
              .then(async function (productlistbyid) {
                if (invoicelistbyid && productlistbyid) {
                  let invoice = {};
                  invoice = invoicelistbyid;
                  invoice["productlistdata"] = productlistbyid;
                  InvoiceDataListById.push(invoice);
                  return res.status(200).json(InvoiceDataListById);
                }
              })
              .catch(function (error) {
                return res.status(400).json({
                  message: error,
                  statusCode: 400,
                });
              })
              .catch(function (error) {
                return res.status(400).json({
                  message: error,
                  statusCode: 400,
                });
              });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization error",
        statusCode: "403",
      });
    });
};

const UpdatePurchaseData = (req, res) => {
  let tokanData = req.headers["authorization"];
  const { purchase_id } = req.params;
  let id = purchase_id;
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        purchasebill
          .getPurchaseListById(id)
          .then(async function (result) {
            if (result) {
              // if (req.body.company_id && req.body.role_id) {
              purchasebill
                .UpdatePurchaseInfo(req.body, id)
                .then(async function (results) {
                  return res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success! Purchase bill updated suucessfully",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 400,
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 400,
                  });
                });
              // }
            } else {
              return res.status(200).json({
                message: "user not exist",
                statusCode: "400",
              });
            }
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: 400,
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization Error",
        statusCode: "403",
      });
    });
};

module.exports = {
  PurchaseBillList,
  AddPurchasebill,
  UpdatePurchaseBill,
  GetPurchaseListByID,
  UpdatePurchaseData,
};

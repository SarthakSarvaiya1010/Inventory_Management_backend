require("dotenv").config();
var auth = require("../helpers/auth");
var purchasebill = require("../models/purchasebill");
var filter = require("../helpers/filter");
const fromatedate = require("../helpers/helper");
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
const PurchaseBillfilterList = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);
  let { Customer_name } = req.params;
  console.log("Customer_name", Customer_name);
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        purchasebill
          .GetPurchaseBillfilterList(data_s)
          .then(async function (result) {
            return res.status(200).json(result);
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
const PurchaseBillDeleteList = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        purchasebill
          .GetPurchaseBillDeleteList(data_s)
          .then(async function (result) {
            return res.status(200).json(result);
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
const GetPurchasePage = (req, res) => {
  let tokanData = req.headers["authorization"];
  let date = fromatedate.formatDate(new Date());
  let data_s = filter.filter(req?.query);

  let purchasedata = [];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        customer
          .getCustomers(data_s)
          .then(async function (customerlist) {
            product
              .getProducts(data_s)
              .then(async function (productlist) {
                if (productlist.length && customerlist.length) {
                  purchasebill
                    .getpurchaseLastRow()
                    .then(async function (result) {
                      if (result[0].max !== null) {
                        const bill_no =
                          parseInt(result[0].max) > 9
                            ? parseInt(result[0].max) + 1
                            : `0${parseInt(result[0].max) + 1}`;
                        let invoice = {};
                        invoice["bill_no"] = bill_no;
                        invoice["date"] = date;
                        invoice["CustomerList"] = customerlist
                          ? customerlist
                          : null;
                        invoice["productList"] = productlist
                          ? productlist
                          : null;
                        purchasedata.push(invoice);
                        return res.status(200).json(purchasedata);
                      } else {
                        let invoice = {};
                        invoice["bill_no"] = "01";
                        invoice["date"] = date;
                        invoice["CustomerList"] = customerlist
                          ? customerlist
                          : null;
                        invoice["productList"] = productlist
                          ? productlist
                          : null;
                        purchasedata.push(invoice);
                        return res.status(200).json(purchasedata);
                      }
                    });
                } else {
                  return res.status(400).json({
                    message: "productlist and customerlist data not found",
                  });
                }
              })
              .catch(function (err) {
                return res.status(400).json({
                  message: "productlist data not found",
                  statusCode: "400",
                });
              });
          })
          .catch(function (err) {
            return res.status(400).json({
              message: "customer  data not found",
              statusCode: "400",
            });
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
        message: "Authorization error",
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
          .AddPurchaseBill(req.body)
          .then(async function (result) {
            return res.status(200).json({
              status: "success",
              statusCode: "200",
              message: "success! Create Purchase Bill  suucessfully",
            });
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
                  statusCode: "400",
                });
              })
              .catch(function (error) {
                return res.status(400).json({
                  message: error,
                  statusCode: "400",
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
                    statusCode: "400",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: "400",
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

const DeletePurchase = (req, res) => {
  const { purchase_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        purchasebill
          .IsPurchaseExistsByPurchase(purchase_id)
          .then(async function (result) {
            if (result) {
              purchasebill
                .DeletePurchase(purchase_id)
                .then(async function (result) {
                  return res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success! PurchaseBill  Deleted suucessfully",
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

const PermentDeletePurchase = (req, res) => {
  const { purchase_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        purchasebill
          .IsPurchaseExistsByPurchase(purchase_id)
          .then(async function (result) {
            if (result) {
              purchasebill
                .Permentdeletedpurchase(purchase_id)
                .then(async function (result) {
                  return res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success! invoiceData Deleted suucessfully",
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

module.exports = {
  PurchaseBillList,
  AddPurchasebill,
  UpdatePurchaseBill,
  GetPurchaseListByID,
  UpdatePurchaseData,
  PurchaseBillDeleteList,
  DeletePurchase,
  GetPurchasePage,
  PurchaseBillfilterList,
  PermentDeletePurchase,
};

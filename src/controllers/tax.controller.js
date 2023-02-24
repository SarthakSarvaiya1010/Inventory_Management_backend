require("dotenv").config();
var auth = require("../helpers/auth");
var tax = require("../models/tax");
var filter = require("../helpers/filter");
var formValidation = require("../helpers/formValidation");

const TaxList = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        tax
          .GetTaxList(data_s)
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
const GetDeletedTaxList = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        tax
          .GetDeletedTax(data_s)
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

const AddNewTax = (req, res) => {
  let tokanData = req.headers["authorization"];
  let error = formValidation.TaxformValidation(req.body);
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        if (!Object.keys(error).length) {
          tax
            .AddNewtax(req.body)
            .then(async function (result) {
              return res.status(200).json({
                message: "Succesfully! tax  Added.",
                statusCode: "200",
              });
            })
            .catch(function (error) {
              return res.status(400).json({
                message: error,
                statusCode: 400,
              });
            });
        } else {
          return res.status(400).json({
            message: error,
            statusCode: 400,
          });
        }
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

const EditTaxData = (req, res) => {
  const { tax_id } = req.params;
  let tokanData = req.headers["authorization"];
  let error = formValidation.TaxformValidation(req.body);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        tax
          .isTaxExists(tax_id)
          .then(async function (result) {
            console.log("result===>", result);
            if (result) {
              if (!Object.keys(error).length) {
                tax
                  .EditTaxdata({
                    tax_id: tax_id,
                    tax_name: req.body.tax_name,
                    tax_rate: req.body.tax_rate,
                    tax_country: req.body.tax_country,
                    isactive: req.body.isactive,
                  })
                  .then(async function (result) {
                    return res.status(200).json({
                      status: "success",
                      statusCode: "200",
                      message: "success! tax Data  updated suucessfully",
                    });
                  })
                  .catch(function (error) {
                    return res.status(400).json({
                      message: error,
                      statusCode: 400,
                    });
                  });
              } else {
                return res.status(400).json({
                  message: error,
                  statusCode: 400,
                });
              }
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
const PermanentDeleteTax = (req, res) => {
  const { tax_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        tax
          .isTaxExists(tax_id)
          .then(async function (result) {
            if (result) {
              tax
                .PermanentDeletetax(tax_id)
                .then(async function (result) {
                  return res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success!  tax deleted suucessfully",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 400,
                  });
                });
            } else {
              return res.status(400).json({
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
          message: "Authorization Error",
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
const DeleteTax = (req, res) => {
  const { tax_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        tax
          .isTaxExists(tax_id)
          .then(async function (result) {
            if (result) {
              tax
                .Deletetax(tax_id)
                .then(async function (result) {
                  return res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success!  tax deleted suucessfully",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 400,
                  });
                });
            } else {
              return res.status(400).json({
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
          message: "Authorization Error",
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

const TaxListById = (req, res) => {
  const { tax_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        tax
          .GetTaxListsById(tax_id)
          .then(async function (result) {
            return res.status(200).json(result);
          })
          .catch(function (error) {
            return res.status(400).json({ message: error, statusCode: 400 });
          });
      } else {
        return res
          .status(403)
          .json({ message: "Authorization error", statusCode: "403" });
      }
    })
    .catch(function (error) {
      return res
        .status(403)
        .json({ message: "Authorization Error", statusCode: "403" });
    });
};
module.exports = {
  TaxList,
  GetDeletedTaxList,
  AddNewTax,
  EditTaxData,
  PermanentDeleteTax,
  DeleteTax,
  TaxListById,
};

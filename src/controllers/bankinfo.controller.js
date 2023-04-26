require("dotenv").config();
var auth = require("../helpers/auth");
var bankinfo = require("../models/bankinfo");
var filter = require("../helpers/filter");
var formValidation = require("../helpers/formValidation");

const BankInfoList = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);
  const { user_id } = req.params;
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        bankinfo
          .GetBankInfoList(data_s, user_id)
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

const AddBankInfo = (req, res) => {
  let tokanData = req.headers["authorization"];
  let error = formValidation.BankformValidation(req.body);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        if (!Object.keys(error).length) {
          bankinfo
            .AddNewbankInfo(req.body)
            .then(async function (result) {
              return res.status(200).json({
                message: "Succesfully! data  Added.",
                statusCode: "200",
              });
            })
            .catch(function (error) {
              return res.status(400).json({
                message: error,
                statusCode: "400",
              });
            });
        } else {
          return res.status(400).json({
            message: error,
            statusCode: "400",
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

const BankInfoEdit = (req, res) => {
  let tokanData = req.headers["authorization"];
  const { bank_id } = req.params;
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        bankinfo
          .GetBankInfoById(bank_id)
          .then(async function (result) {
            bankinfo
              .Getprimary_bankById(bank_id)
              .then(async function (ress) {
                return res.status(200).json({
                  balance: result.balance,
                  bank_info_no: result.bank_info_no,
                  bank_name: result.bank_name,
                  user_id: result.user_id,
                  primary_bank: ress ? 1 : 0,
                });
              })
              .catch(function (error) {
                return res.status(400).json({
                  message: error,
                  statusCode: "400",
                });
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
        message: "Authorization Error",
        statusCode: "403",
      });
    });
};
const BankInfoupdate = (req, res) => {
  let tokanData = req.headers["authorization"];
  const { bank_id } = req.params;
  let error = formValidation.BankformValidation(req.body);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        if (!Object.keys(error).length) {
          bankinfo
            .GetBankInfoById(bank_id)
            .then(async function (result) {
              if (result) {
                bankinfo
                  .UpdateBankInfo(req.body, bank_id)
                  .then(async function (ress) {
                    return res.status(200).json({
                      message: "Succesfully! data Update.",
                      statusCode: "200",
                    });
                  })
                  .catch(function (error) {
                    return res.status(400).json({
                      message: error,
                      statusCode: "400",
                    });
                  });
              } else {
                return res.status(400).json({
                  message: "BankInfo not found",
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
          return res.status(400).json({
            message: error,
            statusCode: "400",
          });
        }
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
const BankInfodelete = (req, res) => {
  let tokanData = req.headers["authorization"];
  const { bank_id } = req.params;
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        bankinfo
          .GetBankInfoById(bank_id)
          .then(async function (result) {
            if (result) {
              bankinfo
                .DeleteBankInfo(bank_id)
                .then(async function (ress) {
                  return res.status(200).json({
                    message: "Succesfully! data delete.",
                    statusCode: "200",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: "400",
                  });
                });
            } else {
              return res.status(400).json({
                message: "BankInfo not found",
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
const BankInfobalanceupdate = (req, res) => {
  let tokanData = req.headers["authorization"];
  let error = formValidation.BankformValidation(req.body);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        if (!Object.keys(error).length) {
          bankinfo
            .UpdateBankbalanceInfo(req.body)
            .then(async function (ress) {
              return res.status(200).json({
                message: "Succesfully! data Update.",
                statusCode: "200",
              });
            })
            .catch(function (error) {
              return res.status(400).json({
                message: error,
                statusCode: "400",
              });
            });
        } else {
          return res.status(400).json({
            message: error,
            statusCode: "400",
          });
        }
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
  BankInfoList,
  AddBankInfo,
  BankInfoEdit,
  BankInfoupdate,
  BankInfodelete,
  BankInfobalanceupdate,
};

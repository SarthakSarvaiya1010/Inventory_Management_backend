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

module.exports = {
  BankInfoList,
  AddBankInfo,
};

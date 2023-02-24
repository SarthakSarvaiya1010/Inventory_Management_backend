require("dotenv").config();
var auth = require("../helpers/auth");
var customer = require("../models/customer");
var filter = require("../helpers/filter");
var formValidation = require("../helpers/formValidation");

const customerList = async function (req, res) {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        customer
          .getCustomers(data_s)
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

const GetDeletedCustomer = (req, res) => {
  let data_s = filter.filter(req?.query);

  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        customer
          .GetDeletedcustomer(data_s)
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

const createCustomers = async function (req, res) {
  let tokanData = req.headers["authorization"];
  let error = formValidation.CustomersformValidation(req.body);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        if (!Object.keys(error).length) {
          customer
            .AddCustomer(req.body)
            .then(async function (result) {
              return res.status(200).json({
                message: "Succesfully! your account created",
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
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization Error",
        statusCode: "403",
      });
    });
};

const editCustomerinfo = (req, res) => {
  let tokanData = req.headers["authorization"];
  let error = formValidation.CustomersformValidation(req.body);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        if (!Object.keys(error).length) {
          customer
            .EditCustomerInfo({
              customer_id: req.params.customer_id,
              customer_name: req.body.customer_name,
              mobile_no: req.body.mobile_no,
              address: req.body.address,
              email: req.body.email,
              tin_no: req.body.tin_no,
            })
            .then(function (result) {
              return res.status(200).json({
                status: "success",
                statusCode: "200",
                message: "success! customer Info updated suucessfully",
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
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization error",
        statusCode: "403",
      });
    });
};

const PermentDeleteCustomer = (req, res) => {
  const { customer_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        customer
          .RemovedCustomer(customer_id)
          .then(function (result) {
            return res.status(200).json({
              status: "success",
              statusCode: "200",
              message: "success! Customer deleted suucessfully",
            });
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
        message: "Authorization error",
        statusCode: "403",
      });
    });
};
const Removedcustomer = (req, res) => {
  const { customer_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        customer
          .RemovedCustomerFromTheList(customer_id)
          .then(function (result) {
            return res.status(200).json({
              status: "success",
              statusCode: "200",
              message: "success! customer deleted suucessfully",
            });
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
        message: "Authorization error",
        statusCode: "403",
      });
    });
};

const customerListById = async function (req, res) {
  const { id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        customer
          .getCustomersById(id)
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
  customerList,
  GetDeletedCustomer,
  createCustomers,
  editCustomerinfo,
  PermentDeleteCustomer,
  Removedcustomer,
  customerListById,
};

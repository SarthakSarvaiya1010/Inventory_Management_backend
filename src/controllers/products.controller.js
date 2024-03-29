require("dotenv").config();
var auth = require("../helpers/auth");
var products = require("../models/products");
var filter = require("../helpers/filter");
var formValidation = require("../helpers/formValidation");

const productlist = async function (req, res) {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        // test.printPDF();
        products
          .getProducts(data_s)
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
const setcookie = async function (req, res) {
  res.cookie(`Cookie token name`, {
    secret: "yoursecret",
    cookie: { maxAge: 8000 },
  });
  res.send("Cookie have been saved successfully");
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  };
};
const productlistData = async function (req, res) {
  let data_s = filter.filter(req?.query);
  products
    .getProducts(data_s)
    .then(async function (result) {
      return res.status(200).json(result);
    })
    .catch(function (error) {
      return res.status(400).json({
        message: error,
        statusCode: "400",
      });
    });
};
const GetDeletedProduct = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        products
          .getDeletedProducts(data_s)
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
const createProducts = async function (req, res) {
  let tokanData = req.headers["authorization"];
  let error = formValidation.formValidation(
    JSON.parse(JSON.stringify(req.body))
  );
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        const base64Data = req?.file
          ? Buffer.from(req?.file?.buffer).toString("base64")
          : null;
        let image_src = base64Data;
        if (!Object.keys(error).length) {
          products
            .AddProduct(JSON.parse(JSON.stringify(req.body)), image_src)
            .then(async function (result) {
              return res.status(200).json({
                message: "Succesfully! product Added",
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
const DeleteProduct = (req, res) => {
  const { product_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        // products
        //   .getProductByUUId(product_uuid)
        // .then(function (productdata) {
        // if (productdata) {
        products
          .deleteproduct(product_id)
          .then(function (result) {
            return res.status(200).json({
              status: "success",
              statusCode: "200",
              message: "success! product deleted suucessfully",
            });
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
        // }
        // })
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

const PermentDeleteProduct = (req, res) => {
  const { product_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        // products
        //   .getProductByUUId(product_uuid)
        // .then(function (productdata) {
        // if (productdata) {
        products
          .PermentDeleteproduct(product_id)
          .then(function (result) {
            return res.status(200).json({
              status: "success",
              statusCode: "200",
              message: "success! product deleted suucessfully",
            });
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
        // }
        // })
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

const updateProducts = (req, res) => {
  let tokanData = req.headers["authorization"];
  let error = formValidation.formValidation(req.body);
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        const base64Data = req?.file
          ? Buffer.from(req?.file?.buffer).toString("base64")
          : null;
        let image_src = base64Data;
        if (!Object.keys(error).length) {
          products
            .updateproduct({
              product_id: req.params.product_id,
              product_name: req.body.product_name,
              description: req.body.description,
              product_type: req.body.product_type,
              weight: req.body.weight,
              hsn: req.body.hsn,
              quantity: req.body.quantity,
              image_src: image_src,
            })
            .then(async function (result) {
              return res.status(200).json({
                status: "success",
                statusCode: "200",
                message: "success! product updated suucessfully",
                base64Data: base64Data,
              });
            })
            .catch(function (error) {
              return res.status(400).json({
                message: error,
                statusCode: "400",
                image_src: null,
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
        message: "Authorization error",
        statusCode: "403",
      });
    });
};
const GetOneProductByID = async function (req, res) {
  let tokanData = req.headers["authorization"];
  const { id } = req.params;
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        products
          .getProductById(id)
          .then(async function (result) {
            return res.status(200).json(result);
          })
          .catch(function (error) {
            return res.status(400).json({ message: error, statusCode: "400" });
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
  productlist,
  GetDeletedProduct,
  createProducts,
  updateProducts,
  PermentDeleteProduct,
  DeleteProduct,
  GetOneProductByID,
  productlistData,
  setcookie,
};

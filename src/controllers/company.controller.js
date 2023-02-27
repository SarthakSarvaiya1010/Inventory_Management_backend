require("dotenv").config();
var auth = require("../helpers/auth");
var company = require("../models/company");
var filter = require("../helpers/filter");
var formValidation = require("../helpers/formValidation");

const GetCompanyList = async function (req, res) {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        company
          .getComapnyList(data_s)
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

const GetDeletedCompany = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        company
          .getDeletedComapny(data_s)
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
const GetCompanyByCompanyId = (req, res) => {
  let tokanData = req.headers["authorization"];
  const { id } = req.params;
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        company
          .getComapnyBycompanyId(id)
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

const AddCompany_info = async function (req, res) {
  let tokanData = req.headers["authorization"];
  let error = formValidation.CompanyformValidation(req.body);
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        if (!req.file) {
          return res.status(400).send({
            message: "No file received or invalid file type",
            success: false,
          });
        } else {
          let image_src = req.file ? req.file.path : null;
          console.log("image", image_src);
          let {
            company_name,
            website,
            phone_no,
            mobile_no,
            company_address,
            terms_condition,
            fax_no,
            tin_gst_no,
          } = req.body;
          if (!Object.keys(error).length) {
            company
              .AddCompany({
                company_name,
                image_src,
                website,
                phone_no,
                mobile_no,
                company_address,
                terms_condition,
                fax_no,
                tin_gst_no,
              })
              .then(async function (result) {
                return res.status(200).json({
                  message: "Succesfully! your Company Added.",
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

const EditCompanyInfo = (req, res) => {
  let tokanData = req.headers["authorization"];
  let error = formValidation.CompanyformValidation(req.body);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      console.log("result", result);
      if (result) {
        company
          .isCompanyExists(req.params.company_id)
          .then(async function (result) {
            if (result) {
              console.log("result=================", result);
              let image_src = req.file ? req.file.path : req.body.image_src;
              console.log("image______________", image_src);
              // if (req.body.company_id && req.body.role_id) {
              if (!Object.keys(error).length) {
                company
                  .Editcompanyinfo({
                    company_id: req.params.company_id,
                    company_name: req.body.company_name,
                    image_src: image_src,
                    website: req.body.website,
                    phone_no: req.body.phone_no,
                    mobile_no: req.body.mobile_no,
                    company_address: req.body.company_address,
                    terms_condition: req.body.terms_condition,
                    fax_no: req.body.fax_no,
                    tin_gst_no: req.body.tin_gst_no,
                  })
                  .then(async function (result) {
                    return res.status(200).json({
                      status: "success",
                      statusCode: "200",
                      message: "success! company Data  updated suucessfully",
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
const PermentDeleteCompany = (req, res) => {
  const { company_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        company
          .isCompanyExists(company_id)
          .then(async function (result) {
            if (result) {
              company
                .Permentdeletedcompany(company_id)
                .then(async function (result) {
                  return res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success! company Deleted suucessfully",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 400,
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
const DeleteCompany = (req, res) => {
  const { company_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        company
          .isCompanyExists(company_id)
          .then(async function (result) {
            if (result) {
              company
                .Deletecompany(company_id)
                .then(async function (result) {
                  return res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success! company Deleted suucessfully",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 400,
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
  GetCompanyList,
  GetDeletedCompany,
  AddCompany_info,
  EditCompanyInfo,
  PermentDeleteCompany,
  DeleteCompany,
  GetCompanyByCompanyId,
};

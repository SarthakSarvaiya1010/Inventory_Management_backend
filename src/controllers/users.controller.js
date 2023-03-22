require("dotenv").config();
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");
var User = require("../models/user");
var auth = require("../helpers/auth");
var filter = require("../helpers/filter");
const crypto = require("crypto");
const formatDate = require("../helpers/helper");
const Email = require("../helpers/email");
var d = new Date();

const dformat = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

var d1 = formatDate.formatDate(new Date());
const time = `${d1} ${dformat}`;
const listUser = async function (req, res) {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        User.getUsers(data_s)
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
const GetDeletedUsers = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        User.getDeletedUsers(data_s)
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
const GetUsersByUser_uuId = (req, res) => {
  let tokanData = req.headers["authorization"];
  const { user_uuid } = req.params;

  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        User.getUserbyuser_uuid(user_uuid)
          .then(async function (result) {
            User.getComapnyByuserId(result.user_id)
              .then(async function (results) {
                let user = {};
                user["user_uuid"] = result.user_uuid;
                user["name"] = result.name;
                user["email"] = result.email;
                user["mobile_no"] = result.mobile_no;
                user["image_src"] = result.image_src;
                user["address"] = result.address;
                user["role_id"] = result.role_id;
                user["isactive"] = result.isactive;
                user["password"] = result.password;
                user["deleted_flag"] = result.deleted_flag;
                user["company_id"] = results.company_id;
                return res.status(200).json(user);
              })
              .catch(function (error) {
                return res.status(400).json({
                  message: error,
                  statusCode: 400,
                });
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
        message: "Authorization Error",
        statusCode: "403",
      });
    });
};
const createUser = async function (req, res) {
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        if (!req?.file?.buffer) {
          return res.status(400).send({
            message: "No file received or invalid file type",
            success: false,
          });
        } else {
          User.isUserExists(req.body.email).then((isExists) => {
            if (isExists) {
              return res.status(400).json({
                message: "email is taken",
                statusCode: "400",
              });
            } else {
              const base64Data = req?.file
                ? Buffer.from(req?.file?.buffer).toString("base64")
                : null;
              let image_src = base64Data;

              let {
                name,
                email,
                password,
                mobile_no,
                address,
                role_id,
                company_id,
              } = req.body;
              User.AddUser({
                name,
                email,
                password,
                mobile_no,
                address,
                role_id,
                company_id,
                image_src,
              })
                .then(async function (result) {
                  return res.status(200).json({
                    message: "Succesfully! user Added",
                    statusCode: "200",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 400,
                  });
                });
            }
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
const updateUser = (req, res) => {
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        User.UserGetByUUID(req.params.user_uuid)
          .then(async function (result) {
            if (result) {
              if (result.password === req.body.password) {
                if (req.body.company_id && req.body.role_id) {
                  User.UpdateuserWithoutPassword({
                    user_id: result.user_id,
                    name: req.body.name,
                    email: req.body.email,
                    mobile_no: req.body.mobile_no,
                    address: req.body.address,
                    role_id: req.body.role_id,
                    company_id: req.body.company_id,
                    image_src: image_src,
                  })
                    .then(async function (result) {
                      return res.status(200).json({
                        status: "success",
                        statusCode: "200",
                        message: "success! user data updated suucessfully",
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
                    message:
                      "Required, please select company and select your role.",
                    statusCode: "400",
                  });
                }
              } else {
                const base64Data = req?.file
                  ? Buffer.from(req?.file?.buffer).toString("base64")
                  : null;
                let image_src = base64Data;
                if (req.body.company_id && req.body.role_id) {
                  User.Updateuser({
                    user_id: result.user_id,
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password,
                    mobile_no: req.body.mobile_no,
                    address: req.body.address,
                    role_id: req.body.role_id,
                    company_id: req.body.company_id,
                    image_src: image_src,
                  })
                    .then(async function (result) {
                      return res.status(200).json({
                        status: "success",
                        statusCode: "200",
                        message: "success! user data updated suucessfully",
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
                    message:
                      "Required, please select company and select your role.",
                    statusCode: "400",
                  });
                }
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

const PermentDeleteUser = (req, res) => {
  const { user_uuid } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(function (result) {
      if (result) {
        User.UserGetByUUID(user_uuid).then(async function (result) {
          if (result) {
            User.PermentDeleteuser(result.user_id)
              .then(async function (result) {
                return res.status(200).json({
                  message: "deleted successfully",
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
            return res.status(200).json({
              message: "user not exist",
              statusCode: "400",
            });
          }
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

const DeleteUser = (req, res) => {
  const { user_uuid } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(function (result) {
      if (result) {
        User.UserGetByUUID(user_uuid).then(async function (result) {
          if (result) {
            User.deleteuser(result.user_id)
              .then(async function (result) {
                return res.status(200).json({
                  message: "deleted successfully",
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
            return res.status(200).json({
              message: "user not exist",
              statusCode: "400",
            });
          }
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

const Login = (req, res) => {
  const { email, password } = req.body;
  console.log("email, password", email, password);
  User.isUserExists(email).then((isExists) => {
    console.log("isExists", isExists);
    if (!isExists) {
      return res.status(400).json({
        status: "failed",
        message: "user not exist!",
        statusCode: "400",
      });
    }
    User.getOneUser(email).then(
      (user) => {
        bcrypt.compare(
          password,
          user.password,
          function (error, isvalidpassword) {
            if (error) {
              throw error;
            }
            if (!isvalidpassword) {
              return res.status(401).json({
                status: "failed",
                message: "invalid password!",
                statusCode: "401",
              });
            } else {
              var token = jwt.sign(
                {
                  id: user.user_id,
                },
                process.env.API_SECRET,
                {
                  expiresIn: 86400,
                }
              );
              const id = user.user_id;
              const name = user.name;
              const email = user.email;
              const role_id = user.role_id;
              User.GetcompanyIdByuserId(id)
                .then((data) => {
                  const company_id = data?.company_id;
                  User.createUserSession({ token, id })
                    .then(function () {
                      res.cookie(`Cookie token name`, {
                        secret: "yoursecret",
                        cookie: { maxAge: 6000 },
                      });
                      res.status(200).send({
                        message: "Login successfully",
                        status: "true",
                        statusCode: "200",
                        name: name,
                        email: email,
                        role_id: role_id,
                        accessToken: token,
                        company_id: company_id,
                      });
                    })
                    .catch(function (error) {
                      return res.status(400).json({
                        message: error,
                        statusCode: 400,
                      });
                    });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: 400,
                  });
                });
            }
          }
        );
      },
      (error) => {
        res.status(400).json({
          status: "false",
          statusCode: "400",
          message: "Error while login.",
        });
      }
    );
  });
};

const Passwordreset = (req, res) => {
  const { email } = req.body;
  User.isUserExists(email)
    .then((isExists) => {
      if (!isExists) {
        return res.status(400).json({
          status: "failed",
          message: "user not exist!",
          statusCode: "400",
        });
      } else {
        User.getOneUser(email)
          .then((user) => {
            const resetToken = crypto.randomBytes(32).toString("hex");
            const passwordResetToken = crypto
              .createHash("sha256")
              .update(resetToken)
              .digest("hex");
            User.updateUserWithPaswword({
              id: user.user_id,
              passwordResetToken: passwordResetToken,
            }).then((update) => {
              const url = `http://localhost:3000/resetpassword/${passwordResetToken}`;
              Email.send(user, url).then((send) => {
                console.log("url", url);
                console.log("send", send);
                res.status(200).json({
                  status: "success",
                });
              });
            });
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: 400,
            });
          });
      }
    })
    .catch(function (error) {
      return res.status(400).json({
        message: error,
        statusCode: 400,
      });
    });
};
const PasswordSet = (req, res) => {
  const { password } = req.body;
  const { id } = req.params;
  User.isUserExistsbypasswordresettoken(id)
    .then((isExists) => {
      if (!isExists) {
        return res.status(400).json({
          status: "failed",
          message: "user not exist!",
          statusCode: "400",
        });
      } else {
        User.getOneUserBypasswordresettoken(id).then((data) => {
          if (Date.parse(data.passwordresetat) > Date.parse(time)) {
            User.updateUserWithSetPaswword(id, password)
              .then(() => {
                return res.status(200).json({
                  message: "Password Update successfully",
                  statusCode: "200",
                });
              })
              .catch(function (error) {
                return res.status(400).json({
                  message: error,
                  statusCode: 400,
                });
              });
          }
        });
      }
    })
    .catch(function (error) {
      return res.status(400).json({
        message: error,
        statusCode: 400,
      });
    });
};

const LogOut = (req, res) => {
  let tokanData = req.headers["authorization"];
  if (tokanData) {
    auth
      .logout(tokanData)
      .then(async function () {
        return res.status(200).json({
          message: "LogOut successfully",
          statusCode: "200",
        });
      })
      .catch(function (error) {
        return res.status(403).json({
          message: "Authorization Error",
          statusCode: "403",
        });
      });
  } else {
    return res.status(403).json({
      message: "Authorization Error",
      statusCode: "403",
    });
  }
};
module.exports = {
  listUser,
  GetDeletedUsers,
  createUser,
  updateUser,
  PermentDeleteUser,
  DeleteUser,
  GetUsersByUser_uuId,
  Login,
  LogOut,
  Passwordreset,
  PasswordSet,
};

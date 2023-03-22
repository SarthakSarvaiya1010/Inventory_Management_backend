const pool = require("../../config");
var pass = require("../helpers/helper");
var bcrypt = require("bcrypt");
const e = require("express");

const passwordResetAt = new Date(Date.now() + 10 * 60 * 1000);

const getUsers = (data_s) => {
  let deleted_flag = "0";

  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY user_id ) AS sr_no, user_uuid , name ,email  ,  password , mobile_no , image_src , address , role_id , isactive , deleted_flag FROM users WHERE  name ${
          data_s.whereFilter
        } and deleted_flag = $1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : "user_id"
        } ${data_s.order} ${data_s.paging}`,
        [deleted_flag]
      )
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

const getDeletedUsers = (data_s) => {
  let deleted_flag = "1";
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY user_id ) AS sr_no, user_uuid , name ,email  ,  password , mobile_no , image_src , address , role_id , isactive , deleted_flag FROM users WHERE  name ${
          data_s.whereFilter
        } and deleted_flag = $1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : "user_id"
        } ${data_s.order} ${data_s.paging}`,
        [deleted_flag]
      )
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const getUserbyuser_uuid = (user_uuid) => {
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "SELECT user_uuid ,user_id, name ,email  ,  password , mobile_no , image_src , address , role_id , isactive , deleted_flag  FROM users WHERE user_uuid = $1 ",
        [user_uuid]
      )
      .then(function (results) {
        resolve(results.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

const AddUser = (request, response) => {
  const {
    name,
    email,
    password,
    mobile_no,
    image_src,
    address,
    role_id,
    company_id,
  } = request;
  const isactive = "1";
  const deleted_flag = "0";
  if (!company_id) {
    return new Promise(function (resolve, reject) {
      hashPassword(password)
        .then(function (hash) {
          return pool.query(
            "INSERT INTO users (name, email,password,mobile_no,image_src,address,role_id,isactive,deleted_flag) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)",
            [
              name,
              email,
              hash,
              mobile_no,
              image_src,
              address,
              role_id,
              isactive,
              deleted_flag,
            ]
          );
        })
        .then(function (result) {
          resolve(result.rows);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  } else {
    return new Promise(function (resolve, reject) {
      hashPassword(password)
        .then(function (hash) {
          return pool.query(
            "INSERT INTO users (name, email,password,mobile_no,image_src,address,role_id,isactive,deleted_flag) VALUES ($1, $2, $3,$4,$5,$6,$7,$8,$9)",
            [
              name,
              email,
              hash,
              mobile_no,
              image_src,
              address,
              role_id,
              isactive,
              deleted_flag,
            ]
          );
        })
        .then(() =>
          pool.query("SELECT * FROM users WHERE email = $1;", [email])
        )
        .then((ress) => {
          const user_id = ress.rows[0].user_id;
          return pool.query(
            "INSERT INTO public.users_company_map(user_id, company_id) VALUES ($1, $2);",
            [user_id, company_id]
          );
        })
        .then(function (result) {
          resolve(result.rows);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }
};

const Updateuser = (data) => {
  const {
    user_id,
    name,
    email,
    password,
    mobile_no,
    address,
    role_id,
    company_id,
    image_src,
  } = data;
  if (company_id) {
    return new Promise(function (resolve, reject) {
      if (!user_id) {
        console.log("error: id missing");
        reject("error: id missing");
      } else {
        hashPassword(password)
          .then(function (hash) {
            pool.query(
              "UPDATE users SET name = $1, email = $2 , password = $3 , image_src = $4 ,  mobile_no = $5 , address = $6 , role_id = $7  WHERE user_id = $8",
              [
                name,
                email,
                hash,
                image_src,
                mobile_no,
                address,
                role_id,
                user_id,
              ]
            );
          })
          .then(() => {
            return pool.query(
              "UPDATE public.users_company_map SET company_id=$2 WHERE user_id =$1",
              [user_id, company_id]
            );
          })
          .then(function (result) {
            resolve(result.rows[0]);
          })
          .catch(function (err) {
            reject(err);
          });
      }
    });
  }
};

const PermentDeleteuser = (user_id) => {
  return new Promise(function (resolve, reject) {
    if (!user_id) {
      console.log("error: id missing");
      reject("error: id missing");
    } else {
      pool
        .query("DELETE FROM users WHERE user_id = $1", [user_id])
        .then(() => {
          return pool.query(
            "DELETE FROM public.users_company_map WHERE user_id = $1",
            [user_id]
          );
        })
        .then(async function (result) {
          resolve(result.rows);
        })
        .catch(function (error) {
          reject(error);
        });
    }
  });
};

const deleteuser = (user_id) => {
  let deleted_flag = "1";
  return new Promise(function (resolve, reject) {
    if (!user_id) {
      console.log("user_id---->", user_id);
      console("error:user_id is missing");
      reject("error:user_id is missing");
    } else {
      pool
        .query("UPDATE users SET deleted_flag=$2  WHERE user_id = $1", [
          user_id,
          deleted_flag,
        ])
        .then(async function (result) {
          resolve(result.rows);
        })
        .catch(function (error) {
          reject(error);
        });
    }
  });
};

async function isUserExists(email) {
  console.log("email", email);
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }

        return resolve(results.rowCount > 0);
      }
    );
  });
}
async function isUserExistsbypasswordresettoken(passwordresettoken) {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM users WHERE passwordresettoken = $1",
      [passwordresettoken],
      (error, results) => {
        if (error) {
          throw error;
        }

        return resolve(results.rowCount > 0);
      }
    );
  });
}
async function GetcompanyIdByuserId(user_id) {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM users_company_map WHERE user_id = $1 ",
      [user_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return resolve(results.rows[0]);
      }
    );
  });
}

async function getOneUser(email) {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM users WHERE email = $1 ",
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }
        return resolve(results.rows[0]);
      }
    );
  });
}
const createUserSession = function (request, response) {
  const { token, id } = request;
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO public.user_session( sessiontoken, user_id)  VALUES ( $1, $2);",
        [token, id]
      )
      .then(function (result) {
        resolve(result.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
function hashPassword(password) {
  return new Promise(function (resolve, reject) {
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(password, salt, function (err, hash) {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
}
async function UserGetByUUID(user_uuid) {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM users WHERE user_uuid = $1",
      [user_uuid],
      (error, results) => {
        if (error) {
          throw error;
        }
        return resolve(results.rows[0]);
      }
    );
  });
}
async function UserGetByEmail(email) {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
      (error, results) => {
        if (error) {
          throw error;
        }
        return resolve(results.rows);
      }
    );
  });
}
const getComapnyByuserId = (user_id) => {
  console.log("user_id", user_id);
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "SELECT * FROM users_company_map WHERE user_id = $1 ORDER BY company_id ASC",
        [user_id]
      )
      .then(function (results) {
        resolve(results.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

const updateUserWithPaswword = (data) => {
  let ResetToken = data.passwordResetToken;
  return new Promise(function (resolve, reject) {
    if (!data.id) {
      reject("error: id missing");
    } else {
      pool
        .query(
          "UPDATE users SET passwordresettoken = $2,passwordresetat = $3 WHERE user_id = $1",
          [data.id, ResetToken, passwordResetAt]
        )
        .then(function (result) {
          resolve(result.rows[0]);
        })
        .catch(function (err) {
          reject(err);
        });
    }
  });
};
const updateUserWithSetPaswword = (data, password) => {
  return new Promise(function (resolve, reject) {
    if (!data) {
      reject("error: id missing");
    } else {
      hashPassword(password).then(function (hash) {
        pool
          .query("UPDATE users SET password=$2 WHERE passwordresettoken = $1", [
            data,
            hash,
          ])
          .then(function (result) {
            resolve(result.rows[0]);
          })
          .catch(function (err) {
            reject(err);
          });
      });
    }
  });
};

exports.hashPassword = hashPassword;
module.exports = {
  getUsers,
  getDeletedUsers,
  AddUser,
  Updateuser,
  PermentDeleteuser,
  deleteuser,
  isUserExists,
  getOneUser,
  hashPassword,
  createUserSession,
  UserGetByUUID,
  UserGetByEmail,
  GetcompanyIdByuserId,
  getUserbyuser_uuid,
  getComapnyByuserId,
  updateUserWithPaswword,
  isUserExistsbypasswordresettoken,
  updateUserWithSetPaswword,
};

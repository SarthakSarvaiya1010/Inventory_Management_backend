const pool = require("../../config");
var d = new Date();
const formatDate = require("./helper");

const dformat = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

var d1 = formatDate.formatDate(new Date());
const time = `${d1} ${dformat}`;
const AUTH = async (data) => {
  authData = data.split(" ")[1];
  {
    return new Promise(function (resolve, reject) {
      pool
        .query("SELECT * FROM user_session where sessiontoken = $1", [authData])
        .then(function (results) {
          if (results.rows.length) {
            if (
              Date.parse(time) < Date.parse(results?.rows[0]?.session_expire_at)
            ) {
              resolve(results.rows[0]);
            } else {
              pool.query("DELETE  FROM user_session where sessiontoken = $1", [
                authData,
              ]);
              reject(err);
            }
          } else {
            resolve();
          }
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }
};
const logout = async (data) => {
  authData = data.split(" ")[1];
  {
    return new Promise(function (resolve, reject) {
      pool
        .query("DELETE  FROM user_session where sessiontoken = $1", [authData])
        .then(function (results) {
          resolve(results.rows[0]);
        })
        .catch(function (err) {
          reject(err);
        });
    });
  }
};

module.exports = {
  AUTH,
  logout,
};

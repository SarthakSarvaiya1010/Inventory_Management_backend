var pool = require("../../config");

const GetBankList = () => {
  return new Promise(function (resolve, reject) {
    pool
      .query(`SELECT * FROM public.bank ORDER BY bank_id ASC `, [])
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

const AddNewbank = (request, bankdata) => {
  const {
    bank_name,
    chaque_no,
    totalamout,
    fullpayment,
    purchase_id,
    remainingamount,
    paidamount,
  } = request;
  let balance = bankdata.balance - request.paidamount;

  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO public.bank( bank_name, chaque_no, totalamout, fullpayment,purchase_id,remainingamount,paidamount) VALUES ( $1,$2,$3,$4,$5,$6,$7);",
        [
          bank_name,
          chaque_no,
          totalamout,
          fullpayment,
          purchase_id,
          remainingamount,
          paidamount,
        ]
      )
      .then(function (result) {
        if (fullpayment) {
          pool
            .query(
              "UPDATE purchasebill  SET  payment=$2 WHERE purchase_id = $1",
              [purchase_id, fullpayment]
            )
            .then(function (res) {
              pool
                .query(
                  "UPDATE bank_info  SET  balance=$2 WHERE bank_info_no = $1",
                  [bankdata.bank_info_no, balance]
                )
                .then(function (res) {
                  resolve(result.rows[0]);
                })
                .catch(function (err) {
                  reject(err);
                });
            })
            .catch(function (err) {
              reject(err);
            });
        } else {
          pool
            .query(
              "UPDATE bank_info  SET  balance=$2 WHERE bank_info_no = $1",
              [bankdata.bank_info_no, balance]
            )
            .then(function (res) {
              resolve(result.rows[0]);
            })
            .catch(function (err) {
              reject(err);
            });
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

const GetBankinfoBypurchase_id = (purchase_id) => {
  return new Promise(function (resolve, reject) {
    if (!purchase_id) {
      console.log("error: id missing");
      reject("error: id missing");
    } else {
      pool
        .query(`SELECT * FROM public.bank where purchase_id=$1 `, [purchase_id])
        .then(function (results) {
          resolve(results.rows[results?.rows?.length - 1 || 0]);
        })
        .catch(function (err) {
          reject(err);
        });
    }
  });
};
module.exports = {
  GetBankList,
  AddNewbank,
  GetBankinfoBypurchase_id,
};

var pool = require("../../config");

const GetBankInfoList = (data_s, user_id) => {
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY bank_info_no ) AS sr_no ,* FROM public.bank_info where user_id=$1 and bank_name  ${
          data_s.whereFilter
        } ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : " bank_info_no "
        } ${data_s.order} ${data_s.paging}`,
        [user_id]
      )
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const AddNewbankInfo = (request) => {
  const { bank_name, balance, user_id, primary_bank } = request;
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `INSERT INTO public.bank_info(
         bank_name, balance, user_id)
        VALUES ( $1, $2, $3)`,
        [bank_name, balance, user_id]
      )
      .then(function (results) {
        if (primary_bank) {
          pool
            .query(`SELECT * FROM public.primary_bank where user_id=$1`, [
              user_id,
            ])
            .then(function (res) {
              console.log("res.rows12345", res.rows);
              if (res.rows.length) {
                pool
                  .query(`SELECT * FROM public.bank_info where user_id=$1`, [
                    user_id,
                  ])
                  .then(function (res) {
                    let is_primary = 1;
                    let bank_info_no =
                      res?.rows[res?.rows?.length - 1 || 0]?.bank_info_no;
                    pool
                      .query(
                        `UPDATE public.primary_bank
                  SET  bank_info_no=$2,  is_primary=$3
                  WHERE user_id=$1 `,
                        [user_id, bank_info_no, is_primary]
                      )
                      .then(function (res) {
                        resolve(results.rows);
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
                  .query(`SELECT * FROM public.bank_info where user_id=$1  `, [
                    user_id,
                  ])
                  .then(function (res) {
                    let is_primary = 1;
                    console.log("(()8");
                    pool
                      .query(
                        `INSERT INTO public.primary_bank(
                           bank_info_no, user_id, is_primary)
                          VALUES ($1, $2, $3);`,
                        [
                          res.rows[res?.rows?.length - 1 || 0].bank_info_no,
                          user_id,
                          is_primary,
                        ]
                      )
                      .then(function (res) {
                        resolve(results.rows);
                      });
                  })
                  .catch(function (err) {
                    reject(err);
                  });
              }
            })
            .catch(function (err) {
              reject(err);
            });
        } else {
          resolve(results.rows);
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const bankGetByBankName = (request) => {
  const { bank_name } = request;
  return new Promise(function (resolve, reject) {
    pool
      .query(`SELECT * FROM public.bank_info where bank_name=$1`, [bank_name])
      .then(function (results) {
        resolve(results.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const GetBankInfoById = (id) => {
  return new Promise(function (resolve, reject) {
    pool
      .query(`SELECT * FROM public.bank_info where bank_info_no=$1`, [id])
      .then(function (results) {
        resolve(results.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const Getprimary_bankById = (id) => {
  return new Promise(function (resolve, reject) {
    pool
      .query(`SELECT * FROM public.primary_bank where bank_info_no=$1`, [id])
      .then(function (results) {
        resolve(results.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

const UpdateBankInfo = (request, bank_id) => {
  const { bank_name, balance, user_id, primary_bank } = request;
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `UPDATE public.bank_info
        SET  bank_name=$2, balance=$3, user_id=$4
        WHERE bank_info_no=$1`,
        [bank_id, bank_name, balance, user_id]
      )
      .then(function (results) {
        pool
          .query(
            `UPDATE public.primary_bank  SET bank_info_no=$2 WHERE user_id=$1`,
            [user_id, bank_id]
          )
          .then(function (res) {
            console.log("results.rows", results.rows);
            resolve(results.rows);
          })
          .catch(function (err) {
            reject(err);
          });
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const DeleteBankInfo = (bank_id) => {
  return new Promise(function (resolve, reject) {
    pool
      .query(`DELETE FROM public.bank_info WHERE bank_info_no=$1 `, [bank_id])
      .then(function (res) {
        resolve(res.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const UpdateBankbalance = (request, amount) => {
  const { bill_amount, user_id } = request;
  return new Promise(function (resolve, reject) {
    pool
      .query(`SELECT * FROM public.primary_bank  where user_id=$1`, [user_id])
      .then(function (res) {
        let balance = parseInt(amount) - parseInt(bill_amount);

        pool
          .query(`SELECT * FROM public.bank_info where  bank_info_no=$1`, [
            res.rows[0].bank_info_no,
          ])
          .then(function (ress) {
            let balanceData =
              balance > 0
                ? ress.rows[0].balance + balance
                : ress.rows[0].balance - balance;
            pool
              .query(
                `UPDATE public.bank_info SET   balance=$2  WHERE bank_info_no=$1 `,
                [res.rows[0].bank_info_no, balanceData]
              )
              .then(function (res) {
                console.log("res", res.rows);
                resolve(res.rows);
              })
              .catch(function (err) {
                reject(err);
              });
          })
          .catch(function (err) {
            reject(err);
          });
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const UpdateBankbalanceInfo = (request) => {
  const { balance, user_id, bank_name } = request;
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `UPDATE public.bank_info SET balance=$3 WHERE bank_name=$2 and user_id=$1`,
        [user_id, bank_name, balance]
      )
      .then(function (res) {
        resolve(res.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

module.exports = {
  GetBankInfoList,
  AddNewbankInfo,
  bankGetByBankName,
  GetBankInfoById,
  Getprimary_bankById,
  UpdateBankInfo,
  DeleteBankInfo,
  UpdateBankbalance,
  UpdateBankbalanceInfo,
};

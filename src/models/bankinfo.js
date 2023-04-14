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

module.exports = {
  GetBankInfoList,
  AddNewbankInfo,
  bankGetByBankName,
};

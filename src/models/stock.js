const pool = require("../../config");

const getstock = (data_s) => {
  let delete_flag = "0";

  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY product_id ) AS sr_no, * FROM public.products WHERE product_name ${
          data_s.whereFilter
        } and delete_flag=$1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : "product_id "
        } ${data_s.order} ${data_s.paging}`,
        [delete_flag]
      )
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

module.exports = {
  getstock,
};

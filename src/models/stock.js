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
const CheckStock = (req) => {
  return new Promise(function (resolve, reject) {
    let count = 0;
    req?.productdata?.map((data) => {
      pool
        .query(`SELECT * FROM public.products where product_id=$1 `, [
          data.product_id,
        ])
        .then(function (data1) {
          count++;
          let quantity = data1.rows[0].quantity;
          let quantityData = parseInt(quantity) - parseInt(data.quantity);
          console.log(quantityData);
          if (req?.productdata.length === count) {
            if (quantityData > 0) {
              resolve(quantityData > 0);
            } else {
              resolve(quantityData > 0);
            }
          }
        })
        .catch(function (err) {
          reject(err);
        });
    });
  });
};

module.exports = {
  getstock,
  CheckStock,
};

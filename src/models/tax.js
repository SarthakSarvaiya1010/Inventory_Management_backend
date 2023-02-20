var pool = require("../../config");

const GetTaxList = (data_s) => {
  let delete_flag = "0";
  console.log(data_s);
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT  count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY tax_id ) AS sr_no , * FROM tax WHERE tax_name ${
          data_s.whereFilter
        } and delete_flag=$1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : " tax_id "
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
const GetDeletedTax = (data_s) => {
  let delete_flag = "1";
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT  count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY tax_id ) AS sr_no , * FROM tax WHERE tax_name ${
          data_s.whereFilter
        } and delete_flag=$1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : " tax_id "
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
const AddNewtax = (request, response) => {
  const { tax_name, tax_rate, tax_country, isactive } = request;
  const delete_flag = "0";
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO public.tax(tax_name, tax_rate, tax_country, isactive,delete_flag) VALUES ($1, $2, $3, $4, $5);",
        [tax_name, tax_rate, tax_country, isactive, delete_flag]
      )
      .then(function (result) {
        resolve(result.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const EditTaxdata = (data) => {
  const { tax_id, tax_name, tax_rate, tax_country } = data;
  return new Promise(function (resolve, reject) {
    if (!tax_id) {
      console.log("error:id is missing");
      reject("error:id is missing");
    } else {
      pool
        .query(
          "UPDATE tax  SET tax_name=$2, tax_rate=$3, tax_country=$4 WHERE tax_id = $1",
          [tax_id, tax_name, tax_rate, tax_country]
        )
        .then(async function (result) {
          resolve(result.rows[0]);
        })
        .catch(function (error) {
          reject(error);
        });
    }
  });
};

const isTaxExists = (tax_id) => {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM public.tax WHERE tax_id = $1",
      [tax_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return resolve(results.rowCount > 0);
      }
    );
  });
};
const PermanentDeletetax = (tax_id) => {
  return new Promise(function (resolve, reject) {
    if (!tax_id) {
      console("error:tax_id is missing");
      reject("error:tax_id is missing");
    } else {
      pool
        .query("DELETE from tax WHERE tax_id = $1", [tax_id])
        .then(async function (result) {
          resolve(result.rows);
        })
        .catch(function (error) {
          reject(error);
        });
    }
  });
};
const Deletetax = (tax_id) => {
  console.log("tax_id---->", tax_id);
  let delete_flag = "1";
  return new Promise(function (resolve, reject) {
    if (!tax_id) {
      console("error:tax_id is missing");
      reject("error:tax_id is missing");
    } else {
      pool
        .query("UPDATE tax SET delete_flag=$2  WHERE tax_id = $1", [
          tax_id,
          delete_flag,
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
const GetTaxListsById = (tax_id) => {
  return new Promise(function (resolve, reject) {
    if (!tax_id) {
      console.log("error:tax_id is missing");
      reject("error:tax_id is missing");
    } else {
      pool
        .query("SELECT * FROM tax WHERE  tax_id = $1 ", [tax_id])
        .then(function (results) {
          resolve(results.rows);
        })
        .catch(function (err) {
          reject(err);
        });
    }
  });
};
module.exports = {
  GetTaxList,
  GetDeletedTax,
  AddNewtax,
  isTaxExists,
  EditTaxdata,
  PermanentDeletetax,
  Deletetax,
  GetTaxListsById,
};

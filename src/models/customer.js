const pool = require("../../config");

const getCustomers = (data_s) => {
  let delete_flag = "0";
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY customer_id ) AS sr_no, * FROM customers WHERE customer_name ${
          data_s.whereFilter
        } and delete_flag=$1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : " customer_id"
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

const GetDeletedcustomer = (data_s) => {
  let delete_flag = "1";

  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY customer_id ) AS sr_no, * FROM customers WHERE customer_name ${
          data_s.whereFilter
        } and delete_flag=$1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : " customer_id"
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

const AddCustomer = (request, response) => {
  const { customer_name, mobile_no, email, address, tin_no } = request;
  const isactive = "1";
  const delete_flag = "0";
  const company_id = 1;

  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO customers (customer_name, mobile_no, email, address, tin_no, isactive, delete_flag ,company_id) VALUES ($1,$2, $3,$4,$5,$6,$7,$8)",

        [
          customer_name,
          mobile_no,
          email,
          address,
          tin_no,
          isactive,
          delete_flag,
          company_id,
        ]
      )
      .then(function (result) {
        resolve(result.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};

const EditCustomerInfo = (data) => {
  const { customer_id, customer_name, mobile_no, address, email, tin_no } =
    data;
  return new Promise(function (resolve, reject) {
    if (!customer_id) {
      console.log("error:customer_id is missing");
      reject("error:customer_id is missing");
    } else {
      pool
        .query(
          "UPDATE customers SET customer_name=$2 , mobile_no=$3 , address=$4 , email=$5 , tin_no=$6 WHERE customer_id = $1",
          [customer_id, customer_name, mobile_no, address, email, tin_no]
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

const RemovedCustomer = (customer_id) => {
  return new Promise(function (resolve, reject) {
    if (!customer_id) {
      console("error:customer_id is missing");
      reject("error:customer_id is missing");
    } else {
      pool
        .query("DELETE from customers WHERE customer_id = $1", [customer_id])
        .then(async function (result) {
          resolve(result.rows);
        })
        .catch(function (error) {
          reject(error);
        });
    }
  });
};

const RemovedCustomerFromTheList = (customer_id) => {
  let delete_flag = "1";
  return new Promise(function (resolve, reject) {
    if (!customer_id) {
      console.log("customer_id---->", customer_id);
      console("error:customer_id is missing");
      reject("error:customer_id is missing");
    } else {
      pool
        .query("UPDATE customers SET delete_flag=$2  WHERE customer_id = $1", [
          customer_id,
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

const getCustomersById = (customer_id) => {
  return new Promise(function (resolve, reject) {
    pool
      .query("SELECT * FROM customers WHERE  customer_id = $1 ", [customer_id])
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
module.exports = {
  getCustomers,
  GetDeletedcustomer,
  AddCustomer,
  EditCustomerInfo,
  RemovedCustomer,
  RemovedCustomerFromTheList,
  getCustomersById,
};

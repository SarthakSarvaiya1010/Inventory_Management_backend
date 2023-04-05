const pool = require("../../config");

const getProducts = (data_s) => {
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
const getDeletedProducts = (data_s) => {
  let delete_flag = "1";
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

const AddProduct = (request, image_src) => {
  const { product_name, hsn, weight, description, product_type, unit } =
    request;
  const isactive = "1";
  const delete_flag = "0";
  const company_id = 1;
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO products ( product_name, hsn, weight,description, product_type, isactive, delete_flag ,company_id , image_src ,unit ) VALUES ($1,$2, $3,$4,$5,$6,$7,$8 ,$9 ,$10)",
        [
          product_name,
          hsn,
          weight,
          description,
          product_type,
          isactive,
          delete_flag,
          company_id,
          image_src,
          unit,
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

const deleteproduct = (product_id) => {
  let delete_flag = "1";
  return new Promise(function (resolve, reject) {
    if (!product_id) {
      console("error:product_id is missing");
      reject("error:product_id is missing");
    } else {
      pool
        .query("UPDATE  products SET delete_flag=$2  WHERE product_id = $1", [
          product_id,
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
const PermentDeleteproduct = (product_id) => {
  return new Promise(function (resolve, reject) {
    if (!product_id) {
      console("error:product_id is missing");
      reject("error:product_id is missing");
    } else {
      pool
        .query("DELETE from products WHERE product_id = $1", [product_id])
        .then(async function (result) {
          resolve(result.rows);
        })
        .catch(function (error) {
          reject(error);
        });
    }
  });
};
const updateproduct = (data) => {
  const {
    product_id,
    product_name,
    description,
    product_type,
    weight,
    hsn,
    image_src,
  } = data;
  return new Promise(function (resolve, reject) {
    if (!product_id) {
      console.log("error:product_id is missing");
      reject("error:product_id is missing");
    } else {
      if (image_src) {
        pool
          .query(
            "UPDATE products SET product_name=$2 , description=$3 , product_type=$4 , weight=$5 , hsn=$6 , image_src=$7 WHERE product_id = $1",
            [
              product_id,
              product_name,
              description,
              product_type,
              weight,
              hsn,
              image_src,
            ]
          )
          .then(async function (result) {
            resolve(result.rows[0]);
          })
          .catch(function (error) {
            reject(error);
          });
      } else {
        pool
          .query(
            "UPDATE products SET product_name=$2 , description=$3 , product_type=$4 , weight=$5 , hsn=$6  WHERE product_id = $1",
            [product_id, product_name, description, product_type, weight, hsn]
          )
          .then(async function (result) {
            resolve(result.rows[0]);
          })
          .catch(function (error) {
            reject(error);
          });
      }
    }
  });
};
async function getProductById(product_id) {
  return new Promise((resolve, reject) => {
    pool.query(
      "SELECT * FROM products WHERE product_id = $1 ",
      [product_id],
      (error, results) => {
        if (error) {
          return reject(error);
        } else {
          return resolve(results.rows[0]);
        }
      }
    );
  });
}

module.exports = {
  getProducts,
  getDeletedProducts,
  AddProduct,
  PermentDeleteproduct,
  updateproduct,
  getProductById,
  deleteproduct,
};

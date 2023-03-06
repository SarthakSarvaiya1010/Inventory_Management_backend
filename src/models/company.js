const pool = require("../../config");
const getComapnyList = (data_s) => {
  let delete_flag = "0";
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT count(*) OVER() AS total_count , ROW_NUMBER() OVER(ORDER BY company_id ) AS sr_no,* FROM company_info WHERE  company_name ${
          data_s.whereFilter
        }and delete_flag = $1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : "company_id "
        } ${data_s.order} ${data_s.paging} `,
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

const getDeletedComapny = () => {
  let delete_flag = "1";
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT count(*) OVER() AS total_count , ROW_NUMBER() OVER(ORDER BY company_id ) AS sr_no,* FROM company_info WHERE  company_name ${
          data_s.whereFilter
        }and delete_flag = $1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : "company_id "
        } ${data_s.order} ${data_s.paging} `,
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
const getComapnyBycompanyId = (company_id) => {
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "SELECT * FROM company_info WHERE company_id = $1 ORDER BY company_id ASC",
        [company_id]
      )
      .then(function (results) {
        resolve(results.rows[0]);
      })
      .catch(function (err) {
        reject(err);
      });
  });
};
const AddCompany = (request, response) => {
  const {
    company_name,
    image_src,
    website,
    phone_no,
    mobile_no,
    company_address,
    terms_condition,
    fax_no,
    tin_gst_no,
  } = request;
  const isactive = "1";
  const delete_flag = "0";

  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO public.company_info(company_name, image_src, website, phone_no, mobile_no, company_address, terms_condition, fax_no, isactive, delete_flag, tin_gst_no) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);",
        [
          company_name,
          image_src,
          website,
          phone_no,
          mobile_no,
          company_address,
          terms_condition,
          fax_no,
          isactive,
          delete_flag,
          tin_gst_no,
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

async function isCompanyExists(company_id) {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM public.company_info WHERE company_id = $1",
      [company_id],
      (error, results) => {
        if (error) {
          throw error;
        }

        return resolve(results.rowCount > 0);
      }
    );
  });
}
const Editcompanyinfo = (data) => {
  const {
    company_id,
    company_name,
    image_src,
    website,
    phone_no,
    mobile_no,
    company_address,
    terms_condition,
    fax_no,
    tin_gst_no,
  } = data;
  return new Promise(function (resolve, reject) {
    if (!company_id) {
      console.log("error:company_id is missing");
      reject("error:company_id is missing");
    } else {
      if (image_src) {
        pool
          .query(
            "UPDATE company_info  SET company_name=$2, image_src=$3, website=$4, phone_no=$5, mobile_no=$6, company_address=$7, terms_condition=$8, fax_no=$9 ,tin_gst_no=$10 WHERE company_id = $1",
            [
              company_id,
              company_name,
              image_src,
              website,
              phone_no,
              mobile_no,
              company_address,
              terms_condition,
              fax_no,
              tin_gst_no,
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
            "UPDATE company_info  SET company_name=$2,  website=$3, phone_no=$4, mobile_no=$5, company_address=$6, terms_condition=$7, fax_no=$8 ,tin_gst_no=$9 WHERE company_id = $1",
            [
              company_id,
              company_name,
              website,
              phone_no,
              mobile_no,
              company_address,
              terms_condition,
              fax_no,
              tin_gst_no,
            ]
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

const Permentdeletedcompany = (company_id) => {
  return new Promise(function (resolve, reject) {
    if (!company_id) {
      console.log("error:company_id is missing");
      reject("error:company_id is missing");
    } else {
      pool
        .query("DELETE from company_info WHERE company_id = $1", [company_id])
        .then(async function (result) {
          resolve(result.rows);
        })
        .catch(function (error) {
          reject(error);
        });
    }
  });
};
const Deletecompany = (company_id) => {
  let delete_flag = "1";
  return new Promise(function (resolve, reject) {
    if (!company_id) {
      console.log("company_id---->", customer_id);
      console("error:company_id is missing");
      reject("error:company_id is missing");
    } else {
      pool
        .query(
          "UPDATE company_info SET delete_flag=$2  WHERE company_id = $1",
          [company_id, delete_flag]
        )
        .then(async function (result) {
          resolve(result.rows);
        })
        .catch(function (error) {
          reject(error);
        });
    }
  });
};
module.exports = {
  getComapnyList,
  getDeletedComapny,
  AddCompany,
  isCompanyExists,
  Editcompanyinfo,
  Permentdeletedcompany,
  Deletecompany,
  getComapnyBycompanyId,
};

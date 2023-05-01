const pool = require("../../config");
const formatDate = require("../helpers/helper");
const getInvoiceList = (data_s) => {
  let delete_flag = "0";
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT  count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY i.bill_no) AS sr_no ,i.* , c.customer_name , c.address as customer_address , c.mobile_no as customer_mobile_no  FROM invoice i LEFT JOIN customers c ON c.customer_id = i.customer_id  WHERE c.customer_name ${
          data_s.whereFilter
        } and i.delete_flag=$1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : " i.bill_no"
        } ${data_s.order} ${data_s.paging}`,
        [delete_flag]
      )
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
const getInvoiceDeleteList = (data_s) => {
  let delete_flag = "1";
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT  count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY i.bill_no) AS sr_no ,i.* , c.customer_name , c.address as customer_address , c.mobile_no as mobile_no  FROM invoice i LEFT JOIN customers c ON c.customer_id = i.customer_id  WHERE c.customer_name ${
          data_s.whereFilter
        } and i.delete_flag=$1 ORDER BY ${
          data_s?.orderByString ? data_s?.orderByString : " i.bill_no"
        } ${data_s.order} ${data_s.paging}`,
        [delete_flag]
      )
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

const getInvoiceListById = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "SELECT i.* , c.customer_name , c.address as customer_address , c.mobile_no as  mobile_no  From invoice i LEFT JOIN customers c ON c.customer_id = i.customer_id WHERE i.invoice_id = $1",
        [invoice_id]
      )
      .then(function (results) {
        resolve(results.rows[0]);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
const getproductListByInvoiceId = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "SELECT ip.*, p.product_name FROM invoice_products ip LEFT JOIN  products p ON p.product_id = ip.product_id WHERE ip.invoice_id = $1 ORDER By p.product_id ASC ",
        [invoice_id]
      )
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
const getInvoiceLastRow = () => {
  let company_id = 1;
  return new Promise(function (resolve, reject) {
    pool
      .query("SELECT MAX(bill_no)  FROM invoice WHERE company_id = $1", [
        company_id,
      ])
      .then(function (results) {
        resolve(results.rows);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
const Addinvoice = (req, res) => {
  const {
    bill_no,
    invoice_date,
    customer_id,
    taxable_amount,
    sgst,
    cgst,
    discount,
    bill_amount,
    productdata,
    user_id,
  } = req;
  let NewDate = invoice_date.split("-", 3);
  let dateInvoice = `${NewDate[1]}-${NewDate[0]}-${NewDate[2]}`;
  let isactive = "1";
  let delete_flag = "0";
  let company_id = 1;
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO public.invoice(bill_no, invoice_date, customer_id, taxable_amount, sgst, cgst, discount ,bill_amount, isactive , delete_flag,company_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11);",
        [
          bill_no,
          invoice_date,
          customer_id,
          taxable_amount,
          sgst,
          cgst,
          discount,
          bill_amount,
          isactive,
          delete_flag,
          company_id,
        ]
      )
      .then(() =>
        pool.query(
          "SELECT * FROM invoice WHERE bill_no = $1 AND company_id = $2",
          [bill_no, company_id]
        )
      )
      .then((ress) => {
        const invoice_id = ress?.rows[0]?.invoice_id;
        req?.productdata?.map((data) => {
          pool
            .query(
              "INSERT INTO invoice_products(product_id,hsn,weight ,rate,amount, bill_no,company_id,invoice_id,unit,quantity) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning *",
              [
                data.product_id,
                data.hsn,
                data.weight,
                data.rate,
                data.amount,
                bill_no,
                company_id,
                invoice_id,
                data.unit,
                data.quantity,
              ]
            )
            .then(function (result) {
              pool
                .query(`SELECT * FROM public.products where product_id=$1 `, [
                  data.product_id,
                ])
                .then((data1) => {
                  let quantity = data1.rows[0].quantity;
                  let quantityData =
                    parseInt(quantity) - parseInt(data.quantity);

                  pool
                    .query(
                      `UPDATE public.products SET  quantity=$2 WHERE product_id=$1`,
                      [data1.rows[0].product_id, quantityData]
                    )
                    .then(() => {
                      pool
                        .query(
                          `SELECT * FROM public.primary_bank where user_id=$1`,
                          [user_id]
                        )
                        .then((res) => {
                          pool
                            .query(
                              `SELECT * FROM public.bank_info where bank_info_no=$1`,
                              [res?.rows[0]?.bank_info_no]
                            )
                            .then((ress) => {
                              let balance =
                                ress?.rows[0]?.balance + parseInt(bill_amount);

                              pool
                                .query(
                                  `UPDATE public.bank_info SET  balance=$2  WHERE bank_info_no=$1;`,
                                  [ress?.rows[0]?.bank_info_no, balance]
                                )
                                .then(() => {
                                  resolve(result.rows[0]);
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
                    })
                    .catch(function (err) {
                      reject(err);
                    });
                });
            });
        });
      });
  });
};
async function isBillNoExists(bill_no) {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM public.invoice WHERE bill_no = $1",
      [bill_no],
      (error, results) => {
        if (error) {
          throw error;
        }

        return resolve(results.rows[0]);
      }
    );
  });
}

const IsinvoiceExistsByInvoiceId = (invoice_id) => {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM public.invoice WHERE invoice_id = $1",
      [invoice_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return resolve(results.rows);
      }
    );
  });
};

const UpdateinvoiceInfo = (req, invoice_id, res) => {
  const {
    bill_no,
    invoice_date,
    customer_id,
    taxable_amount,
    sgst,
    cgst,
    discount,
    bill_amount,
    company_id,
    productdata,
    user_id,
  } = req;
  return new Promise(function (resolve, reject) {
    if (!invoice_id) {
      console.log("error: invoice_id missing");
      reject("error: invoice_id missing");
    } else {
      pool
        .query(
          "UPDATE invoice SET bill_no = $1, invoice_date = $2 ,customer_id = $3 , taxable_amount = $4 , sgst = $5 ,  cgst = $6 , discount = $7 , bill_amount = $8 , company_id = $9 WHERE invoice_id = $10 ",
          [
            bill_no,
            invoice_date,
            customer_id,
            taxable_amount,
            sgst,
            cgst,
            discount,
            bill_amount,
            company_id,
            invoice_id,
          ]
        )
        .then(() => {
          pool.query("DELETE FROM invoice_products WHERE  invoice_id = $1", [
            invoice_id,
          ]);
        })
        .then((ress) => {
          req.productdata.map(async (data) => {
            try {
              const result = await pool
                .query(
                  "INSERT INTO invoice_products(invoice_id, bill_no, company_id,  product_id, hsn, weight, rate, amount,unit,quantity) values($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) returning * ",
                  [
                    invoice_id,
                    bill_no,
                    company_id,
                    data.product_id,
                    data.hsn,
                    data.weight,
                    data.rate,
                    data.amount,
                    data.unit,
                    data.quantity,
                  ]
                )
                .then(() => {
                  pool
                    .query(
                      `SELECT * FROM public.products where product_id=$1 `,
                      [data.product_id]
                    )
                    .then((data1) => {
                      let quantity = data1.rows[0].quantity;
                      let quantityData =
                        parseInt(quantity) - parseInt(data.quantity);
                      pool
                        .query(
                          `UPDATE public.products SET  quantity=$2 WHERE product_id=$1`,
                          [data1.rows[0].product_id, quantityData]
                        )
                        .then(() => {
                          resolve(data1.rows[0]);
                        })
                        .catch(function (err) {
                          console.log("err", err);
                          reject(err);
                        });
                    });
                });
            } catch {
              console.log("err", err);
              reject(err);
            }
          });
        });
    }
  });
};

const Permentdeletedinvoice = (invoice_id) => {
  return new Promise(function (resolve, reject) {
    if (!invoice_id) {
      console.log("error: invoice_id missing");
      reject("error: invoice_id missing");
    } else {
      pool
        .query("DELETE FROM invoice WHERE invoice_id = $1", [invoice_id])
        .then(() => {
          return pool.query(
            "DELETE FROM public.invoice_products WHERE invoice_id = $1",
            [invoice_id]
          );
        })
        .then(async function (result) {
          resolve(result.rows);
        })
        .catch(function (error) {
          reject(error);
        });
    }
  });
};
const Deleteinvoice = (invoice_id) => {
  let delete_flag = "1";
  return new Promise(function (resolve, reject) {
    if (!invoice_id) {
      console("error:invoice_id is missing");
      reject("error:invoice_id is missing");
    } else {
      pool
        .query("UPDATE invoice SET delete_flag=$2  WHERE invoice_id = $1", [
          invoice_id,
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
module.exports = {
  getInvoiceList,
  getInvoiceListById,
  getproductListByInvoiceId,
  getInvoiceLastRow,
  Addinvoice,
  isBillNoExists,
  IsinvoiceExistsByInvoiceId,
  UpdateinvoiceInfo,
  Permentdeletedinvoice,
  Deleteinvoice,
  getInvoiceDeleteList,
};

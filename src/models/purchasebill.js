var pool = require("../../config");

const GetPurchaseBillList = (data_s) => {
  let delete_flag = "0";
  return new Promise(function (resolve, reject) {
    pool
      .query(
        `SELECT  count(*) OVER() AS total_count, ROW_NUMBER() OVER(ORDER BY i.bill_no) AS sr_no ,i.* , c.customer_name , c.address as customer_address , c.mobile_no as customer_mobile_no  FROM purchasebill i LEFT JOIN customers c ON c.customer_id = i.customer_id  WHERE c.customer_name ${
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

const Addpurchasebill = (req, res) => {
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
  } = req;

  let NewDate = invoice_date.split("-", 3);
  let dateInvoice = `${NewDate[1]}-${NewDate[0]}-${NewDate[2]}`;

  let isactive = "1";
  let delete_flag = "0";
  let company_id = 1;
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "INSERT INTO public.purchasebill(bill_no, purchase_date, customer_id, taxable_amount, sgst, cgst, discount ,bill_amount, isactive , delete_flag,company_id ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9 , $10, $11);",
        [
          bill_no,
          dateInvoice,
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
          "SELECT * FROM purchasebill WHERE bill_no = $1 AND company_id = $2",
          [bill_no, company_id]
        )
      )
      .then((ress) => {
        const purchase_id = ress?.rows?.purchase_id;
        req?.productdata?.map((data) => {
          pool
            .query(
              "INSERT INTO purchasebill_products(product_id,hsn,weight ,rate,amount, bill_no,company_id,purchase_id) values($1,$2,$3,$4,$5,$6,$7,$8) returning *",
              [
                data.product_id,
                data.hsn,
                data.weight,
                data.rate,
                data.amount,
                bill_no,
                company_id,
                purchase_id,
              ]
            )
            .then(function (result) {
              resolve(result.rows[0]);
            })
            .catch(function (err) {
              console.log("err", err);
              reject(err);
            });
        });
      });
  });
};

const getBypurchasebillId = (purchase_id) => {
  return new Promise((resolve) => {
    pool.query(
      "SELECT * FROM public.purchasebill WHERE purchase_id = $1",
      [purchase_id],
      (error, results) => {
        if (error) {
          throw error;
        }
        return resolve(results.rowCount > 0);
      }
    );
  });
};

const UpdatepurchasebillInfo = (req, purchase_id, res) => {
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
  } = req;
  return new Promise(function (resolve, reject) {
    if (!purchase_id) {
      console.log("error: invoice_id missing");
      reject("error: invoice_id missing");
    } else {
      pool
        .query(
          "UPDATE purchasebill  SET bill_no = $1, invoice_date = $2 ,customer_id = $3 , taxable_amount = $4 , sgst = $5 ,  cgst = $6 , discount = $7 , bill_amount = $8 , company_id = $9 WHERE purchase_id = $10 ",
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
            purchase_id,
          ]
        )
        .then(() =>
          pool.query(
            "DELETE FROM purchasebill_products WHERE  purchase_id = $1",
            [purchase_id]
          )
        )
        .then((ress) => {
          req.productdata.map(async (data) => {
            try {
              const result = await pool.query(
                "INSERT INTO purchasebill_products(invoice_id, bill_no, company_id,  product_id, hsn, weight, rate, amount) values($1,$2,$3,$4,$5,$6,$7,$8) returning * ",
                [
                  purchase_id,
                  bill_no,
                  company_id,
                  data.product_id,
                  data.hsn,
                  data.weight,
                  data.rate,
                  data.amount,
                ]
              );
              resolve(result.rows[0]);
            } catch (err) {
              reject(err);
            }
          });
        });
    }
  });
};

const getPurchaseListById = (purchase_id) => {
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "SELECT i.* , c.customer_name , c.address as customer_address , c.mobile_no as  mobile_no  From purchasebill i LEFT JOIN customers c ON c.customer_id = i.customer_id WHERE i.purchase_id = $1",
        [purchase_id]
      )
      .then(function (results) {
        resolve(results.rows[0]);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
const getproductListByPurchaseId = (invoice_id) => {
  console.log("invoice_id", invoice_id);
  return new Promise(function (resolve, reject) {
    pool
      .query(
        "SELECT ip.*, p.product_name FROM purchasebill_products ip LEFT JOIN  products p ON p.product_id = ip.product_id WHERE ip.purchase_id = $1 ORDER By p.product_id ASC ",
        [invoice_id]
      )
      .then(function (results) {
        console.log("results", results.row);
        resolve(results.rows);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};
const UpdatePurchaseInfo = (req, purchase_id, res) => {
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
  } = req;
  return new Promise(function (resolve, reject) {
    if (!purchase_id) {
      console.log("error: purchase_id missing");
      reject("error: purchase_id missing");
    } else {
      pool
        .query(
          "UPDATE purchasebill SET bill_no = $1, purchase_date = $2 ,customer_id = $3 , taxable_amount = $4 , sgst = $5 ,  cgst = $6 , discount = $7 , bill_amount = $8 , company_id = $9 WHERE purchase_id = $10 ",
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
            purchase_id,
          ]
        )
        .then(() =>
          pool.query("DELETE FROM invoice_products WHERE  purchase_id = $1", [
            purchase_id,
          ])
        )
        .then((ress) => {
          req.productdata.map(async (data) => {
            try {
              const result = await pool.query(
                "INSERT INTO invoice_products(purchase_id, bill_no, company_id,  product_id, hsn, weight, rate, amount) values($1,$2,$3,$4,$5,$6,$7,$8) returning * ",
                [
                  purchase_id,
                  bill_no,
                  company_id,
                  data.product_id,
                  data.hsn,
                  data.weight,
                  data.rate,
                  data.amount,
                ]
              );
              resolve(result.rows[0]);
            } catch (err) {
              reject(err);
            }
          });
        });
    }
  });
};
module.exports = {
  GetPurchaseBillList,
  Addpurchasebill,
  getBypurchasebillId,
  UpdatepurchasebillInfo,
  getPurchaseListById,
  getproductListByPurchaseId,
  UpdatePurchaseInfo,
};

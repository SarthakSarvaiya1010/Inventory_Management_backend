require("dotenv").config();
var auth = require("../helpers/auth");
var invoice = require("../models/invoice");
var customer = require("../models/customer");
var product = require("../models/products");
var bankinfo = require("../models/bankinfo");
const fromatedate = require("../helpers/helper");
var filter = require("../helpers/filter");
const fs = require("fs");
const readFile = require("util").promisify(fs.readFile);
const hbs = require("hbs");
const pdf = require("html-pdf");
// const invoiceDataDummy = require("../helpers/dummyData.json");
var converter = require("number-to-words");
let timestamp = Date.now();
let fileName = "./invoice/sample-invoice_data" + timestamp + ".pdf";
var test = require("../helpers/generate");
var stock = require("../models/stock");

const InvoiceList = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        invoice
          .getInvoiceList(data_s)
          .then(async function (result) {
            return res.status(200).json(result);
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization error",
        statusCode: "403",
      });
    });
};
const InvoiceDeleteList = (req, res) => {
  let tokanData = req.headers["authorization"];
  let data_s = filter.filter(req?.query);
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        invoice
          .getInvoiceDeleteList(data_s)
          .then(async function (result) {
            return res.status(200).json(result);
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization error",
        statusCode: "403",
      });
    });
};

const GetInvoiceListByID = (req, res) => {
  const { id } = req.params;
  let tokanData = req.headers["authorization"];
  let InvoiceDataListById = [];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        invoice
          .getInvoiceListById(id)
          .then(async function (invoicelistbyid) {
            invoice
              .getproductListByInvoiceId(id)
              .then(async function (productlistbyid) {
                if (invoicelistbyid && productlistbyid) {
                  let invoice = {};
                  invoice = invoicelistbyid;
                  invoice["productlistdata"] = productlistbyid;
                  InvoiceDataListById.push(invoice);
                  return res.status(200).json(InvoiceDataListById);
                }
              });
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization error",
        statusCode: "403",
      });
    });
};

const GetInvoicePage = (req, res) => {
  let tokanData = req.headers["authorization"];
  let date = fromatedate.formatDate(new Date());
  let data_s = filter.filter(req?.query);

  let invoicedata = [];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        customer
          .getCustomers(data_s)
          .then(async function (customerlist) {
            product
              .getProducts(data_s)
              .then(async function (productlist) {
                if (productlist.length && customerlist.length) {
                  invoice.getInvoiceLastRow().then(async function (result) {
                    if (result[0].max !== null) {
                      const bill_no =
                        parseInt(result[0].max) > 9
                          ? parseInt(result[0].max) + 1
                          : `0${parseInt(result[0].max) + 1}`;
                      let invoice = {};
                      invoice["bill_no"] = bill_no;
                      invoice["date"] = date;
                      invoice["CustomerList"] = customerlist
                        ? customerlist
                        : null;
                      invoice["productList"] = productlist ? productlist : null;
                      invoicedata.push(invoice);
                      return res.status(200).json(invoicedata);
                    } else {
                      let invoice = {};
                      invoice["bill_no"] = "01";
                      invoice["date"] = date;
                      invoice["CustomerList"] = customerlist
                        ? customerlist
                        : null;
                      invoice["productList"] = productlist ? productlist : null;
                      invoicedata.push(invoice);
                      return res.status(200).json(invoicedata);
                    }
                  });
                } else {
                  return res.status(400).json({
                    message: "productlist and customerlist data not found",
                  });
                }
              })
              .catch(function (err) {
                return res.status(400).json({
                  message: "productlist data not found",
                  statusCode: "400",
                });
              });
          })
          .catch(function (err) {
            return res.status(400).json({
              message: "customer  data not found",
              statusCode: "400",
            });
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization error",
        statusCode: "403",
      });
    });
};

const AddInvoice = (req, res) => {
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        stock
          .CheckStock(req.body)
          .then(async function (result1) {
            if (result1) {
              invoice
                .Addinvoice(req.body)
                .then(async function (result) {
                  customer
                    .getCustomersById(req.body.customer_id)
                    .then(async function (result) {
                      let invoiceDataDummy = [
                        {
                          customer_name: result[0]?.customer_name,
                          bill_no: req?.body?.bill_no,
                          customer_address: result[0]?.address,
                          customer_mobile_no: result[0]?.mobile_no,
                          gst: result[0]?.customer_gst,
                          taxable_amount: req?.body?.taxable_amount,
                          sgst: req?.body?.sgst,
                          cgst: req?.body?.cgst,
                          discount: req?.body?.discount,
                          bill_amount: req?.body?.bill_amount,
                        },
                      ];
                      const contentOri = await readFile(
                        "src/helpers/invoice_original.hbs",
                        "utf8"
                      );
                      const contentDup = await readFile(
                        "src/helpers/invoice_duplicate.hbs",
                        "utf8"
                      );
                      const template = hbs.compile(contentOri + contentDup);
                      // new Date(invoiceDataDummy[0].invoice_date);
                      let date = [
                        {
                          date: req?.body?.invoice_date,
                        },
                      ];
                      const test = [];
                      const productdatatyp = req.body.productdata;
                      let count = 0;
                      req?.body?.productdata.map((e, index) => {
                        index++;
                        product
                          .getProductById(e.product_id)
                          .then(async function (result) {
                            test.push({
                              product_name: result?.product_name,
                              bill_no: index,
                              hsn: e?.hsn,
                              weight: e?.weight,
                              rate: e?.rate,
                              amount: e?.amount,
                            });
                            count++;
                            const toWords = [
                              {
                                toWords: converter.toWords(
                                  req?.body?.bill_amount
                                ),
                              },
                            ];
                            if (
                              count === req?.body?.productdata.length &&
                              req?.body?.productdata.length <= 10
                            ) {
                              [...Array(5 - req.body.productdata.length)].map(
                                (e) => test.push({})
                              );
                            }
                            const html = template({
                              invoiceDataDummy,
                              test,
                              productdatatyp,
                              toWords,
                              date,
                            });
                            let pdf_data;
                            const options = {
                              base: `${req.protocol}://${req.get("host")}`, // http://localhost:3000
                              format: "A4",
                            };
                            if (count === req?.body?.productdata.length) {
                              pdf
                                .create(html, options)
                                .toBuffer((err, buffer) => {
                                  if (err) return console.log(err);
                                  // stream.pipe(fs.createWriteStream(fileName));
                                  // res.attachment("invoice.pdf");
                                  // res.end(buffer);
                                  pdf_data = buffer;
                                  setTimeout(() => {
                                    pdfCall();
                                  }, 500);
                                });
                              const pdfCall = () => {
                                // "./invoice/sample-invoice_data 1676630885015.pdf";
                                // const pdfData = fs.readFileSync(test_data_1);
                                const base64Data =
                                  Buffer.from(pdf_data).toString("base64");
                                res.status(200).json({
                                  status: "success",
                                  statusCode: "200",
                                  invoicePdf: base64Data,
                                  message:
                                    "success! Create invoice  suucessfully",
                                });
                                // res.end(buffer);
                              };
                            }
                          })
                          .catch(function (error) {
                            return res.status(400).json({
                              message: error,
                              statusCode: "400",
                            });
                          });
                      });
                    })
                    .catch(function (error) {
                      return res.status(400).json({
                        message: error,
                        statusCode: "400",
                      });
                    });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: "400",
                  });
                });
            } else {
              return res.status(400).json({
                message: "product quantity is not enough",
                statusCode: "400",
              });
            }
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (result) {
      return res.status(403).json({
        message: "Authorization error",
        statusCode: "403",
      });
    });
};

const UpdateInvoiceData = (req, res) => {
  let tokanData = req.headers["authorization"];
  let { invoice_id } = req.params;
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        invoice
          .IsinvoiceExistsByInvoiceId(invoice_id)
          .then(async function (result) {
            if (result) {
              bankinfo
                .UpdateBankbalance(req.body, result[0].bill_amount)
                .then(async function (results) {
                  invoice
                    .UpdateinvoiceInfo(req.body, invoice_id)
                    .then(async function (results) {
                      // return res.status(200).json({
                      //   status: "success",
                      //   statusCode: "200",
                      //   message: "success! invoice data updated suucessfully",
                      // });
                      customer
                        .getCustomersById(req.body.customer_id)
                        .then(async function (results) {
                          let invoiceDataDummy = [
                            {
                              customer_name: results[0]?.customer_name,
                              bill_no: req?.body?.bill_no,
                              customer_address: results[0]?.address,
                              customer_mobile_no: results[0]?.mobile_no,
                              gst: results[0]?.customer_gst,
                              taxable_amount: req?.body?.taxable_amount,
                              sgst: req?.body?.sgst,
                              cgst: req?.body?.cgst,
                              discount: req?.body?.discount,
                              bill_amount: req?.body?.bill_amount,
                            },
                          ];
                          const contentOri = await readFile(
                            "src/helpers/invoice_original.hbs",
                            "utf8"
                          );
                          const contentDup = await readFile(
                            "src/helpers/invoice_duplicate.hbs",
                            "utf8"
                          );
                          const template = hbs.compile(contentOri + contentDup);
                          // new Date(invoiceDataDummy[0].invoice_date);
                          let date = [
                            {
                              date: req?.body?.invoice_date,
                            },
                          ];
                          const test = [];

                          const productdatatyp = req.body.productdata;
                          let count = 0;

                          req?.body?.productdata.map((e, index) => {
                            index++;
                            product
                              .getProductById(e.product_id)
                              .then(async function (result) {
                                test.push({
                                  product_name: result?.product_name,
                                  bill_no: index,
                                  hsn: e?.hsn,
                                  weight: e?.weight,
                                  rate: e?.rate,
                                  amount: e?.amount,
                                });
                                count++;
                                const toWords = [
                                  {
                                    toWords: converter.toWords(
                                      req?.body?.bill_amount
                                    ),
                                  },
                                ];
                                if (
                                  count === req?.body?.productdata.length &&
                                  req?.body?.productdata.length <= 10
                                ) {
                                  [
                                    ...Array(5 - req.body.productdata.length),
                                  ].map((e) => test.push({}));
                                }
                                const html = template({
                                  invoiceDataDummy,
                                  test,
                                  productdatatyp,
                                  toWords,
                                  date,
                                });

                                const options = {
                                  base: `${req.protocol}://${req.get("host")}`, // http://localhost:3000
                                  format: "A4",
                                };

                                if (count === req?.body?.productdata.length) {
                                  pdf
                                    .create(html, options)
                                    .toStream((err, stream) => {
                                      if (err) return console.log(err);
                                      stream.pipe(
                                        fs.createWriteStream(fileName)
                                      );

                                      setTimeout(() => {
                                        pdfCall();
                                      }, 3000);
                                    });
                                  const pdfCall = () => {
                                    const pdfPath = fileName;
                                    // "./invoice/sample-invoice_data 1676630885015.pdf";
                                    const pdfData = fs.readFileSync(pdfPath);
                                    const base64Data =
                                      Buffer.from(pdfData).toString("base64");
                                    res.status(200).json({
                                      status: "success",
                                      statusCode: "200",
                                      invoicePdf: base64Data,
                                      message:
                                        "success! Update invoice suucessfully",
                                    });

                                    // res.end(buffer);
                                  };
                                }
                              });
                          });
                        })
                        .catch(function (error) {
                          return res.status(400).json({
                            message: error,
                            statusCode: "400",
                          });
                        });
                    })
                    .catch(function (error) {
                      return res.status(400).json({
                        message: error,
                        statusCode: "401",
                      });
                    })
                    .catch(function (error) {
                      return res.status(400).json({
                        message: error,
                        statusCode: "400",
                      });
                    });
                  // }
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: "400",
                  });
                });
            } else {
              return res.status(200).json({
                message: "user not exist",
                statusCode: "400",
              });
            }
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization Error",
        statusCode: "403",
      });
    });
};

const PermentDeleteInvoice = (req, res) => {
  const { invoice_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        invoice
          .IsinvoiceExistsByInvoiceId(invoice_id)
          .then(async function (result) {
            if (result) {
              invoice
                .Permentdeletedinvoice(invoice_id)
                .then(async function (result) {
                  return res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success! invoiceData Deleted suucessfully",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: "400",
                  });
                });
            } else {
              return res.status(200).json({
                message: "user not exist",
                statusCode: "400",
              });
            }
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization Error",
        statusCode: "403",
      });
    });
};

const DeleteInvoice = (req, res) => {
  const { invoice_id } = req.params;
  let tokanData = req.headers["authorization"];
  auth
    .AUTH(tokanData)
    .then(async function (result) {
      if (result) {
        invoice
          .IsinvoiceExistsByInvoiceId(invoice_id)
          .then(async function (result) {
            if (result) {
              invoice
                .Deleteinvoice(invoice_id)
                .then(async function (result) {
                  return res.status(200).json({
                    status: "success",
                    statusCode: "200",
                    message: "success! invoice Deleted suucessfully",
                  });
                })
                .catch(function (error) {
                  return res.status(400).json({
                    message: error,
                    statusCode: "400",
                  });
                });
            } else {
              return res.status(200).json({
                message: "user not exist",
                statusCode: "400",
              });
            }
          })
          .catch(function (error) {
            return res.status(400).json({
              message: error,
              statusCode: "400",
            });
          });
      } else {
        return res.status(403).json({
          message: "Authorization error",
          statusCode: "403",
        });
      }
    })
    .catch(function (error) {
      return res.status(403).json({
        message: "Authorization Error",
        statusCode: "403",
      });
    });
};

const InvoiceGetPdf = async (req, res) => {
  const contentOri = await readFile("src/helpers/invoice_original.hbs", "utf8");
  const contentDup = await readFile(
    "src/helpers/invoice_duplicate.hbs",
    "utf8"
  );
  const template = hbs.compile(contentOri + contentDup);
  // new Date(invoiceDataDummy[0].invoice_date);
  let date = [
    {
      date: fromatedate.formatDate(new Date(invoiceDataDummy[0].invoice_date)),
    },
  ];
  const test = invoiceDataDummy[0].productlistdata;
  const toWords = [
    {
      toWords: converter.toWords(invoiceDataDummy[0].bill_amount),
    },
  ];
  const html = template({
    invoiceDataDummy,
    test,
    toWords,
    date,
  });
  const options = {
    base: `${req.protocol}://${req.get("host")}`, // http://localhost:3000
    format: "letter",
  };

  pdf.create(html, options).toBuffer((err, buffer) => {
    if (err) return console.log(err);
    res.attachment("invoice.pdf");
    res.end(buffer);
  });

  // pdf.create(html, options).toStream((err, stream) => {
  //   if (err) return console.log(err);
  //   stream.pipe(fs.createWriteStream(fileName));
  //   // res.attachment("invoice.pdf");
  //   // res.end(stream);
  //   res.status(400).json({
  //     status: "success",
  //     statusCode: "200",
  //     message: "success! Create invoice  suucessfully",
  //   });
  // });
};

const checkpdf = (req, res) => {
  test
    .printPDF()
    .then((pdf) => {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length,
      });
      res.send(pdf);
    })

    .catch(function (error) {
      return res.status(400).json({
        message: error,
        statusCode: "400",
      });
    });
};

// const printInvoice = (req, res) => {
//   let tokanData = req.headers["authorization"];

//   auth
//     .AUTH(tokanData)
//     .then(async function (result) {
//       if (result) {
//         customer
//           .getCustomersById(req.body.customer_id)
//           .then(async function (result) {
//             let invoiceDataDummy = [
//               {
//                 customer_name: result[0]?.customer_name,
//                 bill_no: req?.body?.bill_no,
//                 customer_address: result[0]?.address,
//                 customer_mobile_no: result[0]?.mobile_no,
//                 gst: result[0]?.customer_gst,
//                 taxable_amount: req?.body?.taxable_amount,
//                 sgst: req?.body?.sgst,
//                 cgst: req?.body?.cgst,
//                 discount: req?.body?.discount,
//                 bill_amount: req?.body?.bill_amount,
//               },
//             ];
//             const contentOri = await readFile(
//               "src/helpers/invoice_original.hbs",
//               "utf8"
//             );
//             const contentDup = await readFile(
//               "src/helpers/invoice_duplicate.hbs",
//               "utf8"
//             );
//             const template = hbs.compile(contentOri + contentDup);
//             // new Date(invoiceDataDummy[0].invoice_date);
//             let date = [
//               {
//                 date: req?.body?.invoice_date,
//               },
//             ];
//             const test = [];

//             const productdatatyp = req.body.productdata;
//             let count = 0;

//             req?.body?.productdata.map((e, index) => {
//               index++;
//               product
//                 .getProductById(e.product_id)
//                 .then(async function (result) {
//                   test.push({
//                     product_name: result?.product_name,
//                     bill_no: index,
//                     hsn: e?.hsn,
//                     weight: e?.weight,
//                     rate: e?.rate,
//                     amount: e?.amount,
//                   });
//                   count++;
//                   const toWords = [
//                     {
//                       toWords: converter.toWords(req?.body?.bill_amount),
//                     },
//                   ];
//                   if (
//                     count === req?.body?.productdata.length &&
//                     req?.body?.productdata.length <= 10
//                   ) {
//                     [...Array(5 - req.body.productdata.length)].map((e) =>
//                       test.push({})
//                     );
//                   }
//                   const html = template({
//                     invoiceDataDummy,
//                     test,
//                     productdatatyp,
//                     toWords,
//                     date,
//                   });
//                   let pdf_data;
//                   const options = {
//                     base: `${req.protocol}://${req.get("host")}`, // http://localhost:3000
//                     format: "A4",
//                   };

//                   if (count === req?.body?.productdata.length) {
//                     pdf.create(html, options).toBuffer((err, buffer) => {
//                       if (err) return console.log(err);
//                       // stream.pipe(fs.createWriteStream(fileName));
//                       // res.attachment("invoice.pdf");
//                       // res.end(buffer);
//                       pdf_data = buffer;
//                       setTimeout(() => {
//                         pdfCall();
//                       }, 500);
//                     });
//                     const pdfCall = () => {
//                       // "./invoice/sample-invoice_data 1676630885015.pdf";
//                       // const pdfData = fs.readFileSync(test_data_1);
//                       const base64Data =
//                         Buffer.from(pdf_data).toString("base64");
//                       res.status(200).json({
//                         status: "success",
//                         statusCode: "200",
//                         invoicePdf: base64Data,
//                         message: "success! Create invoice  suucessfully",
//                       });

//                       // res.end(buffer);
//                     };
//                   }
//                 })
//                 .catch();
//             });
//           })
//           .catch(function (error) {
//             return res.status(400).json({
//               message: error,
//               statusCode: "400",
//             });
//           });
//       } else {
//         return res.status(403).json({
//           message: "Authorization error",
//           statusCode: "403",
//         });
//       }
//     })
//     .catch(function (error) {
//       return res.status(403).json({
//         message: "Authorization error",
//         statusCode: "403",
//       });
//     });
// };

const printInvoice = async (req, res) => {
  try {
    const tokenData = req.headers["authorization"];
    const isAuth = await auth.AUTH(tokenData);
    if (!isAuth) {
      return res.status(403).json({ message: "Authorization error", statusCode: "403" });
    }

    const customerData = await customer.getCustomersById(req.body.customer_id);
    const invoiceDataDummy = [
      {
        customer_name: customerData[0]?.customer_name,
        bill_no: req.body.bill_no,
        customer_address: customerData[0]?.address,
        customer_mobile_no: customerData[0]?.mobile_no,
        gst: customerData[0]?.customer_gst,
        taxable_amount: req.body.taxable_amount,
        sgst: req.body.sgst,
        cgst: req.body.cgst,
        discount: req.body.discount,
        bill_amount: req.body.bill_amount,
      },
    ];

    const date = [{ date: req.body.invoice_date }];
    const productData = req.body.productdata || [];

    const test = await Promise.all(
      productData.map(async (e, index) => {
        const result = await product.getProductById(e.product_id);
        return {
          product_name: result?.product_name,
          bill_no: index + 1,
          hsn: e.hsn,
          weight: e.weight,
          rate: e.rate,
          amount: e.amount,
        };
      })
    );

    // Padding for consistent row count
    while (test.length < 5) test.push({});

    const toWords = [
      {
        toWords: converter.toWords(req.body.bill_amount),
      },
    ];

    const contentOri = await readFile("src/helpers/invoice_original.hbs", "utf8");
    const contentDup = await readFile("src/helpers/invoice_duplicate.hbs", "utf8");
    const template = hbs.compile(contentOri + contentDup);
    const html = template({ invoiceDataDummy, test, toWords, date });

    const options = {
      base: `${req.protocol}://${req.get("host")}`,
      format: "A4",
    };

    pdf.create(html, options).toBuffer((err, buffer) => {
      if (err) return res.status(500).json({ error: "PDF generation failed" });

      const base64Data = Buffer.from(buffer).toString("base64");
      res.status(200).json({
        status: "success",
        statusCode: "200",
        invoicePdf: base64Data,
        message: "Successfully created invoice.",
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", statusCode: "500" });
  }
};

module.exports = {
  InvoiceList,
  InvoiceDeleteList,
  GetInvoiceListByID,
  GetInvoicePage,
  AddInvoice,
  UpdateInvoiceData,
  PermentDeleteInvoice,
  DeleteInvoice,
  InvoiceGetPdf,
  checkpdf,
  printInvoice,
};

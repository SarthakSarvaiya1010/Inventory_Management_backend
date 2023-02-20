// const pdfKit = require("pdfkit");
// const fs = require("fs");
// const PDFDocument = require("pdfkit-table");

// // let companyLogo = "./images/companyLogo.png";
// let timestamp = Date.now();
// let fileName = "./invoice/sample-invoice-" + timestamp + ".pdf";
// let fontNormal = "Helvetica";
// let fontBold = "Helvetica-Bold";

// let sellerInfo = {
//   companyName: "Best Sales Pvt. Ltd.",
//   address: "Mumbai Central",
//   city: "Mumbai",
//   state: "Maharashtra",
//   pincode: "400017",
//   country: "India",
//   contactNo: "+910000000600",
// };

// let customerInfo = {
//   customerName: "Customer ABC",
//   address: "R783, Rose Apartments, Santacruz (E)",
//   city: "Mumbai",
//   state: "Maharashtra",
//   pincode: "400054",
//   country: "India",
//   contactNo: "+910000000787",
// };

// let orderInfo = {
//   orderNo: "15484659",
//   invoiceNo: "MH-MU-1077",
//   invoiceDate: "11/05/2021",
//   invoiceTime: "10:57:00 PM",
//   products: [
//     {
//       id: "15785",
//       name: "Acer Aspire E573",
//       company: "Acer",
//       unitPrice: 39999,
//       totalPrice: 39999,
//       qty: 1,
//     },
//     {
//       id: "15786",
//       name: "Dell Magic Mouse WQ1545",
//       company: "Dell",
//       unitPrice: 2999,
//       totalPrice: 5998,
//       qty: 2,
//     },
//   ],
//   totalValue: 45997,
// };

// exports.createPdfed = () => {
//   try {
//     let pdfDoc = new pdfKit();

//     let stream = fs.createWriteStream(fileName);
//     pdfDoc.pipe(stream);

//     pdfDoc.text("Tax Invoice", 8, 8, {
//       align: "center",
//       width: 600,
//     });
//     pdfDoc.text("SILVER PALACE", 20, 20, {
//       align: "center",
//       width: 600,
//     });
//     // pdfDoc.rect(50, 100, 50, 50).stroke();

//     pdfDoc.rect(28, 110, 105, 20).stroke("#000");
//     pdfDoc.fillColor("#000").text("Name", 30, 115, { width: 90 });
//     pdfDoc.rect(133, 110, 235, 20).stroke();
//     pdfDoc.text("Sanajay kumar", 135, 115, { width: 250 });
//     pdfDoc.rect(368, 110, 100, 20).stroke();
//     pdfDoc.text("Bill No", 374, 115, { width: 100 });
//     pdfDoc.rect(468, 110, 115, 20).stroke();
//     pdfDoc.text("3", 471, 115, { width: 100 });
//     pdfDoc.rect(28, 132, 105, 20).stroke();
//     pdfDoc.text("Address", 30, 132, { width: 100 });

//     // let productNo = 1;
//     // orderInfo.products.forEach((element) => {
//     //   console.log("adding", element.name);
//     //   let y = 125 + productNo * 20;
//     //   pdfDoc.fillColor("#000").text(element.id, 20, y, { width: 90 });
//     //   pdfDoc.text(element.name, 110, y, { width: 190 });
//     //   pdfDoc.text(element.qty, 300, y, { width: 100 });
//     //   pdfDoc.text(element.unitPrice, 400, y, { width: 100 });
//     //   pdfDoc.text(element.totalPrice, 500, y, { width: 100 });
//     //   productNo++;
//     // });

//     pdfDoc
//       .rect(7, 256 + productNo * 20, 560, 0.2)
//       .fillColor("#000")
//       .stroke("#000");
//     productNo++;

//     pdfDoc.font(fontBold).text("Total:", 400, 256 + productNo * 17);
//     pdfDoc.font(fontBold).text(orderInfo.totalValue, 500, 256 + productNo * 17);

//     pdfDoc.end();
//     console.log("pdf generate successfully");
//   } catch (error) {
//     console.log("Error occurred", error);
//   }
// };

// // createPdf();
// exports.createPdf = () => {
//   let doc = new PDFDocument();
//   doc.pipe(fs.createWriteStream("./invoice/document" + timestamp + ".pdf"));

//   const Name = {
//     headers: [
//       { label: "No", property: "no", width: 60, renderer: null },
//       {
//         label: "ITEM DESCRIPTION",
//         property: "itemdescription",
//         width: 60,
//         renderer: null,
//       },
//       { label: "HSN", property: "hsn", width: 60, renderer: null },
//       {
//         label: "NET WEIGHT [In Grams]",
//         property: "weight",
//         width: 60,
//         renderer: null,
//       },
//       {
//         label: "RATE",
//         property: "rate",
//         width: 60,
//         renderer: null,
//       },
//       {
//         label: "AMOUNT",
//         property: "amount",
//         width: 60,
//         renderer: null,
//       },
//       {
//         label: "AMOUNT",
//         property: "amount",
//         width: 60,
//         renderer: null,
//       },
//     ],
//     rows: [
//       [
//         "1",
//         "SILVER ORNAMENTS",
//         "7113 ",
//         "14.700 ",
//         "92",
//         "1352.4000",
//         "1352.4000",
//       ],
//       [
//         "2",
//         "SILVER ORNAMENTS",
//         "7113 ",
//         "14.700 ",
//         "92",
//         "1352.4000",
//         "1352.4000",
//       ],
//     ],

//     datas: [
//       {
//         no: " 1",
//         itemdescription: "SILVER ORNAMENTS",
//         hsn: "7113",
//         weight: "14.700",
//         rate: "92",
//         amount: "1352.4000",
//         amount: "1352.4000",
//       },
//       {
//         options: { fontSize: 50, separation: true },
//         no: "bold:Name 2",
//         itemdescription: "bold:SILVER ORNAMENTS",
//         hsn: "bold:7113",
//         weight: "bold:14.700",
//         rate: {
//           label: "92",
//           options: { fontSize: 12 },
//         },
//         amount: "1352.4000",
//         amount: "1352.4000",
//       },
//       // {...},
//     ],
//   };

//   const table = {
//     title: "Title",
//     subtitle: "Subtitle",
//     headers: [
//       { label: "Name", property: "name", width: 60, renderer: null },
//       {
//         label: "Description",
//         property: "description",
//         width: 150,
//         renderer: null,
//       },
//       { label: "Price 1", property: "price1", width: 100, renderer: null },
//       { label: "Price 2", property: "price2", width: 100, renderer: null },
//       { label: "Price 3", property: "price3", width: 80, renderer: null },
//       {
//         label: "Price 4",
//         property: "price4",
//         width: 43,
//         renderer: (value, indexColumn, indexRow, row, rectRow, rectCell) => {
//           return `U$ ${Number(value).toFixed(2)}`;
//         },
//       },
//     ],
//     // complex data
//     datas: [
//       {
//         name: "Name 1",
//         description:
//           "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mattis ante in laoreet egestas. ",
//         price1: "$1",
//         price3: "$ 3",
//         price2: "$2",
//         price4: "4",
//       },
//       {
//         options: { fontSize: 10, separation: true },
//         name: "bold:Name 2",
//         description: "bold:Lorem ipsum dolor.",
//         price1: "bold:$1",
//         price3: {
//           label: "PRICE $3",
//           options: { fontSize: 12 },
//         },
//         price2: "$2",
//         price4: "4",
//       },
//       // {...},
//     ],
//     // simeple data
//     rows: [
//       [
//         "Apple",
//         "Nullam ut facilisis mi. Nunc dignissim ex ac vulputate facilisis.",
//         "$ 105,99",
//         "$ 105,99",
//         "$ 105,99",
//         "105.99",
//       ],
//       // [...],
//     ],
//   };
//   // the magic
//   doc.table(table, {
//     prepareHeader: () => doc.font("Helvetica-Bold").fontSize(8),
//     prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
//       doc.font("Helvetica").fontSize(8);
//       indexColumn === 0 && doc.addBackground(rectRow, "blue", 0.15);
//     },
//   });

//   // or columnsSize
//   doc.table(Name, {
//     prepareHeader: () => doc.font("Helvetica-Bold").fontSize(15),
//     prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
//       doc.font("Helvetica").fontSize(12);
//       indexColumn === 0 && doc.addBackground(rectRow, "white", 0.55);
//     },
//   });

//   // done!
//   doc.end();
// };

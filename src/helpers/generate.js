const fs = require("fs");
const path = require("path");
const utils = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");

const readFile = utils.promisify(fs.readFile);
async function getTemplateHtml() {
  console.log("Loading template file in memory");
  try {
    const invoicePath = path.resolve("./template.html");
    return await readFile(invoicePath, "utf8");
  } catch (err) {
    return Promise.reject("Could not load html template");
  }
}
async function generatePdf() {
  let data = {};
  getTemplateHtml()
    .then(async (res) => {
      console.log("Compiing the template with handlebars");
      const template = hb.compile(res, { strict: true });
      // we have compile our code with handlebars
      const result = template(data);
      const html = result;
      // we are using headless mode
      const browser = await puppeteer.launch();
      const page = await browser.newPage();
      // We set the page content as the generated html by handlebars
      await page.setContent(html);
      // We use pdf function to generate the pdf in the same folder as this file.
      await page.pdf({ path: "invoice.pdf", format: "A4" });
      await browser.close();
      console.log("PDF Generated");
    })
    .catch((err) => {
      console.error(err);
    });
}
// generatePdf();

exports.printPDF = async () => {
  console.log("printPDF start");
  const browser = await puppeteer.launch({
    headless: true,
    ignoreDefaultArgs: [],
    timeout: 3000,
  });
  console.log("browser");
  const page = await browser.newPage();
  console.log("pag");
  await page.type("#email", process.env.PDF_USER);
  await page.type("#password", process.env.PDF_PASSWORD);
  await page.click("#submit");

  await page.addStyleTag({
    content:
      ".nav { display: none} .navbar { border: 0px} #print-button {display: none}",
  });
  await page.goto("https://blog.risingstack.com", {
    waitUntil: "networkidle0",
  });
  const pdf = await page.pdf({ format: "A4" });
  console.log("pdf");
  await browser.close();
  console.log("browser.close");
  return pdf;
};

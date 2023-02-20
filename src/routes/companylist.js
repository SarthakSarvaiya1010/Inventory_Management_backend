const express = require("express");
const router = express.Router();
const companycontroller = require("../controllers/company.controller");
const imageUploader = require("../helpers/imageUploader");

router.get(
  "/company_info",
  companycontroller.GetCompanyList,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.get(
  "/delete/company_info",
  companycontroller.GetDeletedCompany,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.post(
  "/add/company_info",
  imageUploader.upload.single("image_src"),
  companycontroller.AddCompany_info,
  async (req, res, next) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res
      .status(400)
      .send({ message: error.message, status: "failed", statusCode: "400" });
  }
);
router.put(
  "/edit/company_info/:company_id",
  imageUploader.upload.single("image_src"),
  companycontroller.EditCompanyInfo,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.delete(
  "/permanent/delete/company_info/:company_id",
  companycontroller.PermentDeleteCompany,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);
router.delete(
  "/delete/company_info/:company_id",
  companycontroller.DeleteCompany,
  (req, res) => {
    res.send(req.data);
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

module.exports = router;

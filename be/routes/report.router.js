const express = require("express");
const reportRouter = express.Router();
const {ReportController} = require("../controllers/index");

reportRouter.post("/create",  ReportController.createReport);
reportRouter.get("/",  ReportController.getAllReports);
reportRouter.get("/:id", ReportController.getReportById);
reportRouter.put("/:id",  ReportController.updateReport);
reportRouter.delete("/:id",  ReportController.deleteReport);

module.exports = reportRouter;

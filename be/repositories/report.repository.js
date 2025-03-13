const Report = require("../models/Report");


    async function createReport(data) {
        return await Report.create(data);
    }

    async function getAllReports() {
        return await Report.find().populate("reportBy").populate("questionFile");
    }

    async function getReportById(id) {
        return await Report.findById(id).populate("reportBy").populate("questionFile");
    }

    async function updateReport(id, data) {
        return await Report.findByIdAndUpdate(id, data, { new: true });
    }

    async function deleteReport(id) {
        return await Report.findByIdAndDelete(id);
    }


module.exports = {
    createReport, getReportById,getAllReports,updateReport,deleteReport
}

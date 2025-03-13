const {ReportRepository} = require("../repositories/index");


    async function createReport(data) {
        return await ReportRepository.createReport(data);
    }

    async function getAllReports() {
        return await ReportRepository.getAllReports();
    }

    async function getReportById(id) {
        return await ReportRepository.getReportById(id);
    }

    async function updateReport(id, data) {
        return await ReportRepository.updateReport(id, data);
    }

    async function deleteReport(id) {
        return await ReportRepository.deleteReport(id);
    }


module.exports = {
    createReport, getAllReports, getReportById, updateReport, deleteReport
}

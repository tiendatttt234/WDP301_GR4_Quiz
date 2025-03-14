const {ReportService} = require("../services/index");

    async function createReport(req, res) {
        try {
            const report = await ReportService.createReport(req.body);
            return res.status(201).json(report);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async function getAllReports(req, res) {
        try {
            const reports = await ReportService.getAllReports();
            return res.status(200).json(reports);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async function getReportById(req, res) {
        try {
            const report = await ReportService.getReportById(req.params.id);
            if (!report) {
                return res.status(404).json({ message: "Report not found" });
            }
            return res.status(200).json(report);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async function updateReport(req, res) {
        try {
            const report = await ReportService.updateReport(req.params.id, req.body);
            if (!report) {
                return res.status(404).json({ message: "Report not found" });
            }
            return res.status(200).json(report);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async function deleteReport(req, res) {
        try {
            const report = await ReportService.deleteReport(req.params.id);
            if (!report) {
                return res.status(404).json({ message: "Report not found" });
            }
            return res.status(200).json({ message: "Report deleted successfully" });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }


module.exports = {
    createReport,getAllReports,getReportById,updateReport,deleteReport
};

const express = require('express');
const ExportRouter = express.Router();
const {ExportController} = require('../controllers');

ExportRouter.get('/export', ExportController.exportQuestions);


module.exports = ExportRouter;
const express = require('express');
const TransactionRouter = express.Router();
const TransactionController = require('../controllers/Transaction.controller');

TransactionRouter.post('/create', TransactionController.createPayment);
TransactionRouter.get('/vnpay/return', TransactionController.handleReturn);
TransactionRouter.post('/vnpay/ipn', TransactionController.handleIPN);

module.exports = TransactionRouter;
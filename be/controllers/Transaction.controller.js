// controllers/PaymentController.js
const TransactionService = require("../services/Transaction.service");


  async function createPayment(req, res) {
    const { orderId, amount, orderInfo, createBy } = req.body; // createBy là ObjectId của Account
    const ipAddr = req.ip || req.connection.remoteAddress;

    try {
      const paymentUrl = await TransactionService.createPaymentUrl({
        orderId,
        amount,
        orderInfo,
        createBy,
        ipAddr,
      });
      res.json({ success: true, paymentUrl });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async function handleReturn(req, res) {
    try {
      const result = await TransactionService.verifyReturnUrl(req.query);
      if (result.success) {
        res.send('Thanh toán thành công!');
      } else {
        res.send('Thanh toán thất bại!');
      }
    } catch (error) {
      res.status(500).send('Lỗi xử lý return URL');
    }
  }

  async function handleIPN(req, res) {
    try {
      const result = await TransactionService.handleIPN(req.query);
      res.json(result);
    } catch (error) {
      res.status(500).json({ RspCode: '99', Message: 'Unknown error' });
    }
  }


const TransactionController = {
    createPayment,
    handleReturn,
    handleIPN,
    };
module.exports = TransactionController;
// controllers/PaymentController.js
const TransactionService = require("../services/Transaction.service");


async function createPayment(req, res) {
  const { orderId, amount, orderInfo, createBy } = req.body;
  const ipAddr = req.ip || req.connection.remoteAddress;
  console.log("ipAddr", ipAddr);
  
  try {
    const paymentUrl = await TransactionService.createPaymentUrl({
      orderId,
      amount,
      orderInfo,
      createBy,
      ipAddr,
    });
    console.log("paymentUrl", paymentUrl);
    
    res.json({ success: true, paymentUrl });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function handleReturn(req, res) {
  try {
    const result = await TransactionService.verifyReturnUrl(req.query);
    if (result.success) {
      // Chuẩn bị dữ liệu để gửi về client qua query parameters
      const amount = (parseInt(req.query.vnp_Amount) / 100).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
      const transactionDate = req.query.vnp_PayDate;
      const formattedDate = `${transactionDate.slice(6, 8)}/${transactionDate.slice(4, 6)}/${transactionDate.slice(0, 4)} ${transactionDate.slice(8, 10)}:${transactionDate.slice(10, 12)}:${transactionDate.slice(12, 14)}`;
      const transactionId = req.query.vnp_TransactionNo;
      const orderId = req.query.vnp_TxnRef;

      // Redirect về client với thông tin giao dịch
      const redirectUrl = `http://localhost:3000/payment/vnpay/return?success=true&amount=${encodeURIComponent(amount)}&transactionDate=${encodeURIComponent(formattedDate)}&transactionId=${transactionId}&orderId=${orderId}`;
      res.redirect(redirectUrl);
    } else {
      // Redirect về client với thông báo lỗi
      const redirectUrl = `http://localhost:3000/payment/vnpay/return?success=false&message=${encodeURIComponent('Thanh toán thất bại! Vui lòng thử lại.')}`;
      res.redirect(redirectUrl);
    }
  } catch (error) {
    res.redirect(`http://localhost:3000/payment/vnpay/return?success=false&message=${encodeURIComponent('Lỗi xử lý return URL')}`);
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
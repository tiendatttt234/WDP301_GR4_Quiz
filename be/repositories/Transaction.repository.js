
const {Transaction} = require("../models");


  async function createPayment(data) {
    return await Transaction.create(data);
  }

  async function findPaymentByOrderId(orderId) {
    return await Transaction.findOne({ orderId }).populate('createBy');
  }

  async function updatePaymentStatus(orderId, status, vnpayBankCode, vnpTransactionId) {
    return await Transaction.findOneAndUpdate(
      { orderId },
      { status, vnpayBankCode, vnpTransactionId },
      { new: true }
    ).populate('createBy');
  };

const TransactionRepository = {
    createPayment,
    findPaymentByOrderId,
    updatePaymentStatus
}
module.exports = TransactionRepository;
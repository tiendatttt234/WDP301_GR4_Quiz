
const {Transaction} = require("../models");


  async function createPayment(data) {
    return await Payment.create(data);
  }

  async function findPaymentByOrderId(orderId) {
    return await Payment.findOne({ orderId }).populate('createBy');
  }


const TransactionRepository = {
    createPayment,
    findPaymentByOrderId,
}
module.exports = TransactionRepository;
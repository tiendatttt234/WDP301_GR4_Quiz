const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true }, // Tham chiếu đến Account
    amount: { type: Number, required: true },
    orderInfo: { type: String, required: true }, // Thông tin đơn hàng
    vnpTransactionId: { type: String }, // Mã giao dịch từ VNPAY
    status: { type: String, default: 'pending' }, // pending, success, failed
    vnpayTxnRef: { type: String },
    createdAt: { type: Date, default: Date.now },
})

const Transaction = mongoose.model("Transaction", TransactionSchema);
module.exports = Transaction;
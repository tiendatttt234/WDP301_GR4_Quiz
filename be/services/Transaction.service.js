
const crypto = require('crypto');
const { vnpay } = require('../config/vnpay.config');
const TransactionRepository = require("../repositories/Transaction.repository");
const AccountRepository = require('../repositories/Account.repository');


  async function createPaymentUrl({ orderId, amount, orderInfo, createBy, ipAddr }) {
    
    // Lưu giao dịch vào DB trước khi tạo URL
    await TransactionRepository.createPayment({
      orderId,
      amount,
      orderInfo,
      createBy,
    });

    const date = new Date();
    const createDate = date.toISOString().replace(/[-:T.]/g, '').slice(0, 14);

    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: vnpay.tmnCode,
      vnp_Amount: amount * 100,
      vnp_CreateDate: createDate,
      vnp_CurrCode: 'VND',
      vnp_IpAddr: ipAddr,
      vnp_Locale: 'vn',
      vnp_OrderInfo: orderInfo, // Sử dụng orderInfo từ client
      vnp_OrderType: 'billpayment',
      vnp_ReturnUrl: vnpay.returnUrl,
      vnp_TxnRef: orderId,
    };

    const sortedParams = Object.keys(vnpParams)
      .sort()
      .reduce((result, key) => {
        result[key] = vnpParams[key];
        return result;
      }, {});

    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', vnpay.hashSecret);
    const vnp_SecureHash = hmac.update(signData).digest('hex');

    sortedParams.vnp_SecureHash = vnp_SecureHash;

    const vnpUrl = new URL(vnpay.url);
    vnpUrl.search = new URLSearchParams(sortedParams).toString();

    return vnpUrl.toString();
  }

  async function verifyReturnUrl(query) {
    const vnp_SecureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;

    const sortedParams = Object.keys(query)
      .sort()
      .reduce((result, key) => {
        result[key] = query[key];
        return result;
      }, {});

    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', vnpay.hashSecret);
    const calculatedHash = hmac.update(signData).digest('hex');

    if (calculatedHash === vnp_SecureHash && query.vnp_ResponseCode === '00') {
      const payment = await TransactionRepository.updatePaymentStatus(
        query.vnp_TxnRef,
        'success',
        query.vnp_BankCode,
        query.vnp_TransactionNo
      );

      // Cập nhật trạng thái Prime
      const accountId = payment.createBy._id;
      const primeExpiresAt = new Date();
      primeExpiresAt.setDate(primeExpiresAt.getDate() + 30); // Hết hạn sau 30 ngày
      await AccountRepository.updatePrimeStatus(accountId, true, primeExpiresAt);

      return { success: true, data: query };
    } else {
      await TransactionRepository.updatePaymentStatus(
        query.vnp_TxnRef,
        'failed',
        query.vnp_BankCode,
        query.vnp_TransactionNo
      );
      return { success: false, message: 'Thanh toán thất bại hoặc chữ ký không hợp lệ' };
    }
  }

  async function handleIPN(query) {
    const vnp_SecureHash = query.vnp_SecureHash;
    delete query.vnp_SecureHash;

    const sortedParams = Object.keys(query)
      .sort()
      .reduce((result, key) => {
        result[key] = query[key];
        return result;
      }, {});

    const signData = new URLSearchParams(sortedParams).toString();
    const hmac = crypto.createHmac('sha512', vnpay.hashSecret);
    const calculatedHash = hmac.update(signData).digest('hex');

    if (calculatedHash === vnp_SecureHash && query.vnp_ResponseCode === '00') {
      const payment = await TransactionRepository.updatePaymentStatus(
        query.vnp_TxnRef,
        'success',
        query.vnp_BankCode,
        query.vnp_TransactionNo
      );

      // Cập nhật trạng thái Prime
      const accountId = payment.createBy._id;
      const primeExpiresAt = new Date();
      primeExpiresAt.setDate(primeExpiresAt.getDate() + 30); // Hết hạn sau 30 ngày
      await AccountRepository.updatePrimeStatus(accountId, true, primeExpiresAt);

      return { RspCode: '00', Message: 'Confirm Success' };
    } else {
      return { RspCode: '97', Message: 'Invalid Checksum or Transaction Failed' };
    }
  }

  const TransactionService = {
    createPaymentUrl,
    verifyReturnUrl,
    handleIPN,
  }

module.exports = TransactionService;
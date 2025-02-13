const AccountService = require("../services/Account.service");

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email và mật khẩu là bắt buộc",
      });
    }

    const accountData = await AccountService.loginService(email, password);

    return res.status(200).json({
      success: true,
      data: accountData,
    });
  } catch (error) {
    console.error("Error in login:", error.message);
    next(error);
  }
}

module.exports = {
  loginController,
};

const AccountService = require("../services/Account.service");

async function registerController(req, res, next) {
  try {
    const { email, password, userName } = req.body;

    if (!email || !password || !userName) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const result = await AccountService.registerService(
      email,
      password,
      userName
    );

    return res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Error in register:", error.message);
    next(error);
  }
}

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
async function getAccountController(req, res, next) {
  try {
    const { userName } = req.params;
    const account = await AccountService.getAccountService(userName);

    return res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Error in getAccount:", error.message);
    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
  getAccountController,
};

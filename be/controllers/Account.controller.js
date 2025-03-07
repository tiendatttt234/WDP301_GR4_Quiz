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
    const { id } = req.params;
    const account = await AccountService.getAccountService(id);

    return res.status(200).json({
      success: true,
      data: account,
    });
  } catch (error) {
    console.error("Error in getAccount:", error.message);
    next(error);
  }
}
async function updateAccountController(req, res, next) {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    const updatedAccount = await AccountService.updateAccountService(
      id,
      updateFields
    );

    return res.status(200).json({
      success: true,
      data: updatedAccount,
    });
  } catch (error) {
    console.error("Error in updateAccount:", error.message);
    next(error);
  }
}
async function changePasswordController(req, res, next) {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!id || !oldPassword || !newPassword) {
      return res.status(400).json({
        status: false,
        message: "Vui lòng điền đầy đủ thông tin",
      });
    }

    await AccountService.changePasswordService(id, oldPassword, newPassword);

    return res.status(200).json({
      status: true,
      message: "Đổi mật khẩu thành công",
    });
  } catch (error) {
    console.error("Error changing password:", error.message);
    return res.status(500).json({
      status: false,
      message: "Lỗi server",
      error: error.message,
    });
  }
}
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await AccountService.requestPasswordReset(email);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    const result = await AccountService.resetPassword(id, token, password);
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "Error", error: error.message });
  }
};

module.exports = {
  registerController,
  loginController,
  getAccountController,
  updateAccountController,
  changePasswordController,
  forgetPassword,
  resetPassword,
};

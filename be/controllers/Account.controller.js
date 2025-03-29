const AccountService = require("../services/Account.service");
const multer = require("multer");
const path = require("path");

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
  }  catch (error) {
    console.error("Error in login:", error.message);

    // Nếu lỗi có statusCode thì dùng, ngược lại mặc định 500
    const statusCode = error.statusCode || 500;
    return res.status(statusCode).json({
      success: false,
      message: error.message || "Đã có lỗi xảy ra",
    });
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
// Cấu hình multer để lưu file vào thư mục 'uploads'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Thư mục lưu trữ file
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Tạo tên file duy nhất
  },
});

const upload = multer({ storage: storage }).single("avatar");
async function updateAccountController(req, res, next) {
  try {
    const { id } = req.params;
    const updateFields = req.body;

    // Nếu có file avatar được upload
    if (req.file) {
      updateFields.avatar = `/uploads/${req.file.filename}`;
    }

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
      message: "Mật khẩu hiện tại không đúng ",
      error: error.message,
    });
  }
}
const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        status: "error",
        message: "Vui lòng nhập email",
      });
    }

    const result = await AccountService.requestPasswordReset(email);
    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Đã xảy ra lỗi server",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        status: "error",
        message: "Mật khẩu không được để trống",
      });
    }

    const result = await AccountService.resetPassword(id, token, password);

    if (result.status === "error") {
      return res.status(400).json(result);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi xử lý yêu cầu",
    });
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
  upload,
};

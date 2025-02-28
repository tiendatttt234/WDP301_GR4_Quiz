const express = require("express");
const accountRouter = express.Router();
const {
  loginController,
  registerController,
  getAccountController,
  updateAccountController,
  changePasswordController,
} = require("../controllers/Account.controller");

// Định tuyến cho đăng ký và đăng nhập
accountRouter.post("/register", registerController);
accountRouter.post("/login", loginController);
accountRouter.get("/profile/:id", getAccountController);
accountRouter.patch("/profile/:id", updateAccountController);
accountRouter.patch("/:id/change-password", changePasswordController);
const forgetPass = async (req, res) => {
  const { email } = req.body;
  try {
    // Tìm người dùng trong model Account
    const account = await Account.findOne({ email: email }).exec();
    if (!account) {
      return res.send({ Status: "User not found" });
    }

    // Tạo token
    const token = jwt.sign({ id: account._id }, "jwt_secret_key", {
      expiresIn: "1d",
    });

    // Cấu hình transporter để gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail", // Sửa lại thành dịch vụ mà bạn đang sử dụng
      auth: {
        user: "datnthe160420@fpt.edu.vn", // Tài khoản email của bạn
        pass: "dolk ntdq qlrf nepa", // Mật khẩu ứng dụng hoặc mật khẩu tài khoản
      },
    });

    // Cấu hình nội dung email
    const mailOptions = {
      from: "datnthe160420@fpt.edu.vn",
      to: email,
      subject: "Reset your password link",
      text: `Please click the link to reset your password: http://localhost:3000/reset-password/${account._id}/${token}`,
    };

    // Gửi email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.send({ Status: "Error sending email" });
      } else {
        return res.send({ Status: "Success" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.send({ Status: "Error", Error: error.message });
  }
};
accountRouter.post("/forgot-password", forgetPass);

const resetPassword = async (req, res) => {
  const { id, token } = req.params;

  if (!id || !token) {
    return res.status(400).json({ Status: "ID hoặc token không hợp lệ" });
  }

  try {
    const account = await Account.findById(id);
    if (!account) {
      return res.status(404).json({ Status: "User not found" });
    }

    // Giải mã token
    const decoded = jwt.verify(token, "jwt_secret_key"); // Đảm bảo secret key đúng
    if (decoded.id !== id) {
      return res.status(400).json({ Status: "Invalid token" });
    }

    // Nếu tới đây thì token hợp lệ
    const { password } = req.body; // Lấy password từ body
    const hashedPassword = await bcrypt.hash(password, 10);
    await Account.findByIdAndUpdate(id, { password: hashedPassword });

    return res.json({ Status: "Success" });
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({ Status: "Invalid token" });
    }
    return res.status(500).json({ Status: "Error", Error: error.message });
  }
};
accountRouter.post("/reset-password/:id/:token", resetPassword);

module.exports = accountRouter;

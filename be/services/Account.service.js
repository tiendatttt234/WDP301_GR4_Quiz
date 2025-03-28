const AccountRepository = require("../repositories/Account.repository");
const createError = require("http-errors");
const {
  signAccessToken,
  signRefreshToken,
} = require("../middlewares/jwt_helper");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const JWT_SECRET = "jwt_secret_key";
const bcrypt = require("bcrypt");
async function registerService(email, password, userName) {
  try {
    const existingAccount = await AccountRepository.getAccountByUserName(email);
    if (existingAccount) {
      throw createError.Conflict("Email của bạn đã tồn tại");
    }

    const hashPass = await AccountRepository.hashPassword(password);
    const roles = await AccountRepository.getUserRole();

    const savedAccount = await AccountRepository.createAccount(
      email,
      userName,
      hashPass,
      roles
    );
    const accessToken = await signAccessToken(savedAccount._id);

    return { accessToken, user: savedAccount };
  } catch (error) {
    throw error;
  }
}

async function loginService(email, password) {
  try {
    const account = await AccountRepository.getAccountByEmail(email);
    if (!account) {
      throw createError.NotFound("Tài khoản không tồn tại");
    }
    if (account.isLocked) {
      throw createError.Forbidden(
        "Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ."
      );
    }
    const isMatch = await AccountRepository.validatePassword(
      password,
      account.password
    );
    if (!isMatch) {
      throw createError.Unauthorized("Email hoặc mật khẩu không đúng");
    }

    if (!account.roles || account.roles.length === 0) {
      throw createError.Forbidden("Tài khoản này chưa được gán vai trò");
    }

    const accessToken = await signAccessToken(account._id);
    const refreshToken = await signRefreshToken(account._id);

    return {
      avatar: account.avatar,
      accessToken,
      refreshToken,
      id: account._id,
      userName: account.userName,
      roles: account.roles,
    };
  } catch (error) {
    throw error;
  }
}

//[GET]profile
async function getAccountService(id) {
  try {
    const account = await AccountRepository.getAccountById(id);
    if (!account) {
      throw createError.NotFound("Người dùng không tồn tại");
    }
    return account;
  } catch (error) {
    throw error;
  }
}

//[update]profile
async function updateAccountService(id, updateFields) {
  try {
    const allowedFields = ["email", "phone", "userName", "avatar"];
    const keys = Object.keys(updateFields);
    const isValid = keys.every((field) => allowedFields.includes(field));
    if (!isValid) {
      throw createError.BadRequest("Invalid field name");
    }

    // Kiểm tra các trường nếu có trong updateFields
    if (updateFields.userName && updateFields.userName.length > 100) {
      throw createError.BadRequest("Username must be less than 100 characters");
    }

    if (updateFields.email) {
      const emailRegex =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!emailRegex.test(updateFields.email)) {
        throw createError.BadRequest("Please provide a valid email");
      }
    }

    if (updateFields.phone) {
      const phoneRegex = /^[0]\d{9}$/;
      if (!phoneRegex.test(updateFields.phone)) {
        throw createError.BadRequest(
          "Phone number must be exactly 10 digits and start with 0"
        );
      }
    }

    const updatedAccount = await AccountRepository.updateAccountById(
      id,
      updateFields
    );
    if (!updatedAccount) {
      throw createError.NotFound(`User ${id} not found`);
    }

    return updatedAccount;
  } catch (error) {
    throw error;
  }
}
async function changePasswordService(id, oldPassword, newPassword) {
  if (!id || !oldPassword || !newPassword) {
    throw new Error("Vui lòng điền đầy đủ thông tin");
  }

  const updatedUser = await AccountRepository.changePassword(
    id,
    oldPassword,
    newPassword
  );
  return updatedUser;
}
// Hàm tạo token
const generateResetToken = (id) => {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: "1d" });
};

// Hàm gửi email
const sendResetEmail = async (email, accountId, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "datnthe160420@fpt.edu.vn",
      pass: "dolk ntdq qlrf nepa", // Dùng mật khẩu ứng dụng
    },
  });

  const mailOptions = {
    from: "datnthe160420@fpt.edu.vn",
    to: email,
    subject: "Reset your password link",
    text: `Please click the link to reset your password: http://localhost:3000/reset-password/${accountId}/${token}`,
  };

  return transporter.sendMail(mailOptions);
};

// Xử lý quên mật khẩu
const requestPasswordReset = async (email) => {
  const account = await AccountRepository.findByEmail(email);
  if (!account) {
    return { status: "error", message: "Email không tồn tại trong hệ thống" };
  }

  const token = generateResetToken(account._id);
  await sendResetEmail(email, account._id, token);
  return {
    status: "success",
    message: "Email đặt lại mật khẩu đã được gửi thành công",
  };
};

// Xử lý đặt lại mật khẩu
const resetPassword = async (id, token, newPassword) => {
  try {
    const account = await AccountRepository.findById(id);
    if (!account) {
      return { status: "error", message: "Người dùng không tồn tại" };
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (decoded.id !== id) {
        return { status: "error", message: "Token không hợp lệ" };
      }
    } catch (jwtError) {
      return { status: "error", message: "Token đã hết hạn hoặc không hợp lệ" };
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await AccountRepository.updatePassword(id, hashedPassword);

    return {
      status: "success",
      message: "Mật khẩu đã được đặt lại thành công",
    };
  } catch (error) {
    return {
      status: "error",
      message: "Đã xảy ra lỗi khi đặt lại mật khẩu",
    };
  }
};

module.exports = {
  registerService,
  loginService,
  getAccountService,
  updateAccountService,
  changePasswordService,
  requestPasswordReset,
  resetPassword,
};

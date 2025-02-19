const AccountRepository = require("../repositories/Account.repository");
const createError = require("http-errors");
const {
  signAccessToken,
  signRefreshToken,
} = require("../middlewares/jwt_helper");
const { updateAccountField } = require("../repositories/Account.repository");

async function registerService(email, password, userName) {
  try {
    const existingAccount = await AccountRepository.getAccountByUserName(
      userName
    );
    if (existingAccount) {
      throw createError.Conflict("User already exists");
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
async function getAccountService(userName) {
  try {
    const account = await AccountRepository.getAccountByUserName(userName);
    if (!account) {
      throw createError.NotFound("Người dùng không tồn tại");
    }
    return account;
  } catch (error) {
    throw error;
  }
}
//[update]profile
async function updateAccountService(userName, updateFields) {
  try {
    const allowedFields = ["email", "phone", "userName"];

    // Kiểm tra xem các field gửi lên có hợp lệ không
    const keys = Object.keys(updateFields);
    const isValid = keys.every((field) => allowedFields.includes(field));
    if (!isValid) {
      throw createError.BadRequest("Invalid field name");
    }

    const updatedAccount = await updateAccountField(userName, updateFields);
    if (!updatedAccount) {
      throw createError.NotFound(`User ${userName} not found`);
    }

    return updatedAccount;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  registerService,
  loginService,
  getAccountService,
  updateAccountService,
};

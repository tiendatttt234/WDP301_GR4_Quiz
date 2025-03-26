const Account = require("../models/Account");
const Role = require("../models/Role");
const bcrypt = require("bcrypt");
const createError = require("http-errors");

async function getAccountById(id) {
  try {
    return await Account.findById(id).populate("roles").exec();
  } catch (error) {
    throw error;
  }
}
async function getAccountByUserName(userName) {
  try {
    return await Account.findOne({ userName }).populate("roles").exec();
  } catch (error) {
    throw error;
  }
}
async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, parseInt(process.env.PASSWORD_SECRET));
  } catch (error) {
    throw error;
  }
}

async function getUserRole() {
  try {
    const userRole = await Role.findOne({ name: "user" });
    return userRole ? [userRole._id] : [];
  } catch (error) {
    throw error;
  }
}

async function createAccount(email, userName, password, roles) {
  try {
    const newAccount = new Account({ email, userName, password, roles });
    return await newAccount.save();
  } catch (error) {
    throw error;
  }
}

async function getAccountByEmail(email) {
  try {
    const account = await Account.findOne({ email }).populate("roles").exec();
    if (!account) {
      throw createError.NotFound("Người dùng không tồn tại");
    }
    return account;
  } catch (error) {
    throw error;
  }
}

async function validatePassword(inputPassword, accountPassword) {
  try {
    return await bcrypt.compare(inputPassword, accountPassword);
  } catch (error) {
    throw error;
  }
}

async function updateAccountById(id, updateFields) {
  try {
    return await Account.findByIdAndUpdate(id, updateFields, { new: true });
  } catch (error) {
    throw error;
  }
}

async function changePassword(id, oldPassword, newPassword) {
  try {
    const user = await Account.findById(id);
    if (!user) {
      throw new Error("Người dùng không tồn tại");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Mật khẩu hiện tại không đúng");
    }

    const saltRounds = parseInt(process.env.PASSWORD_SECRET) || 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    const updatedUser = await Account.findByIdAndUpdate(
      id,
      { $set: { password: hashedPassword } },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new Error("Cập nhật mật khẩu thất bại");
    }

    return updatedUser;
  } catch (error) {
    throw error;
  }
}
async function getAccountById(id) {
  try {
    return await Account.findById(id).populate("roles").exec();
  } catch (error) {
    throw error;
  }
}
async function getAllAccounts() {
  try {
    return await Account.find()
      .populate({
        path: "roles",
        match: { name: { $ne: "admin" } },
      })
      .then((accounts) => {
        return accounts.filter((account) => account.roles.length > 0);
      });
  } catch (error) {
    throw error;
  }
}
const findByEmail = async (email) => {
  return await Account.findOne({ email }).exec();
};

const findById = async (id) => {
  return await Account.findById(id);
};

const updatePassword = async (id, hashedPassword) => {
  return await Account.findByIdAndUpdate(id, { password: hashedPassword });
};

//update prime cho user va thoi gian het han
async function updatePrimeStatus(accountId, isPrime, primeExpiresAt) {
  return await Account.findByIdAndUpdate(
    accountId,
    { isPrime, primeExpiresAt },
    { new: true }
  );
}
const updateAvatar = async (id, avatarPath) => {
  try {
    return await Account.findByIdAndUpdate(
      id,
      { avatar: avatarPath },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};
module.exports = {
  getAccountById,
  getAccountByUserName,
  hashPassword,
  getUserRole,
  createAccount,
  getAccountByEmail,
  validatePassword,
  updateAccountById,
  changePassword,
  getAllAccounts,
  getAccountById,
  findByEmail,
  findById,
  updatePassword,
  updatePrimeStatus,
  updateAvatar,
};

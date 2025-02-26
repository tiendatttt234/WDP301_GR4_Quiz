const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const AccountRepository = require("../repositories/Account.repository");


function signAccessToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = { user: { id: userId } };
    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1h",
      issuer: "localhost:9999",
      audience: userId.toString(),
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

function verifyAccessToken(req, res, next) {
  if (!req.headers["authorization"]) return next(createError.Unauthorized());

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
}

function signRefreshToken(userId) {
  return new Promise((resolve, reject) => {
    const payload = { user: { id: userId } };
    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
      issuer: "localhost:9999",
      audience: userId.toString(),
    };
    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createError.InternalServerError());
      }
      resolve(token);
    });
  });
}

function verifyRefreshToken(refreshToken) {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return reject(createError.Unauthorized());
        const userId = payload.user.id;
        return resolve(userId);
      }
    );
  });
}
async function isAdmin(req, res, next) {
  try {
      const account = await AccountRepository.getAccountById(req.payload.user.id);
      if (!account) return res.status(404).json({ message: "Tài khoản không tồn tại" });
      
      const isAdmin = account.roles.some(role => role.name === "admin");
      if (!isAdmin) return res.status(403).json({ message: "Forbidden: Không có quyền truy cập" });
      
      next();
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
}
module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  isAdmin
};

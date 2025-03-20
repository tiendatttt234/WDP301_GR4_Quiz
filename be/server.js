const http = require("http");
const express = require("express");
const { json } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Db = require("./dbConnect/dbConnect");
const { quizRouter, questionBankRouter, exportRouter,notificationRouter, reportRouter,transactionRouter,premiumRouter } = require("./routes");

const accountRouter = require("./routes/account.router");
const adminRouter = require("./routes/admin.routes");

const app = express();

// Middleware
app.use(morgan("dev"));
app.use(json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: true }));

// Khởi tạo HTTP server
const server = http.createServer(app);

// Khởi tạo socket.io
const { Server } = require("socket.io");
const favoriteRouter = require("./routes/favorite.route");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Lưu socket.io vào biến global
global.io = io;

// Lưu danh sách người dùng kết nối vào global
global.onlineUsers = new Map();

// Xử lý sự kiện khi có client kết nối
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Nhận thông tin userId từ client và lưu lại
  socket.on("registerUser", (userId) => {
    if (userId) {
      global.onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online with socket ID: ${socket.id}`);
    }
  });

  // Xử lý khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const [userId, socketId] of global.onlineUsers.entries()) {
      if (socketId === socket.id) {
        global.onlineUsers.delete(userId);
        break;
      }
    }
  });
});

// Định nghĩa các route
app.use("/quiz", quizRouter);
app.use("/questionFile", questionBankRouter);
app.use("/test", exportRouter);
app.use("/auth", accountRouter);
app.use("/admin", adminRouter);
app.use("/notifycation", notificationRouter);
app.use('/favorite', favoriteRouter)
app.use("/api/reports", reportRouter);
app.use("/package", premiumRouter);
app.use("/transaction", transactionRouter);


// Middleware xử lý lỗi
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

// Khởi động server
server.listen(process.env.PORT, process.env.HOST_NAME, async () => {
  console.log(`Server running at http://${process.env.HOST_NAME}:${process.env.PORT}`);
  await Db.connectDB();
});
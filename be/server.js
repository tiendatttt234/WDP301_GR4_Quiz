// Import các module cần thiết
const http = require("http");
const express = require("express");
const { json } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
require("dotenv").config();
const Db = require("./dbConnect/dbConnect");
const { quizRouter, questionBankRouter, exportRouter,notificationRouter } = require("./routes");
const accountRouter = require("./routes/account.router");
const adminRouter = require("./routes/admin.routes");
const NotificationService = require("./services/notification.service");
const QuizRouter = require("./routes/quiz.route");

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
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Cấu hình CORS cho frontend
    methods: ["GET", "POST"],
  },
});

// Lưu socket.io vào biến global để sử dụng trong service
global.io = io;

// Lưu danh sách người dùng kết nối
const onlineUsers = new Map();

// Xử lý sự kiện khi có client kết nối
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Nhận thông tin userId từ client và lưu lại
  socket.on("registerUser", (userId) => {
    if (userId) {
      onlineUsers.set(userId, socket.id);
      console.log(`User ${userId} is online with socket ID: ${socket.id}`);
    }
  });

  // Lắng nghe sự kiện admin gửi thông báo
  socket.on("adminNotify", async ({ recipientId, message }) => {
    try {
      // Lưu thông báo vào database
      const notification = await NotificationService.sendNotification(
        recipientId,
        "Warning",
        message
      );

      // Kiểm tra người dùng có đang online không
      if (onlineUsers.has(recipientId)) {
        const recipientSocketId = onlineUsers.get(recipientId);
        io.to(recipientSocketId).emit("newNotification", notification);
        console.log(`Notification sent to user ${recipientId}`);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  });

  // Xử lý khi client ngắt kết nối
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    // Xóa user khỏi danh sách online
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
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

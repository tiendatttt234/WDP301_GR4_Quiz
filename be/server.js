//Cấu hình các module cần thiết
const httpError = require("http-errors");
const express = require("express");
const { json } = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const Db = require("./dbConnect/dbConnect");
const { questionBankRouter } = require("./routes");
require("dotenv").config();

//Import các Routes
// const {

//   } = require("./routes");

const app = express();
app.use(morgan("dev"));
app.use(json());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.urlencoded({ extended: true }));

//Cấu hình các Routes example
// app.use("/quiz", QuizRouter);
// app.use("/quizSubmit", QuizSubmitRouter);
// app.use("/account", AccountRouter);
app.use("/questionFile", questionBankRouter);
// app.use("/quizSubmit", QuizSubmitRouter);
// app.use("/blog", BlogRouter);

//Kiểm soát lỗi xảy ra trên controller, router và model
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(process.env.PORT, process.env.HOST_NAME, async () => {
  console.log(
    `Server starting at http://${process.env.HOST_NAME}:${process.env.PORT}`
  );
  await Db.connectDB();
});

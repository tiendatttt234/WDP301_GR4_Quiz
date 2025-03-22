const mongoose = require('mongoose');
const {
    Account,
    Blog,
    Notification,
    QuestionFile,
    Report,
    Quiz,
    QuizResult,
    Role,
    Favorite,
    StudySession,
    Transaction,
    Premium
} = require("../models");

//khai bao doi tuong CSDL
const Db = {};
Db.Account = Account;
Db.Blog = Blog;
Db.Notification = Notification;
Db.QuestionFile = QuestionFile;
Db.Report = Report;
Db.Quiz = Quiz;
Db.QuizResult = QuizResult;
Db.Role = Role;
Db.Favorite = Favorite;
Db.StudySession = StudySession;
Db.Transaction = Transaction;
Db.Premium = Premium;
Db.connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
            .then(() => console.log("connect to mongodb success"))
    } catch (error) {
        next(error);
        process.exit();
    }
}

module.exports = Db;
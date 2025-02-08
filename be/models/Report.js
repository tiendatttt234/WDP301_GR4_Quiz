const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
    reportBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: true
    },
    questionFile:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionFile",
        required: true
    },
    reason:{
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        required: true
    }
},{
    timestamps: true
})

const Report = mongoose.model("Report", ReportSchema);
module.exports = Report;
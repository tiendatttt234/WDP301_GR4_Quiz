const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipent: {
        type: mongoose.Schema.ObjectId,
        ref: "Account",
        required: true
    },
    type: {
        type: String,
        enum: ['General', 'Warning', 'Alert'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const Notification = mongoose.model("Notification", NotificationSchema);
module.exports = Notification;
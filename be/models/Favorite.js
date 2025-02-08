const mongoose = require('mongoose');

const FavoriteSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.ObjectId,
        ref: "Account",
        required: true
    },
    sharedQuestionFile: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "QuestionFile"
        }
    ]
},{
    timestamps: true
})

const Favorite = mongoose.model("Favorite", FavoriteSchema);
module.exports = Favorite;
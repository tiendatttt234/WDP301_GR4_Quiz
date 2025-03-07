const mongoose = require('mongoose');


const QuestionSchema = new mongoose.Schema({
    content: {
        type: String,
        required: [true, "Question content is required"],
        trim: true  
    },
    type: {
        type: String,
        enum: ['MCQ', 'MAQ', 'Boolean'],  
        required: [true, "Question type is required"]
    },
    answers: [{
        answerContent: {
            type: String,
            trim: true,  
            required: [true, "Answer content is required"]
        },
        isCorrect: { 
            type: Boolean,
            required: true
        }
    }]
});


QuestionSchema.pre('validate', function (next) {
    if (this.type === 'Boolean' && this.answers.length !== 2) {
        next(new Error('Boolean questions must have at least 2 answers.'));
    } else {
        next();
    }
});


const QuestionFileSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name of question bank is required"],
        trim: true  
    },
    arrayQuestion: [QuestionSchema],
    description: {
        type: String,
        trim: true  
    },  
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: [false, "Creator of question bank is required"]
    },
    reportedCount:{
        type: Number,
        default: 0
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    isReported: {
        type: Boolean,
        default: false
    },
    isLocked: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true  
});


const QuestionFile = mongoose.model("QuestionFile", QuestionFileSchema);

module.exports = QuestionFile;

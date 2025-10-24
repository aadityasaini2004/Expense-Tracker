const mongoose = require('mongoose');

const transactionSchema =  new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    title: {
        type: String,
        required: true,
        maxLength: [50, "Please write in 50 words."]
    },

    amount: {
        type: Number,
        requried: true,
        maxLength: 20,
    },

    expenseType: {
        type: String,// income or expense.
        requried: true,
    },

    date: {
        type: Date,
        required: true,
    },

    category: {
        type: String,
        required: true,
        trim: true,
    },
    
    description: {
        type: String,
        required: false,
        maxLength: [100, "Please write description in 100 words."],
        
    }
}, {timestamps: true})

module.exports = mongoose.model("Transaction", transactionSchema)
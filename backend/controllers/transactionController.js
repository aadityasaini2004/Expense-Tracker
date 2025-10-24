// backend/controllers/transactionController.js
const Transaction = require('../models/transactionModel.js');
const { getAuth } = require("@clerk/clerk-sdk-node")

// @desc    Get all transactions
// @route   GET /api/transactions
exports.getTransactions = async (req, res) => {
    try {
        
        const { userId } = req.auth;
        if(!userId) {
            return res.status(401).json({error: "user not authorized."})
        }
        const transactions = await Transaction.find({ userId: userId }).sort({ date: -1 });
        return res.status(200).json(transactions);
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Add a transaction
// @route   POST /api/transactions
exports.addTransaction = async (req, res) => {
    try {

        const {userId} = req.auth;
        if(!userId) {
            return res.status(401).json({error: "User not authorized"})
        }

        const { title, amount, type, date, category } = req.body;
        const newTransaction = new Transaction({
            userId,
            title,
            amount,
            type,
            date,
            category,
        });

        await newTransaction.save();
        return res.status(201).json(newTransaction);
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
};

// @desc    Delete a transaction
// @route   DELETE /api/transactions/:id
exports.deleteTransaction = async (req, res) => {
    try {

        const { userId } = req.auth;
        if(!userId) {
            return res.status(401).json({error: "User not authorized."})
        }

        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({ error: 'No transaction found' });
        }

        if(transaction.userId !== userId) {
            return res.status(403).json({error: "User not authorized to delete this transaction"})
        }

        await transaction.deleteOne();
        return res.status(200).json({ message: 'Transaction deleted' });
    } catch (error) {
        return res.status(500).json({ error: 'Server Error' });
    }
};

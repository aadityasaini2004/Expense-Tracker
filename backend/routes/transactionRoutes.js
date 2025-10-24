const express = require('express');
const router = express.Router();
const {getTransactions, addTransaction, deleteTransaction } = require('../controllers/transactionController.js');
const { ClerkExpressRequireAuth } = require("@clerk/clerk-sdk-node")

router.use(ClerkExpressRequireAuth());


router.route('/').get(getTransactions).post(addTransaction);

router.route('/:id').delete(deleteTransaction);

module.exports = router;
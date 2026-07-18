const express = require('express');
const mongoose = require('mongoose');
const Settlement = require('../models/settlement');
const Expance = require('../models/expance');
const authMiddler = require('../middleware/authMiddleware');

const router = express.Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const STATUSES = ['scanned', 'processing', 'cleared', 'deposited'];

const formatTransactionId = (expenseId) =>
  `TXN-${String(expenseId).slice(-6).toUpperCase()}-${Date.now().toString().slice(-6)}`;

const createMockSettlement = (expense, index) => {
  const amount = Number(expense.amount || 0);
  const fee = Number((amount * 0.005).toFixed(2));
  const netAmount = Number((amount - fee).toFixed(2));
  const createdAt = expense.date ? new Date(expense.date) : new Date();
  const status = STATUSES[Math.min(index, STATUSES.length - 1)];
  const settledAt = status === 'deposited' ? new Date(createdAt.getTime() + 2 * 60 * 60 * 1000) : null;

  return {
    id: `mock-${expense._id}`,
    amount,
    fee,
    netAmount,
    status,
    createdAt,
    settledAt,
    transactionId: formatTransactionId(expense._id),
    expenseId: expense._id,
  };
};

const toResponseRecord = (record) => ({
  id: record._id || record.id,
  amount: record.amount,
  fee: record.fee,
  netAmount: record.netAmount,
  status: record.status,
  createdAt: record.createdAt,
  settledAt: record.settledAt,
  transactionId: record.transactionId,
  expenseId: record.expenseId,
});

router.use(express.json());
router.use(authMiddler);

router.get('/', async (req, res) => {
  try {
    const settlements = await Settlement.find({ userId: req.user.userId }).sort({ createdAt: -1 }).lean();

    if (settlements.length > 0) {
      return res.status(200).json(settlements.map(toResponseRecord));
    }

    const recentExpenses = await Expance.find({ userId: req.user.userId }).sort({ date: -1 }).limit(4).lean();
    const mockRecords = recentExpenses.map(createMockSettlement);
    return res.status(200).json(mockRecords);
  } catch (error) {
    console.error('Error fetching settlements:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { expenseId } = req.body;

    if (!expenseId || !isValidObjectId(expenseId)) {
      return res.status(400).json({ msg: 'Valid expenseId is required' });
    }

    const expense = await Expance.findOne({ _id: expenseId, userId: req.user.userId });
    if (!expense) {
      return res.status(404).json({ msg: 'Expense not found' });
    }

    const amount = Number(expense.amount || 0);
    const fee = Number((amount * 0.005).toFixed(2));
    const netAmount = Number((amount - fee).toFixed(2));

    const settlement = await Settlement.create({
      amount,
      fee,
      netAmount,
      status: 'scanned',
      createdAt: new Date(),
      settledAt: null,
      transactionId: formatTransactionId(expense._id),
      expenseId: expense._id,
      userId: req.user.userId,
    });

    return res.status(201).json({
      msg: 'Settlement created successfully',
      settlement: toResponseRecord(settlement),
    });
  } catch (error) {
    console.error('Error creating settlement:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

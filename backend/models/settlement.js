const mongoose = require('mongoose');

const settlementSchema = new mongoose.Schema(
  {
    amount: { type: Number, required: true },
    fee: { type: Number, required: true },
    netAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['scanned', 'processing', 'cleared', 'deposited'],
      default: 'scanned',
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    settledAt: { type: Date, default: null },
    transactionId: { type: String, required: true },
    expenseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Expense', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { versionKey: false }
);

const Settlement = mongoose.model('Settlement', settlementSchema);
module.exports = Settlement;

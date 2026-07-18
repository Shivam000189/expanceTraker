const mongoose = require('mongoose');

const bankSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    balance: { type: Number, required: true, default: 0 },
});

const Bank = mongoose.model('Bank', bankSchema);
module.exports = Bank;



const express = require('express');
const router = express.Router();
const zod = require('zod');
const mongoose = require('mongoose');
const Bank = require('../models/bank');
const User = require('../models/auth');
const protect = require('../middleware/authMiddleware');

const getUserId = (req) => req.user?.userId || req.user?._id;

const normalizeObjectId = (value) => {
    if (!value) return null;
    return mongoose.Types.ObjectId.isValid(value) ? new mongoose.Types.ObjectId(value) : value;
};

router.get('/balance', protect, async (req, res) => {
    try {
        const userId = normalizeObjectId(getUserId(req));

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        let bank = await Bank.findOne({ userId });

        if (!bank) {
            bank = await Bank.create({ userId, balance: 0 });
        }

        res.status(200).json({ balance: bank.balance });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/transfer', protect, async (req, res) => {
    const transferSchema = zod.object({
        recipientId: zod.string().trim().email('Invalid email address'),
        amount: zod.coerce.number().positive('Amount must be a positive number'),
    });

    try {
        const { recipientId, amount } = transferSchema.parse(req.body);
        const senderId = normalizeObjectId(getUserId(req));

        if (!senderId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const recipientUser = await User.findOne({ email: recipientId.toLowerCase() });
        if (!recipientUser) {
            return res.status(404).json({ message: 'Recipient account not found' });
        }

        const recipientBank = await Bank.findOne({ userId: recipientUser._id });
        let senderBank = await Bank.findOne({ userId: senderId });

        if (!senderBank) {
            senderBank = await Bank.create({ userId: senderId, balance: 0 });
        }

        if (String(senderId) === String(recipientUser._id)) {
            return res.status(400).json({ message: 'You cannot transfer to your own account' });
        }

        if (!recipientBank) {
            const createdRecipientBank = await Bank.create({ userId: recipientUser._id, balance: 0 });
            recipientBank = createdRecipientBank;
        }

        if (senderBank.balance < amount) {
            return res.status(400).json({ message: 'Insufficient balance' });
        }

        senderBank.balance -= amount;
        recipientBank.balance += amount;

        await senderBank.save();
        await recipientBank.save();
        res.status(200).json({ message: 'Transfer successful' });
    } catch (err) {
        if (err instanceof zod.ZodError) {
            return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
        }
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/add-balance', protect, async (req, res) => {
    const addBalanceSchema = zod.object({
        amount: zod.coerce.number().positive('Amount must be a positive number'),
    });

    try {
        const { amount } = addBalanceSchema.parse(req.body);
        const userId = normalizeObjectId(getUserId(req));

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        let bank = await Bank.findOne({ userId });

        if (!bank) {
            bank = await Bank.create({ userId, balance: 0 });
        }

        bank.balance += amount;
        await bank.save();

        res.status(200).json({ message: 'Balance added successfully', balance: bank.balance });
    } catch (err) {
        if (err instanceof zod.ZodError) {
            return res.status(400).json({ message: err.errors.map((e) => e.message).join(', ') });
        }
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
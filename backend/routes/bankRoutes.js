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

router.get('/recipients', protect, async (req, res) => {
    try {
        const userId = normalizeObjectId(getUserId(req));

        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const recipients = await User.find({ _id: { $ne: userId } })
            .select('name email')
            .sort({ name: 1 })
            .lean();

        res.status(200).json({ recipients });
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

    let session = null;

    try {
        const { recipientId, amount } = transferSchema.parse(req.body);
        const senderId = normalizeObjectId(getUserId(req));

        if (!senderId) {
            return res.status(401).json({ message: 'User not authenticated', msg: 'User not authenticated' });
        }

        const recipientUser = await User.findOne({ email: recipientId.toLowerCase() });
        if (!recipientUser) {
            return res.status(404).json({ message: 'Recipient account not found', msg: 'Recipient account not found' });
        }

        if (String(senderId) === String(recipientUser._id)) {
            return res.status(400).json({
                message: 'You cannot transfer to your own account',
                msg: 'You cannot transfer to your own account'
            });
        }

        // Ensure both bank accounts exist prior to transaction/transfer
        await Bank.findOneAndUpdate(
            { userId: senderId },
            { $setOnInsert: { balance: 0 } },
            { upsert: true }
        );
        await Bank.findOneAndUpdate(
            { userId: recipientUser._id },
            { $setOnInsert: { balance: 0 } },
            { upsert: true }
        );

        let transferSuccessful = false;
        let finalSenderBalance = null;

        // Try MongoDB multi-document replica set transaction first
        try {
            session = await mongoose.startSession();
            session.startTransaction();

            const senderBankInTx = await Bank.findOne({ userId: senderId }).session(session);
            if (!senderBankInTx || senderBankInTx.balance < amount) {
                await session.abortTransaction();
                await session.endSession();
                session = null;
                return res.status(400).json({ message: 'Insufficient balance', msg: 'Insufficient balance' });
            }

            const updatedSender = await Bank.findOneAndUpdate(
                { userId: senderId, balance: { $gte: amount } },
                { $inc: { balance: -amount } },
                { new: true, session }
            );

            if (!updatedSender) {
                await session.abortTransaction();
                await session.endSession();
                session = null;
                return res.status(400).json({ message: 'Insufficient balance', msg: 'Insufficient balance' });
            }

            await Bank.findOneAndUpdate(
                { userId: recipientUser._id },
                { $inc: { balance: amount } },
                { session }
            );

            await session.commitTransaction();
            await session.endSession();
            session = null;

            transferSuccessful = true;
            finalSenderBalance = updatedSender.balance;
        } catch (txErr) {
            if (session) {
                try {
                    await session.abortTransaction();
                    await session.endSession();
                } catch (abortErr) {
                    // Ignore abort errors
                }
                session = null;
            }

            // If error was not due to unsupported transactions (e.g. standalone Mongo), rethrow
            const isUnsupportedTx = /transaction numbers are only allowed|replica set/i.test(txErr.message);
            if (!isUnsupportedTx) {
                throw txErr;
            }
        }

        // Fallback for standalone MongoDB instances without replica set
        if (!transferSuccessful) {
            const updatedSender = await Bank.findOneAndUpdate(
                { userId: senderId, balance: { $gte: amount } },
                { $inc: { balance: -amount } },
                { new: true }
            );

            if (!updatedSender) {
                return res.status(400).json({ message: 'Insufficient balance', msg: 'Insufficient balance' });
            }

            try {
                await Bank.findOneAndUpdate(
                    { userId: recipientUser._id },
                    { $inc: { balance: amount } },
                    { upsert: true }
                );
                finalSenderBalance = updatedSender.balance;
            } catch (creditErr) {
                // Compensating rollback on debit failure
                await Bank.findOneAndUpdate(
                    { userId: senderId },
                    { $inc: { balance: amount } }
                );
                throw creditErr;
            }
        }

        return res.status(200).json({
            message: 'Transfer successful',
            msg: 'Transfer successful',
            balance: finalSenderBalance
        });
    } catch (err) {
        if (session) {
            try {
                await session.endSession();
            } catch (sErr) {}
        }

        if (err instanceof zod.ZodError) {
            return res.status(400).json({
                message: err.errors.map((e) => e.message).join(', '),
                msg: err.errors.map((e) => e.message).join(', ')
            });
        }
        console.error('Transfer error:', err);
        return res.status(500).json({ message: 'Server error', msg: 'Server error' });
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
            return res.status(401).json({ message: 'User not authenticated', msg: 'User not authenticated' });
        }

        const updatedBank = await Bank.findOneAndUpdate(
            { userId },
            { $inc: { balance: amount } },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            message: 'Balance added successfully',
            msg: 'Balance added successfully',
            balance: updatedBank.balance
        });
    } catch (err) {
        if (err instanceof zod.ZodError) {
            return res.status(400).json({
                message: err.errors.map((e) => e.message).join(', '),
                msg: err.errors.map((e) => e.message).join(', ')
            });
        }
        console.error('Add balance error:', err);
        return res.status(500).json({ message: 'Server error', msg: 'Server error' });
    }
});

module.exports = router;
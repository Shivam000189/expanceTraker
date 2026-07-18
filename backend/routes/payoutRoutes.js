const express = require('express');
const authMiddler = require('../middleware/authMiddleware');
const Expance = require('../models/expance');

const router = express.Router();

const IFSC_REGEX = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const normalizeRows = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.rows)) {
    return payload.rows;
  }

  return [];
};

const validateRow = (row) => {
  const errors = [];
  const vendorName = typeof row?.vendorName === 'string' ? row.vendorName.trim() : '';
  const accountNumber = String(row?.accountNumber || '').trim();
  const ifscCode = String(row?.ifscCode || '').trim().toUpperCase();
  const amount = Number(row?.amount);

  if (!vendorName) {
    errors.push('vendorName must be a non-empty string');
  }

  if (!/^\d{10}$/.test(accountNumber)) {
    errors.push('accountNumber must be exactly 10 digits');
  }

  if (!IFSC_REGEX.test(ifscCode)) {
    errors.push('ifscCode must match the bank IFSC format');
  }

  if (!Number.isFinite(amount) || amount <= 0) {
    errors.push('amount must be a positive number');
  }

  return {
    vendorName,
    accountNumber,
    ifscCode,
    amount,
    errors,
  };
};

router.use(express.json());
router.use(authMiddler);

router.post('/validate', async (req, res) => {
  try {
    const rows = normalizeRows(req.body);

    if (!rows.length) {
      return res.status(400).json({ msg: 'Payout rows array is required' });
    }

    const valid = [];
    const invalid = [];

    rows.forEach((row, index) => {
      const result = validateRow(row);
      const sanitizedRow = {
        vendorName: result.vendorName,
        accountNumber: result.accountNumber,
        ifscCode: result.ifscCode,
        amount: Number.isFinite(result.amount) ? result.amount : row?.amount,
      };

      if (result.errors.length > 0) {
        invalid.push({
          row: { ...sanitizedRow, rowNumber: index + 1 },
          errors: result.errors,
        });
        return;
      }

      valid.push({ ...sanitizedRow, rowNumber: index + 1 });
    });

    return res.status(200).json({ valid, invalid });
  } catch (error) {
    console.error('Error validating payouts:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/execute', async (req, res) => {
  try {
    const rows = normalizeRows(req.body);

    if (!rows.length) {
      return res.status(400).json({ msg: 'Validated payout rows are required' });
    }

    const preparedRows = rows.map((row) => {
      const result = validateRow(row);
      return {
        ...row,
        vendorName: result.vendorName,
        accountNumber: result.accountNumber,
        ifscCode: result.ifscCode,
        amount: result.amount,
        errors: result.errors,
      };
    });

    const invalidRows = preparedRows.filter((row) => row.errors.length > 0);
    if (invalidRows.length > 0) {
      return res.status(400).json({
        msg: 'Some payout rows are invalid',
        invalid: invalidRows.map((row) => ({
          row: {
            vendorName: row.vendorName,
            accountNumber: row.accountNumber,
            ifscCode: row.ifscCode,
            amount: row.amount,
            rowNumber: row.rowNumber,
          },
          errors: row.errors,
        })),
      });
    }

    const expensesToCreate = preparedRows.map((row) => ({
      title: `Vendor Payment - ${row.vendorName}`,
      amount: row.amount,
      category: 'Vendor Payment',
      date: new Date(),
      userId: req.user.userId,
    }));

    await Expance.insertMany(expensesToCreate);

    const total = preparedRows.reduce((sum, row) => sum + row.amount, 0);

    return res.status(200).json({
      success: preparedRows.length,
      total,
    });
  } catch (error) {
    console.error('Error executing payouts:', error);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;

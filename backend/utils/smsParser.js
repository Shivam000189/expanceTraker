// backend/utils/smsParser.js

const DEFAULT_CATEGORY = 'Other';

const normalizeDate = (value) => {
    if (!value) return new Date().toISOString().slice(0, 10);

    const parsedDate = new Date(value);
    if (!Number.isNaN(parsedDate.getTime())) {
        return parsedDate.toISOString().slice(0, 10);
    }

    const dateMatch = String(value).match(/(\d{1,2})\s+([a-zA-Z]{3,9})/);
    if (!dateMatch) return new Date().toISOString().slice(0, 10);

    const currentYear = new Date().getFullYear();
    const dateWithYear = new Date(`${dateMatch[1]} ${dateMatch[2]} ${currentYear}`);
    return Number.isNaN(dateWithYear.getTime())
        ? new Date().toISOString().slice(0, 10)
        : dateWithYear.toISOString().slice(0, 10);
};

const inferCategory = (smsText, merchant = '') => {
    const text = `${smsText} ${merchant}`.toLowerCase();
    const categoryMap = [
        { category: 'Food', keywords: ['swiggy', 'zomato', 'restaurant', 'cafe', 'food', 'pizza', 'burger'] },
        { category: 'Travel', keywords: ['uber', 'ola', 'metro', 'railway', 'irctc', 'flight', 'fuel', 'petrol'] },
        { category: 'Shopping', keywords: ['amazon', 'flipkart', 'myntra', 'shopping', 'store', 'mart'] },
        { category: 'Bills', keywords: ['electricity', 'bill', 'recharge', 'broadband', 'wifi', 'postpaid'] },
        { category: 'Entertainment', keywords: ['netflix', 'prime', 'spotify', 'bookmyshow', 'movie'] },
        { category: 'Health', keywords: ['pharmacy', 'hospital', 'clinic', 'medicine', 'doctor'] },
    ];

    return categoryMap.find((item) => item.keywords.some((keyword) => text.includes(keyword)))?.category || DEFAULT_CATEGORY;
};

const normalizeDetection = (payload, smsText) => {
    const amount = Number(payload?.amount) || Number(smsText.match(/(?:rs\.?|inr|₹)\s*([\d,]+(?:\.\d{1,2})?)/i)?.[1]?.replace(/,/g, '')) || 0;
    const merchant = payload?.merchant || smsText.match(/(?:for|to|at|on)\s+([a-zA-Z0-9 &._-]+)/i)?.[1]?.split(/\s+(?:on|via|from|using)\s+/i)?.[0]?.trim() || 'Unknown Merchant';
    const paymentMethod = payload?.paymentMethod || smsText.match(/(?:from|via|using)\s+([a-zA-Z0-9 &._-]+)/i)?.[1]?.split(/\s+(?:for|to|on)\s+/i)?.[0]?.trim() || 'Unknown';
    const type = payload?.type || (/credit(?:ed)?|received/i.test(smsText) ? 'income' : 'expense');
    const category = payload?.category || inferCategory(smsText, merchant);

    return {
        amount,
        merchant: merchant.replace(/\s+/g, ' ').trim(),
        category,
        type: String(type).toLowerCase() === 'income' ? 'income' : 'expense',
        paymentMethod: paymentMethod.replace(/\s+/g, ' ').trim(),
        date: normalizeDate(payload?.date || smsText),
    };
};

const extractJson = (text) => {
    const match = text.match(/\{[\s\S]*\}/);
    return match ? JSON.parse(match[0]) : JSON.parse(text);
};

module.exports = {
    DEFAULT_CATEGORY,
    normalizeDate,
    inferCategory,
    normalizeDetection,
    extractJson,
};

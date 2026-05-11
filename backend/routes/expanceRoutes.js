const express = require('express');
const mongoose = require('mongoose');
const Expance = require('../models/expance');
const authMiddler = require('../middleware/authMiddleware');


const router = express.Router();

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const toNumber = (value) => Number(value);
const DEFAULT_CATEGORY = 'Other';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';

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
    const merchant = payload?.merchant || smsText.match(/(?:for|to|at)\s+([a-zA-Z0-9 &._-]+)/i)?.[1]?.split(/\s+(?:on|via|from|using)\s+/i)?.[0]?.trim() || 'Unknown Merchant';
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

const detectWithOpenRouter = async (smsText) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is missing');
    }

    const prompt = `Extract one bank transaction SMS into strict JSON only.
Return this exact shape:
{"amount":number,"merchant":"string","category":"Food|Travel|Shopping|Bills|Entertainment|Health|Other","type":"expense|income","paymentMethod":"string","date":"YYYY-MM-DD"}
Use the current year when the SMS has no year. SMS: ${smsText}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: OPENROUTER_MODEL,
            messages: [
                {
                    role: 'system',
                    content: 'You extract bank transaction SMS data into valid JSON only.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.1,
            response_format: { type: 'json_object' },
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter SMS detection failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) throw new Error('OpenRouter SMS detection returned no content');

    return extractJson(text);
};

const detectWithGemini = async (smsText) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing');
    }

    const prompt = `Extract one bank transaction SMS into strict JSON only.
Return this exact shape:
{"amount":number,"merchant":"string","category":"Food|Travel|Shopping|Bills|Entertainment|Health|Other","type":"expense|income","paymentMethod":"string","date":"YYYY-MM-DD"}
Use the current year when the SMS has no year. SMS: ${smsText}`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.1, responseMimeType: 'application/json' },
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini SMS detection failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('AI detection returned no content');

    return extractJson(text);
};

const detectWithAI = async (smsText) => {
    try {
        return await detectWithOpenRouter(smsText);
    } catch (error) {
        console.error('OpenRouter SMS detection failed, falling back to Gemini:', error.message);
    }

    return detectWithGemini(smsText);
};

router.use(express.json());
router.use(authMiddler);


router.post('/', async (req, res) => {
    try{

        const {title, amount, category, date} = req.body;
        const parsedAmount = toNumber(amount);
        const parsedDate = new Date(date);

        if(!title || Number.isNaN(parsedAmount) || !category || Number.isNaN(parsedDate.getTime())){
            return res.status(400).json({ msg:'All fields are required'});
        }

        const newExpance = await Expance.create({
            title,
            amount: parsedAmount,
            category,
            date: parsedDate,
            userId: req.user.userId
        });
        return res.status(201).json({ msg: 'Expance added succesfully', expense: newExpance})

    }catch(error){
        console.error('Error adding expense:', error);
        res.status(500).json({ msg: 'Server error' });
    }
})

router.post('/detect-sms', async (req, res) => {
    try {
        const { smsText } = req.body;

        if (!smsText || !String(smsText).trim()) {
            return res.status(400).json({ msg: 'SMS text is required' });
        }

        const aiPayload = await detectWithAI(String(smsText));
        const detection = normalizeDetection(aiPayload, String(smsText));

        if (!detection.amount) {
            return res.status(422).json({ msg: 'Could not detect an amount from this SMS' });
        }

        return res.status(200).json(detection);
    } catch (error) {
        console.error('Error detecting expense from SMS:', error);
        const detection = normalizeDetection(null, String(req.body.smsText || ''));

        if (!detection.amount) {
            return res.status(500).json({ msg: 'Failed to detect expense from SMS' });
        }

        return res.status(200).json({ ...detection, source: 'fallback' });
    }
});

router.get('/', async (req, res)=> {
    try{
        const expanses = await Expance.find({ userId: req.user.userId });
        res.status(200).json(expanses)
    }catch(error){
        console.error('Error fetching expenses:', error);
        res.status(500).json({ msg: 'Server error' }); 
    }   
})


router.delete('/:id' , async (req, res) => {
    try{
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ msg: 'Invalid expense id' });
        }

        // Verify the expense belongs to the user
        const expense = await Expance.findOne({ _id: id, userId: req.user.userId });
        if(!expense){
            return res.status(404).json({ msg: 'Expense not found'});
        }

        const deleteExpance = await Expance.findByIdAndDelete(id);
        
        if(!deleteExpance){
            return res.status(404).json({ msg: 'Expense not found'});
        }
        res.status(200).json({msg:'Expense deleted successfully'})
    }catch(error){
        console.error('Error deleting expense:', error);
        res.status(500).json({ msg: 'Server error' });
    }   
})



router.put('/:id', async (req, res)=> {
    try{
        const { id } = req.params;
        const {title , amount, category, date} = req.body;
        const parsedAmount = toNumber(amount);
        const parsedDate = new Date(date);

        if (!isValidObjectId(id)) {
            return res.status(400).json({ msg: 'Invalid expense id' });
        }


        if(!title || Number.isNaN(parsedAmount) || !category || Number.isNaN(parsedDate.getTime())){
            return res.status(400).json({ msg:'All fields are required'})
        }

        // Verify the expense belongs to the user
        const existingExpense = await Expance.findOne({ _id: id, userId: req.user.userId });
        if(!existingExpense){
            return res.status(404).json({ msg: 'Expense not found'})
        }

        const updateExpance = await Expance.findByIdAndUpdate(
            id,
            {title, amount: parsedAmount, category, date: parsedDate},
            {new:true, runValidators: true}     
        );

        if(!updateExpance){
            return res.status(404).json({ msg: 'Expense not found'})
        }
        res.status(200).json({
            msg: 'Expense updated successfully',
            expense: updateExpance,
        });
    }catch(error){
        console.error('Error updating expense:', error);
        res.status(500).json({ msg: 'Server error' });
    }
})


router.get('/filter', async (req, res) => {
    try {
        const {
            category,
            from,
            to,
            highest,
            hightest,
            latest,
            page = 1,
            limit = 10,
        } = req.query;

        const query = { userId: req.user.userId };

        if (category) {
            query.category = category;
        }

        if (from && to) {
            query.date = { $gte: new Date(from), $lte: new Date(to) };
        }

        const sortOption = {};

        if (highest || hightest) {
            sortOption.amount = -1;
        }

        if (latest) {
            sortOption.date = -1;
        }

        const numericPage = Math.max(parseInt(page, 10) || 1, 1);
        const numericLimit = Math.max(parseInt(limit, 10) || 10, 1);
        const skip = (numericPage - 1) * numericLimit;

        const [expenses, totalItems] = await Promise.all([
            Expance.find(query).sort(sortOption).skip(skip).limit(numericLimit),
            Expance.countDocuments(query),
        ]);

        res.status(200).json({
            currentPage: numericPage,
            totalItems,
            totalPages: Math.ceil(totalItems / numericLimit),
            expenses,
        });
    } catch (error) {
        console.error('Error filtering expenses:', error);
        res.status(500).json({ msg: 'Server error' });
    }
});






module.exports = router;

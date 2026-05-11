const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/auth');
const Expense = require('../models/expance');
const jwt = require('jsonwebtoken');
const authMiddler = require('../middleware/authMiddleware');

const SECRET_KEY = process.env.SECRET_KEY || process.env.JWT_SECRET;

if (!SECRET_KEY) {
  console.error('WARNING: SECRET_KEY or JWT_SECRET environment variable is not set!');
}

const router = express.Router();
const ADVISOR_MAX_USER_MESSAGES = 5;
const AUTHENTICATED_ADVISOR_LIMIT = 10;
const AUTHENTICATED_ADVISOR_WINDOW_MS = 12 * 60 * 60 * 1000;
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const PROJECT_CONTEXT = `
Spendora is a full-stack expense tracker built with React, Vite, Tailwind CSS, Node.js, Express, and MongoDB.
It supports signup/login with JWT authentication, a dashboard, analytics charts, add/edit/delete expense flows, category tracking, protected routes, and AI expense detection from bank SMS.
The landing page includes an AI Advisor chat widget.
When answering, prefer guidance that fits an expense-tracking app like Spendora.
If the user asks about app capabilities, reference these features accurately and do not invent missing features.
`;

const attachOptionalUser = async (req, res, next) => {
    try {
        if (!SECRET_KEY) {
            return next();
        }

        const authHeader = req.headers.authorization;
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return next();
        }

        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        return next();
    } catch (error) {
        return next();
    }
};

const buildExpenseSummary = async (userId) => {
    if (!userId) {
        return 'No logged-in user context available.';
    }

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [user, monthlyExpenses, totalExpenses] = await Promise.all([
        User.findById(userId).select('name email monthlyIncome').lean(),
        Expense.find({
            userId,
            date: { $gte: monthStart, $lte: now },
        }).select('title amount category date').sort({ date: -1 }).lean(),
        Expense.find({ userId }).select('title amount category date').sort({ date: -1 }).limit(5).lean(),
    ]);

    if (!user) {
        return 'Logged-in user was not found.';
    }

    const monthlyTotal = monthlyExpenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
    const categoryTotals = monthlyExpenses.reduce((accumulator, expense) => {
        const category = expense.category || 'Other';
        accumulator[category] = (accumulator[category] || 0) + (Number(expense.amount) || 0);
        return accumulator;
    }, {});

    const topCategoryEntry = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    const recentExpenseText = totalExpenses.length
        ? totalExpenses
            .slice(0, 3)
            .map((expense) => `${expense.title} (${expense.category}) ${expense.amount}`)
            .join(', ')
        : 'No recent expenses found';

    return `
Logged-in user context:
- Name: ${user.name}
- Email: ${user.email}
- Monthly income: ${user.monthlyIncome || 0}
- Expenses recorded this month: ${monthlyExpenses.length}
- Total spent this month: ${monthlyTotal.toFixed(2)}
- Top spending category this month: ${topCategoryEntry ? `${topCategoryEntry[0]} (${topCategoryEntry[1].toFixed(2)})` : 'No category data yet'}
- Recent expenses: ${recentExpenseText}
`;
};

const getAdvisorQuotaState = (user) => {
    const now = Date.now();
    const windowStartedAt = user?.advisorUsage?.windowStartedAt
        ? new Date(user.advisorUsage.windowStartedAt).getTime()
        : null;

    if (!windowStartedAt || Number.isNaN(windowStartedAt) || now - windowStartedAt >= AUTHENTICATED_ADVISOR_WINDOW_MS) {
        const nextResetAt = new Date(now + AUTHENTICATED_ADVISOR_WINDOW_MS);
        return {
            count: 0,
            remaining: AUTHENTICATED_ADVISOR_LIMIT,
            nextResetAt,
            shouldReset: true,
            windowStartedAt: new Date(now),
        };
    }

    const count = Math.max(0, Number(user?.advisorUsage?.count || 0));
    const remaining = Math.max(AUTHENTICATED_ADVISOR_LIMIT - count, 0);

    return {
        count,
        remaining,
        nextResetAt: new Date(windowStartedAt + AUTHENTICATED_ADVISOR_WINDOW_MS),
        shouldReset: false,
        windowStartedAt: new Date(windowStartedAt),
    };
};

const syncAdvisorQuotaIfExpired = async (userId) => {
    const user = await User.findById(userId).select('advisorUsage');
    if (!user) {
        return null;
    }

    const quota = getAdvisorQuotaState(user);

    if (quota.shouldReset) {
        user.advisorUsage = {
            count: 0,
            windowStartedAt: quota.windowStartedAt,
        };
        await user.save();
    }

    return {
        limit: AUTHENTICATED_ADVISOR_LIMIT,
        used: quota.count,
        remaining: quota.remaining,
        nextResetAt: quota.nextResetAt,
    };
};

const consumeAdvisorQuota = async (userId) => {
    const user = await User.findById(userId).select('advisorUsage');
    if (!user) {
        return null;
    }

    const quota = getAdvisorQuotaState(user);

    if (quota.remaining <= 0) {
        return {
            allowed: false,
            limit: AUTHENTICATED_ADVISOR_LIMIT,
            used: quota.count,
            remaining: 0,
            nextResetAt: quota.nextResetAt,
        };
    }

    const nextCount = quota.count + 1;
    user.advisorUsage = {
        count: nextCount,
        windowStartedAt: quota.windowStartedAt,
    };
    await user.save();

    return {
        allowed: true,
        limit: AUTHENTICATED_ADVISOR_LIMIT,
        used: nextCount,
        remaining: Math.max(AUTHENTICATED_ADVISOR_LIMIT - nextCount, 0),
        nextResetAt: new Date(quota.windowStartedAt.getTime() + AUTHENTICATED_ADVISOR_WINDOW_MS),
    };
};

const buildAdvisorFallback = (message) => {
    const lowerMessage = String(message || '').toLowerCase();

    if (lowerMessage.includes('save') || lowerMessage.includes('saving')) {
        return "Start with a simple 50/30/20 split: needs, wants, and savings. Track your top 3 spending categories first, then set a small weekly savings target you can actually maintain.";
    }

    if (lowerMessage.includes('budget')) {
        return "A good starter budget is to list monthly income, fixed bills, savings goal, and then cap flexible spending like food, travel, and shopping. Reviewing the last 30 days of expenses usually gives the clearest budget baseline.";
    }

    if (lowerMessage.includes('debt') || lowerMessage.includes('loan') || lowerMessage.includes('credit card')) {
        return "Focus on paying minimums on all debt, then put extra money toward the highest-interest balance first. If cash flow feels tight, we can also break your monthly spending into fixed and flexible categories to find room.";
    }

    return "I can help with budgeting, saving, spending habits, and basic money planning. Tell me your goal, monthly income range, or biggest expense category, and I’ll suggest a practical next step.";
};

const getAdvisorReplyFromOpenRouter = async (prompt) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
        throw new Error('OPENROUTER_API_KEY is missing');
    }

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
                    content: 'You are Spendora Advisor, a concise and friendly finance assistant. Keep replies under 120 words and use plain language.',
                },
                {
                    role: 'user',
                    content: prompt,
                },
            ],
            temperature: 0.5,
            max_tokens: 220,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter advisor request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data?.choices?.[0]?.message?.content?.trim();
};

const getAdvisorReplyFromGemini = async (prompt) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error('GEMINI_API_KEY is missing');
    }

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { temperature: 0.5, maxOutputTokens: 220 },
            }),
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Gemini advisor request failed (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
};

const getAdvisorReply = async (message, history = [], userContext = 'No logged-in user context available.') => {

    const conversation = history
        .slice(-6)
        .map((item) => `${item.role === 'assistant' ? 'Advisor' : 'User'}: ${item.content}`)
        .join('\n');

    const prompt = `You are Spendora Advisor, a concise and friendly finance assistant for an expense tracker app.
Give practical, easy-to-follow personal finance guidance.
Do not claim access to bank accounts or live user financial data unless explicitly provided in the conversation.
Use the project context below when the user asks about the app, its features, or how to use it.
If relevant, connect your answer to dashboards, analytics, categories, budgeting, or expense tracking inside Spendora.
If logged-in user context is provided, use it to personalize the answer with their real spending patterns.
Do not fabricate numbers beyond the provided user context.
Keep replies under 120 words and use plain language.

Project context:
${PROJECT_CONTEXT}

User context:
${userContext}

Conversation so far:
${conversation || 'No previous messages.'}

User: ${message}
Advisor:`;

    try {
        const openRouterReply = await getAdvisorReplyFromOpenRouter(prompt);
        if (openRouterReply) {
            return openRouterReply;
        }
    } catch (error) {
        console.error('OpenRouter advisor failed, falling back to Gemini:', error.message);
    }

    try {
        const geminiReply = await getAdvisorReplyFromGemini(prompt);
        if (geminiReply) {
            return geminiReply;
        }
    } catch (error) {
        console.error('Gemini advisor failed after OpenRouter fallback:', error.message);
    }

    return buildAdvisorFallback(message);
};

router.get('/stats', async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();

        return res.status(200).json({ totalUsers });
    } catch (error) {
        console.error('Error fetching auth stats:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

router.use(attachOptionalUser);

router.get('/advisor-chat-status', authMiddler, async (req, res) => {
    try {
        const quota = await syncAdvisorQuotaIfExpired(req.user.userId);

        if (!quota) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.status(200).json(quota);
    } catch (error) {
        console.error('Error fetching advisor chat status:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

router.post('/advisor-chat', async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || !String(message).trim()) {
            return res.status(400).json({ msg: 'Message is required' });
        }

        const safeHistory = Array.isArray(history) ? history : [];

        if (req.user?.userId) {
            const quota = await consumeAdvisorQuota(req.user.userId);

            if (!quota) {
                return res.status(404).json({ msg: 'User not found' });
            }

            if (!quota.allowed) {
                return res.status(429).json({
                    msg: `Chat limit reached. You can send up to ${AUTHENTICATED_ADVISOR_LIMIT} messages every 12 hours.`,
                    limit: quota.limit,
                    used: quota.used,
                    remaining: quota.remaining,
                    nextResetAt: quota.nextResetAt,
                });
            }

            const userContext = await buildExpenseSummary(req.user.userId);
            const reply = await getAdvisorReply(String(message).trim(), safeHistory, userContext);

            return res.status(200).json({
                reply,
                limit: quota.limit,
                used: quota.used,
                remaining: quota.remaining,
                nextResetAt: quota.nextResetAt,
            });
        }

        const userMessageCount = safeHistory.filter((item) => item?.role === 'user').length;

        const userContext = await buildExpenseSummary(req.user?.userId);
        const reply = await getAdvisorReply(String(message).trim(), safeHistory, userContext);

        return res.status(200).json({ reply });
    } catch (error) {
        console.error('Error in advisor chat:', error);
        return res.status(200).json({
            reply: buildAdvisorFallback(req.body?.message),
            source: 'fallback',
        });
    }
});

router.post("/register", async (req, res) => {
    try{
        const {name, email, password} = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All fields are required" });
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await User.create({
            name,
            email,
            password:hashedPassword,
            monthlyIncome: 0
        })
        res.status(201).json({ msg: 'User registered successfully' });
    } catch(error){
        console.error("Error during Registeration:", error);
        res.status(500).json({msg:"Server error, please try again later"});
    }
    } )
    




router.post('/login', async (req, res)=> {
    try{

        const {email, password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({ msg: "All fields are required" });
        }
        
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({ msg: "Invalid email or password" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({
                msg:"Invalid email or password",
            })
        }

        if (!SECRET_KEY) {
            console.error('Missing SECRET_KEY environment variable');
            return res.status(500).json({ msg: 'Server configuration error' });
        }

        const token = jwt.sign(
            {userId : user._id, email: user.email},
            SECRET_KEY,
            {expiresIn:'1h'}
        );


        res.status(200).json({
            msg:"Login Successfully",
            token:token,
            user: {
                name: user.name,
                email: user.email,
                id: user._id,
                monthlyIncome: user.monthlyIncome || 0
            }
        });
    }catch(error){
        console.error("Error during login:", error);
        res.status(500).json({
            msg:"there is something Problem",
        })
    }

})



router.get('/dashboard', authMiddler, (req, res) => {
    res.json({
        msg: `Welcome ${req.user.email}, you are authorized!`,
    })
});

router.get('/profile', authMiddler, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('name email monthlyIncome');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching profile:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

router.put('/profile', authMiddler, async (req, res) => {
    try {
        const { name, email, monthlyIncome } = req.body;

        if (!name || !email) {
            return res.status(400).json({ msg: 'Name and email are required' });
        }

        const parsedMonthlyIncome = Number(monthlyIncome);
        if (Number.isNaN(parsedMonthlyIncome) || parsedMonthlyIncome < 0) {
            return res.status(400).json({ msg: 'Monthly income must be a valid non-negative number' });
        }

        const existingUser = await User.findOne({ email, _id: { $ne: req.user.userId } });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already exists' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user.userId,
            {
                name,
                email,
                monthlyIncome: parsedMonthlyIncome,
            },
            {
                new: true,
                runValidators: true,
            }
        ).select('name email monthlyIncome');

        if (!updatedUser) {
            return res.status(404).json({ msg: 'User not found' });
        }

        return res.status(200).json({
            msg: 'Profile updated successfully',
            user: updatedUser,
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ msg: 'Server error' });
    }
});

module.exports = router;

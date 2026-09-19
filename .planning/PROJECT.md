# Project: Expense Tracker (Spendora)

## Vision & Overview
Spendora / Expense Tracker is a full-stack personal finance and expense management web application. It empowers users to monitor, analyze, and optimize daily spending, detect transaction expenses automatically from SMS banking alerts, simulate banking and vendor payout operations, and receive AI-guided financial advisory insights.

---

## Core Value Proposition
- **Automated Expense Tracking**: Extract merchant, amount, category, and date directly from pasted SMS transaction notifications using regex and AI LLM parsing.
- **Visual Analytics**: Interactive breakdowns by category, top spending days, and month-over-month trends via Recharts.
- **AI Financial Advisor**: In-app chatbot on the landing page and specialized advice cards on the analytics dashboard powered by OpenRouter / Gemini.
- **Banking & Settlements**: Simulate account balances, fund transfers between registered users, vendor payout validation, and transaction settlements.

---

## Technical Foundations
- **Frontend**: React 18, Vite 7, React Router 7, Tailwind CSS 4, Framer Motion, Recharts, Axios, Lucide React.
- **Backend**: Node.js, Express.js 5, MongoDB, Mongoose 8, JWT, bcryptjs, Zod.
- **Deployment & Hosting**: Frontend hosted on Vercel (`https://expance-traker.vercel.app/`), Backend REST API on Node server.

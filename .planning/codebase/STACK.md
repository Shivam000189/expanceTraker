# Technology Stack

## Overview
Full-stack MERN application (MongoDB, Express, React, Node.js) with Vite, Tailwind CSS, and AI LLM integrations.

---

## Backend Runtime & Core Dependencies

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | `>= 18.0.0` | Server JavaScript runtime |
| **Package Manager** | npm | `>= 9.0.0` | Dependency management |
| **Framework** | Express.js | `^5.1.0` | HTTP web server & REST routing |
| **Database ODM** | Mongoose | `^8.19.2` | MongoDB object modeling and schema validation |
| **Authentication** | jsonwebtoken | `^9.0.2` | JWT token generation and verification |
| **Password Hashing** | bcryptjs | `^3.0.2` | Password salting and hashing |
| **Schema Validation** | Zod | `^4.4.3` | Schema and payload validation |
| **CORS** | cors | `^2.8.5` | Cross-Origin Resource Sharing handling |
| **Environment** | dotenv | `^17.2.3` | Loading `.env` configurations |
| **Dev Tooling** | nodemon | `^3.0.2` | Hot reload dev server (`npm run dev`) |

---

## Frontend Runtime & Core Dependencies

| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Library** | React | `^18.3.1` | Component UI library |
| **DOM Renderer** | react-dom | `^18.3.1` | React DOM bindings |
| **Build Tool / Bundler** | Vite | `^7.1.7` | Fast HMR dev server and ES build |
| **Routing** | react-router-dom | `^7.9.4` | Client-side routing and protected routes |
| **Styling** | Tailwind CSS | `^4.1.14` | Utility-first CSS styling via `@tailwindcss/vite` |
| **Animations** | Framer Motion | `^12.38.0` | UI animations and page transitions |
| **Charts & Analytics** | Recharts | `^3.8.1` | Declarative SVG charting (bar, donut, area) |
| **HTTP Client** | Axios | `^1.14.0` | HTTP requests with interceptors for JWT |
| **Icons** | Lucide React / React Icons | `^0.556.0` / `^5.5.0` | Iconography throughout app & dashboard |
| **Notifications** | react-hot-toast | `^2.6.0` | In-app feedback and alert toasts |
| **QR Code** | qrcode.react | `^4.2.0` | Rendering payment QR codes in Bank/Payout flows |
| **Utility Styling** | clsx / tailwind-merge | `^2.1.1` / `^3.5.0` | Conditional class joining and Tailwind conflict resolution |

---

## External APIs & LLM Providers

- **OpenRouter API**: (`https://openrouter.ai/api/v1/chat/completions`)
  - Primary model: `openai/gpt-4o-mini` (or configurable via `OPENROUTER_MODEL`)
  - Used for AI Expense Advisor chatbot (`LandingChatbot.jsx`, `AnalyticsAdvisorCard.jsx`) and SMS expense extraction fallback.
- **Google Gemini API**: Configured via `GEMINI_API_KEY` for alternate AI capabilities.
- **MongoDB Atlas / Local MongoDB**: Persistent database store.

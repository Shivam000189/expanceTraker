import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Loader2, MessageSquare, Send, X, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const MAX_USER_MESSAGES = 5;
const RESET_PERIOD_DAYS = 2;
const STORAGE_KEY = "landing_chat_usage";

const starterMessage = {
  role: "assistant",
  content:
    "Hi, I'm your Spendora Advisor. Ask me about budgeting, saving money, cutting expenses, planning your monthly finances, or how Spendora features can help.",
};

const LandingChatbot = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const messagesEndRef = useRef(null);

  // Load usage data from localStorage
  const loadUsageData = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading chat usage data:", error);
    }
    return { messagesUsed: 0, lastReset: Date.now() };
  };

  // Save usage data to localStorage
  const saveUsageData = (data) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Error saving chat usage data:", error);
    }
  };

  // Check if we should reset the usage counter
  const shouldResetUsage = (lastReset) => {
    const now = Date.now();
    const resetPeriodMs = RESET_PERIOD_DAYS * 24 * 60 * 60 * 1000;
    return now - lastReset >= resetPeriodMs;
  };

  // Get current usage info
  const getUsageInfo = () => {
    const usageData = loadUsageData();
    const { messagesUsed, lastReset } = usageData;

    if (shouldResetUsage(lastReset)) {
      // Reset usage if 2 days have passed
      const newData = { messagesUsed: 0, lastReset: Date.now() };
      saveUsageData(newData);
      return { messagesUsed: 0, remainingMessages: MAX_USER_MESSAGES };
    }

    const remainingMessages = Math.max(MAX_USER_MESSAGES - messagesUsed, 0);
    return { messagesUsed, remainingMessages };
  };

  const { remainingMessages } = getUsageInfo();
  const hasReachedLimit = remainingMessages === 0;

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setShowLoginPrompt(hasReachedLimit);
    }
  }, [isOpen, hasReachedLimit]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput || isSending || hasReachedLimit) {
      return;
    }

    const userMessage = { role: "user", content: trimmedInput };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsSending(true);

    try {
      const { data } = await API.post("/auth/advisor-chat", {
        message: trimmedInput,
        history: nextMessages.slice(-6),
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            data?.reply ||
            "I couldn't generate a reply right now, but I can still help with budgeting and saving questions.",
        },
      ]);

      // Update usage count
      const usageData = loadUsageData();
      usageData.messagesUsed += 1;
      saveUsageData(usageData);

    } catch (error) {
      console.error("Error sending advisor message:", error);
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            error.response?.status === 429
              ? "You've reached the message limit. Sign up to continue chatting with the advisor!"
              : "I'm having trouble responding right now. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="fixed bottom-6 right-6 z-[70] w-[calc(100vw-2rem)] max-w-[390px]"
        >
          <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-[0_30px_80px_-20px_rgba(16,185,129,0.28)]">
            <div className="flex items-center justify-between bg-zinc-900 px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-300">
                  <MessageSquare size={20} />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.24em] text-emerald-300">
                    AI Advisor
                  </p>
                  <p className="text-sm text-zinc-300">
                    {hasReachedLimit
                      ? "Daily limit reached"
                      : `${remainingMessages} of ${MAX_USER_MESSAGES} messages left`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl p-2 text-zinc-300 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="h-[420px] overflow-y-auto bg-gradient-to-b from-emerald-50/60 via-white to-white px-4 py-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`flex ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                        message.role === "user"
                          ? "bg-emerald-600 text-white"
                          : "bg-white text-zinc-700 border border-zinc-100"
                      }`}
                    >
                      {message.content}
                    </div>
                  </div>
                ))}

                {isSending && (
                  <div className="flex justify-start">
                    <div className="inline-flex items-center gap-2 rounded-3xl border border-zinc-100 bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm">
                      <Loader2 size={16} className="animate-spin" />
                      Thinking...
                    </div>
                  </div>
                )}

                {showLoginPrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center space-y-4 p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-3xl border border-emerald-200"
                  >
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-zinc-900 mb-2">Ready for More Conversations?</h3>
                      <p className="text-sm text-zinc-600 mb-4">
                        You've used all your free messages. Sign up to continue chatting with the AI Advisor and unlock unlimited conversations!
                      </p>
                    </div>
                    <div className="flex gap-3 w-full">
                      <button
                        onClick={() => {
                          onClose();
                          navigate("/login");
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold px-4 py-3 rounded-2xl hover:bg-emerald-700 transition-all text-sm"
                      >
                        <LogIn size={16} />
                        Login
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          navigate("/signup");
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white font-bold px-4 py-3 rounded-2xl hover:bg-zinc-800 transition-all text-sm"
                      >
                        <UserPlus size={16} />
                        Sign Up
                      </button>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="border-t border-zinc-100 bg-white p-4">
              <div className="flex items-end gap-3 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 px-3 py-3">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder={
                    hasReachedLimit
                      ? "Sign up to continue chatting"
                      : "Ask about budget, savings, debt, spending, or Spendora..."
                  }
                  disabled={hasReachedLimit}
                  className="max-h-28 min-h-[28px] flex-1 resize-none bg-transparent text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  disabled={isSending || !input.trim() || hasReachedLimit}
                  className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
                >
                  <Send size={17} />
                </button>
              </div>
              <p className="mt-3 text-xs text-zinc-500">
                The advisor answers with AI and uses Spendora project context. Limit: {MAX_USER_MESSAGES} user messages per {RESET_PERIOD_DAYS} days.
              </p>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LandingChatbot;

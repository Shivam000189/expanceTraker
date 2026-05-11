import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import API from "../api";

const starterMessage = {
  role: "assistant",
  content:
    "I can use your Spendora expense data to answer questions about your spending, categories, savings opportunities, and monthly habits.",
};

const formatResetTime = (value) => {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AnalyticsAdvisorCard() {
  const [messages, setMessages] = useState([starterMessage]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [quota, setQuota] = useState({
    limit: 10,
    used: 0,
    remaining: 10,
    nextResetAt: null,
  });
  const [statusLoading, setStatusLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchQuota = async () => {
      try {
        const { data } = await API.get("/auth/advisor-chat-status");
        setQuota({
          limit: Number(data?.limit || 10),
          used: Number(data?.used || 0),
          remaining: Number(data?.remaining || 10),
          nextResetAt: data?.nextResetAt || null,
        });
      } catch (error) {
        console.error("Error fetching advisor quota:", error);
      } finally {
        setStatusLoading(false);
      }
    };

    fetchQuota();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  const hasReachedLimit = quota.remaining <= 0;
  const nextResetLabel = useMemo(
    () => formatResetTime(quota.nextResetAt),
    [quota.nextResetAt]
  );

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
        history: nextMessages.slice(-8),
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            data?.reply ||
            "I couldn't prepare a data-backed answer just now. Please try again.",
        },
      ]);

      setQuota({
        limit: Number(data?.limit || quota.limit),
        used: Number(data?.used || quota.used),
        remaining: Number(data?.remaining ?? quota.remaining),
        nextResetAt: data?.nextResetAt || quota.nextResetAt,
      });
    } catch (error) {
      console.error("Error sending analytics advisor message:", error);

      if (error.response?.status === 429) {
        const data = error.response.data || {};
        setQuota({
          limit: Number(data?.limit || quota.limit),
          used: Number(data?.used || quota.used),
          remaining: Number(data?.remaining || 0),
          nextResetAt: data?.nextResetAt || quota.nextResetAt,
        });
      }

      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: "assistant",
          content:
            error.response?.status === 429
              ? `You've used all 10 chats for this 12-hour window. Your next 10 chats unlock on ${formatResetTime(
                  error.response?.data?.nextResetAt
                )}.`
              : "I hit a problem while preparing your answer. Please try again in a moment.",
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl lg:rounded-[2rem] p-5 lg:p-8 shadow-sm border border-zinc-100">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-100 mb-3">
            <Sparkles size={12} />
            AI Advisor
          </div>
          <h3 className="text-lg lg:text-xl font-bold font-display text-zinc-900">
            Ask about your own spending
          </h3>
          <p className="text-sm text-zinc-500 mt-1">
            This advisor uses your saved Spendora expense data to answer with personal context.
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 min-w-[220px]">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-zinc-500">
            Chat Usage
          </p>
          {statusLoading ? (
            <p className="mt-2 text-sm text-zinc-500">Loading limit...</p>
          ) : (
            <>
              <p className="mt-2 text-lg font-bold text-zinc-900">
                {quota.remaining} / {quota.limit} left
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {hasReachedLimit && nextResetLabel
                  ? `Next 10 chats: ${nextResetLabel}`
                  : nextResetLabel
                  ? `Window resets: ${nextResetLabel}`
                  : "10 chats per 12 hours"}
              </p>
            </>
          )}
        </div>
      </div>

      <div className="h-[360px] overflow-y-auto rounded-[1.5rem] border border-zinc-100 bg-gradient-to-b from-emerald-50/50 via-white to-white p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "bg-zinc-900 text-white"
                    : "bg-white text-zinc-700 border border-zinc-100"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-600">
                    <Bot size={12} />
                    Spendora Advisor
                  </div>
                )}
                {message.content}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-2 rounded-3xl border border-zinc-100 bg-white px-4 py-3 text-sm text-zinc-500 shadow-sm">
                <Loader2 size={16} className="animate-spin" />
                Thinking with your data...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex items-end gap-3 rounded-[1.5rem] border border-zinc-200 bg-zinc-50 px-3 py-3">
          <textarea
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={hasReachedLimit}
            placeholder={
              hasReachedLimit
                ? `Your next 10 chats unlock on ${nextResetLabel || "the next reset time"}`
                : "Ask about your top category, monthly spend, savings, or trends..."
            }
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
      </form>
    </div>
  );
}

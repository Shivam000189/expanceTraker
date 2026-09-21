import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, Send, Sparkles } from "lucide-react";
import API from "../api";
import { cn } from "../lib/utils";

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

export default function AnalyticsAdvisorCard({ className = "", chatHeight = "h-[280px]" }) {
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
    <div className={cn("bg-zinc-900/90 rounded-2xl p-5 shadow-sm border border-zinc-800 backdrop-blur-sm flex flex-col justify-between", className)}>
      <div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/5 text-zinc-300 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border border-white/10 mb-2">
              <Sparkles size={11} />
              AI Advisor
            </div>
            <h3 className="text-base font-bold font-display text-white">
              Financial Advisor
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              Data-backed spending intelligence.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 shrink-0">
            <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
              Usage
            </p>
            {statusLoading ? (
              <p className="text-[11px] text-zinc-500">Loading...</p>
            ) : (
              <p 
                className="font-mono text-xs font-bold text-white"
                title={nextResetLabel ? `Resets: ${nextResetLabel}` : undefined}
              >
                {quota.remaining}/{quota.limit}
              </p>
            )}
          </div>
        </div>

        <div className={cn("overflow-y-auto rounded-xl border border-zinc-800 bg-zinc-950/70 p-3.5 space-y-3", chatHeight)}>
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] rounded-xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "bg-white text-black font-semibold"
                    : "bg-zinc-900 text-zinc-200 border border-zinc-800"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="mb-1 flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-zinc-400">
                    <Bot size={11} />
                    Spendora AI
                  </div>
                )}
                {message.content}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs text-zinc-400 shadow-sm">
                <Loader2 size={12} className="animate-spin text-zinc-300" />
                Analyzing data...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-3">
        <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-1.5 focus-within:border-zinc-600">
          <textarea
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            disabled={hasReachedLimit}
            placeholder={
              hasReachedLimit
                ? nextResetLabel
                  ? `Unlocks on ${nextResetLabel}`
                  : "Chat limit reached."
                : "Ask about habits, top category, tips..."
            }
            className="max-h-20 min-h-[22px] flex-1 resize-none bg-transparent text-xs text-zinc-200 outline-none placeholder:text-zinc-500 font-sans"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim() || hasReachedLimit}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-600"
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </div>
  );
}

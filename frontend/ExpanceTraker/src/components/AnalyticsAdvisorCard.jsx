import { useEffect, useMemo, useRef, useState } from "react";
import { Bot, Loader2, Send } from "lucide-react";
import API from "../api";
import { cn } from "../lib/utils";

const starterMessage = {
  role: "assistant",
  content:
    "I can use your Spendora expense data to answer questions about your spending, categories, savings opportunities, and monthly habits.",
};

const formatResetTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

export default function AnalyticsAdvisorCard({
  className = "",
  chatHeight = "h-[280px]",
}) {
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

  const hasReachedLimit = quota.remaining <= 0;
  const nextResetLabel = useMemo(
    () => formatResetTime(quota.nextResetAt),
    [quota.nextResetAt]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || isSending || hasReachedLimit) return;

    const userMessage = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const { data } = await API.post("/auth/advisor-chat", { prompt });
      const assistantText =
        data?.reply ||
        "I could not process that request. Please try again in a moment.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantText },
      ]);

      if (data?.quota) {
        setQuota({
          limit: Number(data.quota.limit || quota.limit),
          used: Number(data.quota.used || quota.used + 1),
          remaining: Number(
            data.quota.remaining ?? Math.max(0, quota.remaining - 1)
          ),
          nextResetAt: data.quota.nextResetAt || quota.nextResetAt,
        });
      }
    } catch (error) {
      console.error("Error asking advisor:", error);
      const errorMsg =
        error.response?.data?.message ||
        "Failed to reach the advisor service. Please try again later.";
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: errorMsg },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      className={cn(
        "rounded-[24px] border border-white/10 bg-[#131313] p-5 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col justify-between text-white",
        className
      )}
    >
      <div>
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0D2E18] text-[#10EE74] border border-[#10EE74]/20 shadow-sm">
              <Bot size={16} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight font-display">
                Advisor Intelligence
              </h3>
              <p className="text-[11px] text-gray-400">
                Personalized spending insights &amp; forecasts
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#1C1C1C] px-2.5 py-1 text-right">
            <p className="text-[9px] uppercase tracking-wider text-gray-400 font-mono">
              Tokens
            </p>
            <p className="font-mono text-xs font-bold text-[#10EE74]">
              {statusLoading ? "..." : `${quota.remaining}/${quota.limit}`}
            </p>
          </div>
        </div>

        {/* Chat message bubbles */}
        <div
          className={cn(
            "overflow-y-auto rounded-2xl border border-white/5 bg-[#1C1C1C]/60 p-3 space-y-2.5",
            chatHeight
          )}
        >
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm ${
                  message.role === "user"
                    ? "bg-[#10EE74] text-black font-medium"
                    : "bg-[#222222] text-white border border-white/5"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="mb-1 flex items-center gap-1 text-[9px] font-semibold text-gray-400">
                    <Bot size={11} className="text-[#10EE74]" />
                    <span>Advisor</span>
                  </div>
                )}
                {message.content}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#222222] px-3 py-1.5 text-xs text-gray-300">
                <Loader2 size={12} className="animate-spin text-[#10EE74]" />
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input bar */}
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#373737] px-3.5 py-1.5 focus-within:border-[#10EE74] transition">
          <textarea
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={hasReachedLimit}
            placeholder={
              hasReachedLimit
                ? "Chat limit reached."
                : "Ask about habits, top category, tips..."
            }
            className="flex-1 resize-none bg-transparent text-xs text-white outline-none placeholder:text-gray-400 font-sans"
          />
          <button
            type="submit"
            disabled={isSending || !input.trim() || hasReachedLimit}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#10EE74] text-black hover:bg-[#10EE74]/90 disabled:opacity-30 disabled:cursor-not-allowed transition shadow-sm"
          >
            <Send size={12} />
          </button>
        </div>
      </form>
    </div>
  );
}

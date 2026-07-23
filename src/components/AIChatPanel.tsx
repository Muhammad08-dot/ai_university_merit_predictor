"use client";

import { useState, useRef, useEffect } from "react";
import type { MeritResult } from "@/lib/calculator";

interface Props {
  results: MeritResult[];
  matricPct: number;
  interPct: number;
  onClose: () => void;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const QUICK_PROMPTS = [
  "What are my best options?",
  "How can I improve my chances?",
  "Suggest backup universities",
  "What if I score 80 on the entry test?",
  "What if I score 90 on the entry test?",
];

export default function AIChatPanel({ results, matricPct, interPct, onClose }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `🌟 Assalam-o-Alaikum! I'm your UniMatch AI Advisor.\n\nI'm here to help you navigate your university admissions journey with confidence!\n\n📊 Your Profile: Matric ${matricPct.toFixed(1)}% | Inter ${interPct.toFixed(1)}%\n📋 Analyzing ${results.length} program options.\n\nAsk me anything — together we'll find the best path for your future! 💚`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          results,
          matricPct,
          interPct,
          query: text,
        }),
      });
      const data = await res.json();
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: data.response || "I couldn't process that. Try asking something else!",
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[85vh] sm:max-h-[80vh] animate-slide-up border border-green-100">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-green-100 bg-gradient-to-r from-green-50 to-emerald-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white text-lg shadow-md shadow-green-200">
              🤖
            </div>
            <div>
              <h3 className="font-extrabold text-green-900">AI Merit Advisor</h3>
              <p className="text-xs text-green-600 flex items-center gap-1 font-medium">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Ready to help
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-green-100 flex items-center justify-center transition"
          >
            <svg className="w-5 h-5 text-green-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-green-50/20">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-green-600 to-emerald-600 text-white rounded-br-sm shadow-md shadow-green-200"
                    : "bg-white text-slate-800 rounded-bl-sm border border-green-100 shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-sm p-3 flex items-center gap-1.5 border border-green-100 shadow-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="px-4 py-2 border-t border-green-100 bg-white">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {QUICK_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
                className="flex-shrink-0 px-3 py-1.5 text-xs font-bold bg-green-50 text-green-700 rounded-full hover:bg-green-100 transition whitespace-nowrap disabled:opacity-50 border border-green-200"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-green-100 bg-white rounded-b-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your admissions..."
              className="flex-1 px-4 py-2.5 border border-green-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-4 py-2.5 gradient-green-btn text-white rounded-xl hover:opacity-90 transition disabled:opacity-50 shadow-md shadow-green-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";

interface GuideMessage {
  role: "agent" | "user";
  content: string;
  suggestedAction?: string;
}

const INITIAL_MESSAGES: GuideMessage[] = [
  {
    role: "agent",
    content: "👋 Hi! I'm your **UniMatch AI Web Guide**.\n\nNeed help filling out your marks or understanding university aggregate formulas? Ask me anything or select a topic below!",
    suggestedAction: "Guide me through Step 1",
  },
];

const GUIDED_TOPICS = [
  "Guide me through Step 1",
  "Explain aggregate formulas",
  "How does Hafiz bonus work?",
  "What do Safe / Reach mean?",
];

export default function AIGuideAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<GuideMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleActionClick = (actionText?: string) => {
    const calc = document.getElementById("calculator");
    if (calc) {
      calc.scrollIntoView({ behavior: "smooth" });
    }
    if (actionText) {
      askAgent(actionText);
    }
  };

  const askAgent = async (text: string) => {
    if (!text.trim()) return;

    if (!isOpen) {
      setIsOpen(true);
    }

    const userMsg: GuideMessage = { role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: text }),
      });
      const data = await res.json();

      const agentMsg: GuideMessage = {
        role: "agent",
        content: data.text || "I'm here to help guide you through the app!",
        suggestedAction: data.suggestedAction,
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "agent", content: "Sorry, I couldn't process that request right now." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-full shadow-2xl hover:scale-105 transition-all duration-500 group border border-emerald-300/40 animate-smooth-popup"
        >
          <span className="text-xl animate-bounce">🧭</span>
          <span className="font-bold text-sm">AI Web Guide</span>
          <span className="w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping" />
        </button>
      )}

      {/* Guide Drawer / Smooth Popup Panel */}
      {isOpen && (
        <div className="w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-emerald-200/80 flex flex-col max-h-[80vh] overflow-hidden animate-smooth-popup">
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-700 to-green-600 text-white shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center text-lg backdrop-blur-md shadow-inner">
                🧭
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                  UniMatch Web Guide Agent
                  <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                </h3>
                <p className="text-xs text-emerald-100 font-medium">Interactive App Orchestrator</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg hover:bg-white/20 flex items-center justify-center transition text-white font-bold"
            >
              ✕
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-gradient-to-b from-emerald-50/40 via-white to-slate-50 text-xs">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col animate-smooth-bubble ${msg.role === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[90%] p-3.5 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm transition-all duration-500 ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-br-none"
                      : "bg-white text-slate-800 border border-emerald-100 rounded-bl-none shadow-emerald-100/40"
                  }`}
                >
                  {msg.content}
                </div>

                {/* Agent Action Button Popup */}
                {msg.role === "agent" && msg.suggestedAction && (
                  <button
                    onClick={() => handleActionClick(msg.suggestedAction)}
                    className="mt-2 px-3 py-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition-all duration-300 border border-emerald-200 flex items-center gap-1.5 shadow-2xs hover:scale-102 animate-smooth-bubble"
                  >
                    <span>🎯 Action:</span> {msg.suggestedAction} <span>→</span>
                  </button>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start animate-smooth-bubble">
                <div className="bg-white rounded-2xl rounded-bl-none p-3 flex items-center gap-1.5 border border-emerald-100 shadow-sm">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Guided Action Buttons */}
          <div className="p-3 border-t border-emerald-100 bg-emerald-50/50 space-y-1.5">
            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider px-1">
              Popular Topics
            </p>
            <div className="flex flex-wrap gap-1.5">
              {GUIDED_TOPICS.map((topic) => (
                <button
                  key={topic}
                  onClick={() => askAgent(topic)}
                  disabled={isLoading}
                  className="px-2.5 py-1 text-[11px] font-semibold bg-white text-emerald-700 rounded-lg hover:bg-emerald-100 transition-all duration-300 border border-emerald-200 shadow-2xs disabled:opacity-50"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>

          {/* Input Footer */}
          <div className="p-3 border-t border-emerald-100 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                askAgent(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask how to use the app..."
                className="flex-1 px-3 py-2 border border-emerald-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-xs transition-all duration-300"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl font-bold hover:opacity-90 transition-all duration-300 disabled:opacity-50 text-xs shadow-md shadow-emerald-200"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

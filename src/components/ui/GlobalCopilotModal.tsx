"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useOrbitStore } from "@/lib/store";
import { useUser } from "@/context/UserContext";

export default function GlobalCopilotModal() {
  const { isCopilotOpen, setCopilotOpen, copilotHistory, addCopilotMessage, clearCopilotHistory } = useOrbitStore();
  const { profile } = useUser();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isCopilotOpen) {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [copilotHistory, isTyping, isCopilotOpen]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput("");
    
    const newMsg = { id: Date.now().toString(), role: "user", content: userMsg };
    addCopilotMessage(newMsg);
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMsg,
          profileContext: profile || {}
        })
      });

      if (res.ok) {
        const data = await res.json();
        addCopilotMessage({ id: Date.now().toString(), role: "orbit", content: data.response });
      } else {
        addCopilotMessage({ id: Date.now().toString(), role: "orbit", content: "Systems offline. Cannot analyze request." });
      }
    } catch (e) {
      addCopilotMessage({ id: Date.now().toString(), role: "orbit", content: "Connection severed." });
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isCopilotOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-surface-container-low/40 backdrop-blur-sm p-4"
          onClick={() => setCopilotOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-black/10 flex flex-col overflow-hidden h-[80vh] md:h-[600px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-black/5 shrink-0 bg-surface/50 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-muted-indigo to-soft-lavender flex items-center justify-center shadow-md">
                    <span className="material-symbols-outlined text-white text-[16px]">robot_2</span>
                  </div>
                  <div className={`absolute inset-0 rounded-full border-2 border-muted-indigo opacity-0 ${isTyping ? "animate-ping" : ""}`} style={{ animationDuration: '2s' }} />
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-primary tracking-tight leading-none">Orbit Copilot</h2>
                  <p className="text-[10px] font-bold text-muted-indigo uppercase tracking-[0.2em] mt-1">Global Intelligence</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCopilotHistory}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 text-on-surface-variant/50 transition-colors"
                  title="Clear Chat"
                >
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
                <button
                  onClick={() => setCopilotOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-black/5 hover:bg-black/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-container-low/20 custom-scrollbar">
              <AnimatePresence initial={false}>
                {copilotHistory.map((msg: any) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}
                  >
                    <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-[13px] font-medium leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-primary text-on-primary rounded-br-sm shadow-md" 
                        : "bg-white border border-black/5 text-on-surface rounded-bl-sm shadow-sm"
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-start">
                    <div className="px-5 py-3 rounded-2xl bg-white border border-black/5 rounded-bl-sm shadow-sm">
                      <span className="flex gap-1.5 items-center h-4">
                        <span className="w-1.5 h-1.5 bg-muted-indigo/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-indigo/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-muted-indigo/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={endRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-black/5 shrink-0 bg-white">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask Orbit for strategic guidance..."
                  className="w-full bg-surface-container-low/50 border border-black/10 rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium focus:outline-none focus:border-muted-indigo/40 focus:bg-white transition-all placeholder:text-on-surface-variant/40"
                  autoFocus
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-white disabled:opacity-50 disabled:bg-surface-container-low disabled:text-on-surface-variant transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

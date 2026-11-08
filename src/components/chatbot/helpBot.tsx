"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { getBotReply } from "@/lib/chatbot";
import { COMPANY } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

type ChatMessage = { role: "bot" | "user"; text: string };

export function HelpBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: `Namaste from ${COMPANY.shortName}. Ask me about paintings, sarees, customization, or shipping.`,
    },
  ]);
  const [suggestions, setSuggestions] = useState([
    "Customize a painting",
    "Madhubani sarees",
    "Shipping time",
    "Talk to human",
  ]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    const reply = getBotReply(trimmed);
    setMessages((prev) => [
      ...prev,
      { role: "user", text: trimmed },
      { role: "bot", text: reply.text },
    ]);
    setSuggestions(reply.suggestions);
    setInput("");
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60]">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            className="mb-3 flex h-[460px] w-[min(100vw-2rem,360px)] flex-col overflow-hidden border border-[var(--ink)]/10 bg-[#FAFAF8] shadow-2xl"
          >
            <div className="flex items-center justify-between bg-[var(--ink)] px-4 py-3 text-white">
              <div>
                <div className="text-sm font-semibold">Madhubani Concierge</div>
                <div className="text-[10px] uppercase tracking-[0.16em] text-white/50">
                  Always here to help
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close bot">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    message.role === "bot"
                      ? "bg-white text-[var(--ink)]"
                      : "ml-auto bg-[var(--vermillion)] text-white",
                  )}
                >
                  {message.text}
                </div>
              ))}
              <div className="flex flex-wrap gap-2 pt-1">
                {suggestions.map((suggestion) => {
                  if (suggestion.toLowerCase().includes("whatsapp")) {
                    return (
                      <a
                        key={suggestion}
                        href={`https://wa.me/${COMPANY.whatsapp}?text=${encodeURIComponent("Hi Sharda Madhubani studio!")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-[var(--ink)]/15 px-3 py-1 text-xs"
                      >
                        {suggestion}
                      </a>
                    );
                  }
                  if (
                    suggestion.toLowerCase().includes("live chat") ||
                    suggestion.toLowerCase().includes("human") ||
                    suggestion.toLowerCase().includes("chat with")
                  ) {
                    return (
                      <Link
                        key={suggestion}
                        href="/chat"
                        className="rounded-full border border-[var(--ink)]/15 px-3 py-1 text-xs"
                      >
                        {suggestion}
                      </Link>
                    );
                  }
                  if (suggestion.toLowerCase().includes("shop") || suggestion.toLowerCase().includes("saree") || suggestion.toLowerCase().includes("open shop") || suggestion.toLowerCase().includes("browse")) {
                    return (
                      <Link
                        key={suggestion}
                        href={suggestion.toLowerCase().includes("saree") ? "/shop?type=SAREE" : "/shop"}
                        className="rounded-full border border-[var(--ink)]/15 px-3 py-1 text-xs"
                      >
                        {suggestion}
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={suggestion}
                      onClick={() => send(suggestion)}
                      className="rounded-full border border-[var(--ink)]/15 px-3 py-1 text-xs"
                    >
                      {suggestion}
                    </button>
                  );
                })}
              </div>
            </div>
            <form
              className="flex gap-2 border-t border-[var(--ink)]/10 p-3"
              onSubmit={(event) => {
                event.preventDefault();
                send(input);
              }}
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask anything..."
                className="flex-1 rounded-full border border-[var(--ink)]/15 px-3 py-2 text-sm outline-none"
              />
              <Button type="submit" size="sm">
                Send
              </Button>
            </form>
          </motion.div>
        ) : null}
      </AnimatePresence>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((value) => !value)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--vermillion)] text-white shadow-lg"
        aria-label="Open help bot"
      >
        <MessageCircle className="h-6 w-6" />
      </motion.button>
    </div>
  );
}

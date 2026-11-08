"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { COMPANY } from "@/lib/constants";

type Message = {
  id: string;
  body: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
};

type Conversation = {
  id: string;
  subject: string | null;
  messages: Message[];
};

export function ChatClient({ isAdmin = false }: { isAdmin?: boolean }) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [body, setBody] = useState("");
  const [subject, setSubject] = useState("Studio enquiry");
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/chat");
    const data: { conversations?: Conversation[]; error?: string } =
      await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to load chat");
      return;
    }
    setConversations(data.conversations || []);
    if (!activeId && data.conversations?.[0]) {
      setActiveId(data.conversations[0].id);
    }
  }

  useEffect(() => {
    void load();
    const timer = setInterval(() => {
      void load();
    }, 5000);
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const active = conversations.find((conversation) => conversation.id === activeId);

  async function send() {
    if (!body.trim()) return;
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conversationId: activeId || undefined,
        subject: activeId ? undefined : subject,
        body,
      }),
    });
    const data: { conversationId?: string; error?: string } = await response.json();
    if (!response.ok) {
      setError(data.error || "Send failed");
      return;
    }
    setBody("");
    if (data.conversationId) setActiveId(data.conversationId);
    await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
      <aside className="space-y-2">
        {conversations.map((conversation) => (
          <button
            key={conversation.id}
            onClick={() => setActiveId(conversation.id)}
            className={`block w-full rounded-xl border px-3 py-2 text-left text-sm ${
              activeId === conversation.id
                ? "border-[var(--vermillion)] bg-[var(--vermillion)]/5"
                : "border-[var(--ink)]/10 bg-white"
            }`}
          >
            {conversation.subject || "Conversation"}
          </button>
        ))}
        {!isAdmin ? (
          <button
            onClick={() => setActiveId(null)}
            className="w-full rounded-xl border border-dashed border-[var(--ink)]/20 px-3 py-2 text-left text-sm"
          >
            + New conversation
          </button>
        ) : null}
        <a
          href={`https://wa.me/${COMPANY.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="block rounded-xl bg-[var(--teal)] px-3 py-2 text-center text-sm text-white"
        >
          WhatsApp studio
        </a>
      </aside>

      <div className="flex min-h-[420px] flex-col border border-[var(--ink)]/10 bg-white">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {active?.messages.map((message) => (
            <div
              key={message.id}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                message.sender.role === "ADMIN"
                  ? "bg-[var(--ink)] text-white"
                  : "ml-auto bg-[var(--vermillion)]/10"
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.14em] opacity-60">
                {message.sender.name}
              </div>
              <div className="mt-1">{message.body}</div>
            </div>
          ))}
          {!active ? (
            <p className="text-sm text-[var(--ink)]/50">
              Start a new conversation with the atelier.
            </p>
          ) : null}
        </div>
        <div className="space-y-2 border-t border-[var(--ink)]/10 p-3">
          {!activeId && !isAdmin ? (
            <Input
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="Subject"
            />
          ) : null}
          <Textarea
            rows={3}
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder="Write your message..."
          />
          {error ? <p className="text-xs text-[var(--vermillion)]">{error}</p> : null}
          <Button onClick={send}>Send</Button>
        </div>
      </div>
    </div>
  );
}

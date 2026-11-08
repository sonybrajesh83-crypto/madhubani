import { ChatClient } from "@/components/store/chatClient";

export default function AdminChatPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Customer chat</h1>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Reply to collectors in-app. Use WhatsApp links on orders for quick calls.
      </p>
      <div className="mt-8">
        <ChatClient isAdmin />
      </div>
    </div>
  );
}

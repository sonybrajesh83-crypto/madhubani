import { redirect } from "next/navigation";
import { ChatClient } from "@/components/store/chatClient";
import { getCurrentUser } from "@/lib/auth";


export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-8">
      <h1 className="font-[family-name:var(--font-display)] text-4xl">Studio chat</h1>
      <p className="mt-2 text-sm text-[var(--ink)]/60">
        Message the atelier live, or jump to WhatsApp for faster replies.
      </p>
      <div className="mt-8">
        <ChatClient isAdmin={user.role === "ADMIN"} />
      </div>
    </div>
  );
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/store/logoutButton";
import { getCurrentUser } from "@/lib/auth";
import { COMPANY } from "@/lib/constants";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/account");

  const links = [
    ["/admin", "Dashboard"],
    ["/admin/products", "Products"],
    ["/admin/categories", "Categories"],
    ["/admin/orders", "Orders"],
    ["/admin/customers", "Customers"],
    ["/admin/chat", "Chat"],
  ] as const;

  return (
    <div className="min-h-screen bg-[#F4F7F6]">
      <header className="border-b border-[var(--ink)]/10 bg-[var(--ink)] text-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-[var(--gold)]">Admin</div>
            <div className="font-[family-name:var(--font-display)] text-xl">
              {COMPANY.shortName}
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 text-sm">
            {links.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="rounded-full px-3 py-1.5 text-white/80 hover:bg-white/10 hover:text-white"
              >
                {label}
              </Link>
            ))}
            <Link href="/" className="rounded-full px-3 py-1.5 text-white/80 hover:bg-white/10">
              Storefront
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">{children}</div>
    </div>
  );
}

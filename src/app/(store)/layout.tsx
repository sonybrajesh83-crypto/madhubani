import { Footer } from "@/components/store/footer";
import { GallerySplash } from "@/components/store/gallerySplash";
import { Navbar } from "@/components/store/navbar";
import { PromoBar } from "@/components/store/promoBar";
import { WhatsappFab } from "@/components/store/whatsappFab";
import { getCurrentUser } from "@/lib/auth";

export default async function StoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <GallerySplash />
      <PromoBar />
      <Navbar userName={user?.name} isAdmin={user?.role === "ADMIN"} />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsappFab />
    </div>
  );
}

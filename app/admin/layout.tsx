import Providers from "@/components/Providers";
import AdminNav from "@/components/AdminNav";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-[80vh] bg-slate-100">
        <AdminNav />
        <div className="mx-auto max-w-5xl px-4 py-8">{children}</div>
      </div>
    </Providers>
  );
}

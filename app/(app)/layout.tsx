import BottomNav from "@/components/BottomNav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-20 bg-[#f3b9d1]">
      {children}
      <BottomNav />
    </div>
  );
}

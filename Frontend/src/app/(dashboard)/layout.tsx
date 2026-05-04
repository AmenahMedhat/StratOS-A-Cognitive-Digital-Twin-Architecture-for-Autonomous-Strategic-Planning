import { Sidebar } from "@/components/layout/Sidebar";
import { FloatingAssistant } from "@/components/shared/FloatingAssistant";
import { Providers } from "./Providers";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
        <FloatingAssistant />
      </div>
    </Providers>
  );
}

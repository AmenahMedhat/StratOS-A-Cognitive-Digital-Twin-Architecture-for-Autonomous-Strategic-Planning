import { Header } from "@/components/layout/Header";

export default function NotificationsPage() {
  return (
    <div className="flex min-h-full flex-col">
      <Header title="Notifications" subtitle="System alerts and updates" />
      <div className="flex flex-1 items-center justify-center text-sm text-slate-600">
        No new notifications
      </div>
    </div>
  );
}

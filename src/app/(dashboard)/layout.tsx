import TopNav from "@/components/layout/TopNav";
import Sidebar from "@/components/layout/Sidebar";
import PageTransition from "@/components/layout/PageTransition";
import ProtectedRoute from "@/components/layout/ProtectedRoute";
import GlobalCopilotModal from "@/components/ui/GlobalCopilotModal";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <TopNav />
      <Sidebar />
      <PageTransition>{children}</PageTransition>
      <GlobalCopilotModal />
    </ProtectedRoute>
  );
}

import AdminDashboardPage from "@/components/Admin/Pages/AdminDashboardPage/AdminDashboardPage";
import { getDashboardContent } from "@/lib/services/admin/dashboardServices";

export default async function AdminDashboard() {
  const dashboardData = await getDashboardContent();
  return (
    <AdminDashboardPage
    dashboardData={dashboardData}
    />
  );
}

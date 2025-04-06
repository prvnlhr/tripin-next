import AdminDashboardPage from "@/components/Admin/Pages/AdminDashboardPage/AdminDashboardPage";
import { getDashboardContent } from "@/lib/services/admin/adminServices";

export default async function AdminDashboard() {
  let dashboardData;

  try {
    dashboardData = await getDashboardContent();
  } catch (error) {
    console.error("Failed to fetch dashboard content:", error);
    dashboardData = {
      unverifiedDrivers: [],
      verifiedDrivers: [],
    };
  }

  return <AdminDashboardPage dashboardData={dashboardData} />;
}

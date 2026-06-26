import DashboardProfilePage from "@/components/dashboard/DashboardProfilePage";

export default function AdminProfilePage() {
  return <DashboardProfilePage apiPath="/api/admin/profile" roleLabel="admin" />;
}

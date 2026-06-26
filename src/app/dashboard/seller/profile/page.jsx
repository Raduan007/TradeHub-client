import DashboardProfilePage from "@/components/dashboard/DashboardProfilePage";

export default function SellerProfilePage() {
  return <DashboardProfilePage apiPath="/api/seller/profile" roleLabel="seller" />;
}

import { redirect } from "next/navigation";

export default function OrdersPage() {
  redirect("/auth/signin?callbackUrl=/dashboard/buyer/orders");
}

import { redirect } from "next/navigation";

export default function OrdersPage() {
  redirect("/login?callbackUrl=/dashboard/buyer/orders");
}

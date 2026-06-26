import { Suspense } from "react";
import CheckoutPage from "./CheckoutClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="px-6 py-10">Loading checkout...</div>}>
      <CheckoutPage />
    </Suspense>
  );
}

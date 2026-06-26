import { Chip } from "@heroui/react";

import { PAYMENT_STATUS_LABELS } from "@/lib/constants/buyer";

const STATUS_COLORS = {
  pending: "warning",
  completed: "success",
  failed: "danger",
  refunded: "default",
};

export default function PaymentStatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || "pending";

  return (
    <Chip
      size="sm"
      color={STATUS_COLORS[normalizedStatus] || "default"}
      variant="soft"
    >
      {PAYMENT_STATUS_LABELS[normalizedStatus] || status}
    </Chip>
  );
}

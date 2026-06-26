import { Chip } from "@heroui/react";

import { ORDER_STATUS_LABELS } from "@/lib/constants/buyer";

const STATUS_COLORS = {
  pending: "warning",
  processing: "accent",
  shipped: "accent",
  delivered: "success",
  cancelled: "danger",
};

export default function OrderStatusBadge({ status }) {
  const normalizedStatus = status?.toLowerCase() || "pending";

  return (
    <Chip
      size="sm"
      color={STATUS_COLORS[normalizedStatus] || "default"}
      variant="soft"
    >
      {ORDER_STATUS_LABELS[normalizedStatus] || status}
    </Chip>
  );
}

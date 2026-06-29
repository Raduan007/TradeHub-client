import { Alert, Button } from "@heroui/react";

export default function BuyerErrorState({ title, message, onRetry }) {
  return (
    <Alert color="danger" title={title || "Something went wrong"}>
      <div className="space-y-3">
        <p>{message}</p>
        {onRetry ? (
          <Button size="sm" color="danger" variant="bordered" onPress={onRetry}>
            Try again
          </Button>
        ) : null}
      </div>
    </Alert>
  );
}

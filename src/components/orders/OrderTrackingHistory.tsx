
import { OrderTracking } from "@/types/database.types";
import { OrderStatusBadge } from "../admin/OrderStatusBadge";

interface OrderTrackingHistoryProps {
  tracking: OrderTracking[];
  formatDate: (date: string) => string;
}

export const OrderTrackingHistory = ({ tracking, formatDate }: OrderTrackingHistoryProps) => {
  if (!tracking || tracking.length === 0) {
    return <p className="text-gray-500 text-sm">No tracking updates available.</p>;
  }

  return (
    <div className="space-y-4">
      {tracking.map((track) => (
        <div key={track.id} className="border-l-2 border-blue-500 pl-4 py-1">
          <p className="text-sm font-medium">
            Status: <span className="inline-block ml-1">
              <OrderStatusBadge status={track.status} />
            </span>
          </p>
          {track.status_description && (
            <p className="text-sm text-gray-600 mt-1">{track.status_description}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {formatDate(track.created_at)}
          </p>
        </div>
      ))}
    </div>
  );
};

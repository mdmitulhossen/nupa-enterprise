import { cn } from "@/lib/utils";

type StatusType =
  | "out_for_delivery"
  | "processing"
  | "delivered"
  | "ready_for_dispatch"
  | "order_confirmed"
  | "payment_received"
  | "pending"
  | "failed"
  | "received"
  | "paid"
  | "buy_online"
  | "quote_only"
  | "in_stock"
  | "out_of_stock"
  | "new"
  | "in_review"
  | "quoted"
  | "approved"
  | "converted"
  // API uppercase product statuses
  | "IN_STOCK"
  | "OUT_OF_STOCK"
  | "UPCOMING"
  | "BUY_ONLINE"
  | "QUOTATION";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; className: string }> = {
  out_for_delivery: {
    label: "Out for Delivery",
    className: "bg-blue-100 text-blue-600",
  },
  processing: {
    label: "Processing",
    className: "bg-yellow-100 text-yellow-600",
  },
  delivered: {
    label: "Delivered",
    className: "bg-green-100 text-green-600",
  },
  ready_for_dispatch: {
    label: "Ready for Dispatch",
    className: "bg-purple-100 text-purple-600",
  },
  order_confirmed: {
    label: "Order Confirmed",
    className: "bg-pink-100 text-pink-600",
  },
  payment_received: {
    label: "Payment Received",
    className: "bg-green-100 text-green-600",
  },
  pending: {
    label: "Pending",
    className: "bg-orange-100 text-orange-600",
  },
  failed: {
    label: "Failed",
    className: "bg-red-100 text-red-600",
  },
  received: {
    label: "Received",
    className: "bg-green-100 text-green-600",
  },
  paid: {
    label: "Paid",
    className: "bg-green-100 text-green-600",
  },
  buy_online: {
    label: "Buy Online",
    className: "bg-blue-100 text-blue-600",
  },
  quote_only: {
    label: "Quote Only",
    className: "bg-purple-100 text-purple-600",
  },
  in_stock: {
    label: "In Stock",
    className: "bg-green-100 text-green-600",
  },
  out_of_stock: {
    label: "Out of Stock",
    className: "bg-red-100 text-red-600",
  },
  new: {
    label: "New",
    className: "bg-blue-100 text-blue-600",
  },
  in_review: {
    label: "In Review",
    className: "bg-yellow-100 text-yellow-600",
  },
  quoted: {
    label: "Quoted",
    className: "bg-purple-100 text-purple-600",
  },
  approved: {
    label: "Approved",
    className: "bg-green-100 text-green-600",
  },
  converted: {
    label: "Converted to Order",
    className: "bg-primary/10 text-primary",
  },
  IN_STOCK: {
    label: "In Stock",
    className: "bg-green-100 text-green-600",
  },
  OUT_OF_STOCK: {
    label: "Out of Stock",
    className: "bg-red-100 text-red-600",
  },
  UPCOMING: {
    label: "Upcoming",
    className: "bg-yellow-100 text-yellow-600",
  },
  BUY_ONLINE: {
    label: "Buy Online",
    className: "bg-blue-100 text-blue-600",
  },
  QUOTATION: {
    label: "Quotation",
    className: "bg-purple-100 text-purple-600",
  },
};

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];

  if (!config) {
    return (
      <span className={cn("inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600", className)}>
        {status}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
};

export default StatusBadge;

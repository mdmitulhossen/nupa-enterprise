import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import EmptyState from "@/components/layout/EmptyState";
import MainLayout from "@/components/layout/MainLayout";
import CancelOrderModal from "@/components/modal/CancelOrderModal";
import CreateRatingModal from "@/components/modal/CreateRatingModal";
import OrderDetailsModal from "@/components/modal/OrderDetailsModal";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFetchCms } from "@/services/CMSService";
import {
  Order,
  OrderStatus,
  PaymentMethod,
  useCancelOrder,
  useFetchMyOrders,
} from "@/services/orderService";
import { format } from "date-fns";
import {
  ClipboardList,
  History,
  Mail,
  Package,
  PackageOpen,
  Phone,
  Star,
  XCircle,
} from "lucide-react";
import { useState } from "react";

// ─── helpers ──────────────────────────────────────────────────────────────────

const ONGOING_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
  OrderStatus.PROCESSING,
  OrderStatus.SHIPPED,
];

const CANCELLABLE_STATUSES: OrderStatus[] = [
  OrderStatus.PENDING,
  OrderStatus.CONFIRMED,
];

const orderStatusBadge: Record<OrderStatus, { label: string; className: string }> = {
  [OrderStatus.PENDING]:    { label: "⏳ Pending",    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30" },
  [OrderStatus.CONFIRMED]:  { label: "✅ Confirmed",  className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30" },
  [OrderStatus.PROCESSING]: { label: "🔄 Processing", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30" },
  [OrderStatus.SHIPPED]:    { label: "🚚 Shipped",    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30" },
  [OrderStatus.DELIVERED]:  { label: "✓ Delivered",   className: "bg-green-100 text-green-800 dark:bg-green-900/30" },
  [OrderStatus.CANCELLED]:  { label: "✕ Cancelled",   className: "bg-red-100 text-red-800 dark:bg-red-900/30" },
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.SEND_MONEY]: "bKash",
  [PaymentMethod.COD]:        "Cash on Delivery",
};

type TabKey = "ongoing" | "history";

// ─── Loading skeleton ─────────────────────────────────────────────────────────

const OrderSkeleton = () => (
  <div className="border border-border rounded-xl p-6 space-y-4">
    <div className="flex justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-7 w-24 rounded-full" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="w-10 h-10 rounded-lg" />
      <Skeleton className="w-10 h-10 rounded-lg" />
      <Skeleton className="w-10 h-10 rounded-lg" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-8 w-28 rounded-lg" />
      <Skeleton className="h-8 w-28 rounded-lg" />
      <Skeleton className="h-8 w-36 rounded-lg" />
    </div>
  </div>
);

// ─── Cancel state type ────────────────────────────────────────────────────────

interface CancelState {
  order: Order;
  reason: string;
}

// ─── Order Row Card ───────────────────────────────────────────────────────────

const OrderRow = ({
  order,
  onViewDetails,
  onCancelRequest,
  onLeaveFeedback,
}: {
  order: Order;
  onViewDetails: (order: Order) => void;
  onCancelRequest: (order: Order) => void;
  onLeaveFeedback: (order: Order) => void;
}) => {
  const badge = orderStatusBadge[order.orderStatus];
  const isOngoing = ONGOING_STATUSES.includes(order.orderStatus);
  const isCancellable = CANCELLABLE_STATUSES.includes(order.orderStatus);

  const { data: cmsResp } = useFetchCms(true);
const phone = cmsResp?.data?.contactInfo?.phone ?? "+8801739748268";
const email = cmsResp?.data?.contactInfo?.email ?? "sales@nupaenterprise.com";


  return (
    <div className="border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all">
      {/* Top row — order meta + status badge */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
        <div className="space-y-1">
          <p className="font-semibold text-sm">{order.order_id}</p>
          <p className="text-sm text-muted-foreground">
            {order.orderItems.length} item{order.orderItems.length > 1 ? "s" : ""}{" "}
            ·{" "}
            <span className="font-semibold text-foreground">
              BDT {order.totalAmount.toLocaleString()}
            </span>
          </p>
          <p className="text-xs text-muted-foreground">
            {paymentMethodLabel[order.paymentMethod]}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isCancellable && (
            <button
              onClick={() => onCancelRequest(order)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${badge.className}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Product image previews */}
      <div className="flex -space-x-2 mb-4">
        {order.orderItems.slice(0, 5).map((item) => (
          <img
            key={item.id}
            src={item.product.mainProductImage}
            alt={item.product.name}
            title={item.product.name}
            className="w-10 h-10 rounded-lg object-cover border-2 border-background ring-1 ring-border"
          />
        ))}
        {order.orderItems.length > 5 && (
          <div className="w-10 h-10 rounded-lg bg-muted border-2 border-background flex items-center justify-center text-xs font-medium text-muted-foreground">
            +{order.orderItems.length - 5}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-border/60 my-3" />

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {isOngoing && (
          <>
     <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8" asChild>
  <a href={`tel:${phone}`}>
    <Phone className="w-3.5 h-3.5" />
    Call Support
  </a>
</Button>

<Button variant="default" size="sm" className="gap-1.5 text-xs h-8" asChild>
  <a href={`mailto:${email}`}>
    <Mail className="w-3.5 h-3.5" />
    Email Support
  </a>
</Button>
          </>
        )}
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8"
          onClick={() => onViewDetails(order)}
        >
          📄 View Details
        </Button>
       <Button
          variant="outline"
          size="sm"
          className="gap-1.5 text-xs h-8 bg-yellow-600"
          onClick={() => onLeaveFeedback?.(order)}
        >
          <Star className="w-3.5 h-3.5" />
         Leave Feedback
        </Button>
      </div>
    </div>
  );
};

// ─── Tab sidebar item ─────────────────────────────────────────────────────────

const TabItem = ({
  active,
  onClick,
  icon: Icon,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  label: string;
  count: number;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all text-left",
      active
        ? "bg-primary text-primary-foreground shadow-sm"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    )}
  >
    <Icon className="w-4 h-4 flex-shrink-0" />
    <span className="flex-1">{label}</span>
    <span
      className={cn(
        "text-xs px-2 py-0.5 rounded-full font-semibold",
        active
          ? "bg-white/20 text-primary-foreground"
          : "bg-muted-foreground/15 text-muted-foreground"
      )}
    >
      {count}
    </span>
  </button>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const TrackOrder = () => {
  const [page] = useState(1);
  const [activeTab, setActiveTab] = useState<TabKey>("ongoing");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [cancelModalOrder, setCancelModalOrder] = useState<Order | null>(null);
  const [pendingCancel, setPendingCancel] = useState<CancelState | null>(null);
  const [ratingProduct, setRatingProduct] = useState<{ id: string; name?: string } | null>(null);

  const { data, isLoading } = useFetchMyOrders({ page, limit: 50 });
  const cancelMutation = useCancelOrder();

  const orders = data?.data ?? [];
  const ongoingOrders = orders.filter((o) => ONGOING_STATUSES.includes(o.orderStatus));
  const completedOrders = orders.filter(
    (o) =>
      o.orderStatus === OrderStatus.DELIVERED ||
      o.orderStatus === OrderStatus.CANCELLED
  );

  const handleCancelRequest = (order: Order) => setCancelModalOrder(order);

  const handleReasonSubmit = (reason: string) => {
    if (!cancelModalOrder) return;
    setPendingCancel({ order: cancelModalOrder, reason });
    setCancelModalOrder(null);
  };

    const handleLeaveFeedback = (order: Order) => {
    const firstItem = order.orderItems?.[0];
    if (!firstItem) return;
    setRatingProduct({ id: firstItem.product.id, name: firstItem.product.name });
  };

  const handleConfirmCancel = async () => {
    if (!pendingCancel) return;
    try {
      await cancelMutation.mutateAsync({
        id: pendingCancel.order.id,
        payload: { reason: pendingCancel.reason },
      });
    } finally {
      setPendingCancel(null);
    }
  };

  const activeOrders = activeTab === "ongoing" ? ongoingOrders : completedOrders;

  return (
    <MainLayout>
      <PageBanner
        title="Track Order"
        subtitle="Stay Updated on Your Storage Solution"
      />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "Track your Order" }]} />
      </div>

      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">

            {/* ── LEFT: Tab Sidebar ── */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="border border-border rounded-2xl p-3 space-y-1.5 sticky top-20">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1">
                  My Orders
                </p>
                <TabItem
                  active={activeTab === "ongoing"}
                  onClick={() => setActiveTab("ongoing")}
                  icon={Package}
                  label="Ongoing Orders"
                  count={isLoading ? 0 : ongoingOrders.length}
                />
                <TabItem
                  active={activeTab === "history"}
                  onClick={() => setActiveTab("history")}
                  icon={History}
                  label="Order History"
                  count={isLoading ? 0 : completedOrders.length}
                />

                {/* Summary card */}
                <div className="mt-3 pt-3 border-t border-border/60 px-2 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total Orders</span>
                    <span className="font-semibold text-foreground">{orders.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Active</span>
                    <span className="font-semibold text-amber-600">{ongoingOrders.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Completed</span>
                    <span className="font-semibold text-green-600">
                      {orders.filter((o) => o.orderStatus === OrderStatus.DELIVERED).length}
                    </span>
                  </div>
                </div>
              </div>
            </aside>

            {/* ── RIGHT: Order List ── */}
            <div className="flex-1 min-w-0">
              {/* Section header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  {activeTab === "ongoing"
                    ? <Package className="w-4 h-4 text-primary" />
                    : <History className="w-4 h-4 text-primary" />
                  }
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">
                    {activeTab === "ongoing" ? "Ongoing Orders" : "Order History"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {activeTab === "ongoing"
                      ? "Track your active and in-progress orders"
                      : "Your delivered and cancelled orders"}
                  </p>
                </div>
              </div>

              {/* Content */}
              {isLoading ? (
                <div className="space-y-4">
                  <OrderSkeleton />
                  <OrderSkeleton />
                  <OrderSkeleton />
                </div>
              ) : activeOrders.length === 0 ? (
                <div className="border border-border rounded-2xl">
                  <EmptyState
                    icon={activeTab === "ongoing" ? PackageOpen : ClipboardList}
                    title={
                      activeTab === "ongoing"
                        ? "No Ongoing Orders"
                        : "No Order History"
                    }
                    description={
                      activeTab === "ongoing"
                        ? "You don't have any active orders right now. Start shopping to place a new order."
                        : "Your completed and cancelled orders will appear here."
                    }
                    actionLabel={activeTab === "ongoing" ? "Browse Products" : undefined}
                    actionHref={activeTab === "ongoing" ? "/products" : undefined}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                {activeOrders.map((order) => (
                    <OrderRow
                      key={order.id}
                      order={order}
                      onViewDetails={setSelectedOrder}
                      onCancelRequest={handleCancelRequest}
                      onLeaveFeedback={handleLeaveFeedback}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>

      <CTASection />

      {/* ── Order Details Modal ── */}
      <OrderDetailsModal
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        order={selectedOrder}
      />

      {/* ── Step 1: Cancel Reason Modal ── */}
      <CancelOrderModal
        isOpen={!!cancelModalOrder}
        onClose={() => setCancelModalOrder(null)}
        orderId={cancelModalOrder?.id ?? ""}
        orderDisplayId={cancelModalOrder?.order_id ?? ""}
        onConfirmCancel={handleReasonSubmit}
      />

      {/* ── Step 2: Confirmation Dialog ── */}
      <DeleteConfirmationDialog
        isOpen={!!pendingCancel}
        onConfirm={handleConfirmCancel}
        onCancel={() => setPendingCancel(null)}
        title="Confirm Order Cancellation"
        description={`Are you sure you want to cancel order #${pendingCancel?.order.order_id}? This action cannot be undone.`}
        confirmText="Yes, Cancel Order"
        cancelText="Go Back"
        isLoading={cancelMutation.isPending}
      />

{/* create rating modal */}
      <CreateRatingModal
        isOpen={!!ratingProduct}
        onClose={() => setRatingProduct(null)}
        productId={ratingProduct?.id}
        productName={ratingProduct?.name}
      />
    </MainLayout>
  );
};

export default TrackOrder;
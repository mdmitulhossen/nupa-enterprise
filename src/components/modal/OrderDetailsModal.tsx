import { Order, OrderStatus, PaymentMethod, PaymentStatus } from "@/services/orderService";
import { format } from "date-fns";
import { CreditCard, MapPin, Package, X } from "lucide-react";

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const statusColorMap: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]:    "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
  [OrderStatus.CONFIRMED]:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30",
  [OrderStatus.PROCESSING]: "bg-purple-100 text-purple-700 dark:bg-purple-900/30",
  [OrderStatus.SHIPPED]:    "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30",
  [OrderStatus.DELIVERED]:  "bg-green-100 text-green-700 dark:bg-green-900/30",
  [OrderStatus.CANCELLED]:  "bg-red-100 text-red-700 dark:bg-red-900/30",
};

const paymentStatusColorMap: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "bg-amber-100 text-amber-700 dark:bg-amber-900/30",
  [PaymentStatus.PAID]:    "bg-green-100 text-green-700 dark:bg-green-900/30",
  [PaymentStatus.FAILED]:  "bg-red-100 text-red-700 dark:bg-red-900/30",
};

const paymentMethodLabel: Record<PaymentMethod, string> = {
  [PaymentMethod.SEND_MONEY]: "bKash (Send Money)",
  [PaymentMethod.COD]:        "Cash on Delivery",
};

const OrderDetailsModal = ({ isOpen, onClose, order }: OrderDetailsModalProps) => {
  if (!isOpen || !order) return null;

  const subtotal = order.orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = order.totalAmount - subtotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-background border border-border rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-semibold">Order Details</h2>
            <p className="text-sm text-muted-foreground mt-0.5">#{order.order_id}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status row */}
          <div className="flex flex-wrap gap-2">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColorMap[order.orderStatus]}`}>
              Order: {order.orderStatus}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${paymentStatusColorMap[order.paymentStatus]}`}>
              Payment: {order.paymentStatus}
            </span>
          </div>

          {/* Order Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Package className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Items Ordered</h3>
            </div>
            <div className="border border-border rounded-xl overflow-hidden">
              {order.orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border-b border-border last:border-b-0"
                >
                  <img
                    src={item.product.mainProductImage}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-lg object-cover border border-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {item.variationDetails.sku}</p>
                    <p className="text-xs text-muted-foreground">
                      BDT {item.price.toLocaleString()} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-semibold text-sm flex-shrink-0">
                    BDT {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="border border-border rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal</span>
              <span>BDT {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping</span>
              <span>{shipping === 0 ? "Free" : `BDT ${shipping.toLocaleString()}`}</span>
            </div>
            <div className="flex justify-between font-bold text-base border-t border-border pt-2">
              <span>Total</span>
              <span>BDT {order.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment & Date info */}
          <div className="border border-border rounded-xl p-4 space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Payment Info</h3>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Method</span>
              <span className="font-medium">{paymentMethodLabel[order.paymentMethod]}</span>
            </div>
            {order.accountInfo && (
              <>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">bKash Number</span>
                  <span className="font-medium">{order.accountInfo.accountNumber}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-medium font-mono">{order.accountInfo.transactionId}</span>
                </div>
              </>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Date</span>
              <span className="font-medium">
                {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="border border-border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="font-semibold text-sm">Shipping Address</h3>
            </div>
            <p className="text-sm font-medium">{order.shippingAddress.fullName}</p>
            <p className="text-sm text-muted-foreground">{order.shippingAddress.phone}</p>
            <p className="text-sm text-muted-foreground">
              {[
                order.shippingAddress.addressLine1,
                order.shippingAddress.addressLine2,
                order.shippingAddress.thana,
                order.shippingAddress.district,
                order.shippingAddress.division,
                order.shippingAddress.postalCode,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>
            {order.shippingAddress.deliveryNote && (
              <p className="text-xs text-muted-foreground mt-1 italic">
                Note: {order.shippingAddress.deliveryNote}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
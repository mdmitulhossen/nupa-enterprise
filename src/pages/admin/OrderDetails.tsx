/* eslint-disable no-empty */
/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminLayout from "@/components/admin/AdminLayout";
import StatusBadge from "@/components/admin/StatusBadge";
import { Button } from "@/components/ui/button";
import { Order, OrderStatus, PaymentStatus, useFetchOrder, useUpdateOrderStatus, useVerifyPayment } from "@/services/orderService";
import { format } from "date-fns";
import { ArrowLeft, CheckCircle, Download, Mail, Phone, X as XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useFetchOrder(id);
  const order = data?.data as Order | undefined;

  const updateStatus = useUpdateOrderStatus();
  const verifyPayment = useVerifyPayment();

  const [showScreenshot, setShowScreenshot] = useState(false);

  useEffect(() => {
    // optional: handle not found / redirect
  }, [order]);

  if (isLoading || !order) {
    return (
      <AdminLayout>
        <div className="p-6">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <button
        onClick={() => navigate("/admin/orders")}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Orders
      </button>

      <div className="bg-background rounded-xl border border-border p-6 mb-4">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Order {order.order_id}</h2>
            <p className="text-sm text-muted-foreground">
              {format(new Date(order.createdAt), "dd MMM yyyy, hh:mm a")}
            </p>
            <p className="mt-2 text-sm">
              <span className="text-muted-foreground">Customer:</span>{" "}
              <span className="font-medium">{order.user.firstName} {order.user.lastName}</span>
            </p>
            <p className="text-sm"><span className="text-muted-foreground">Phone:</span> {order.user.phoneNumber}</p>
            <p className="text-sm"><span className="text-muted-foreground">Email:</span> {order.user.email}</p>
          </div>

          <div className="space-y-2 text-right">
            <div>
              <p className="text-xs text-muted-foreground">Order Status</p>
              <div className="flex items-center gap-2">
                <StatusBadge status={order.orderStatus as any} />
                <select
                  defaultValue={order.orderStatus}
                  className="px-2 py-1 border border-border rounded"
                  onChange={async (e) => {
                    const s = e.target.value as OrderStatus;
                    try {
                      await updateStatus.mutateAsync({ id: order.id, payload: { status: s } });
                    } catch {}
                  }}
                >
                  {Object.values(OrderStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Payment Status</p>
              <div className="flex items-center gap-2 justify-end">
                <StatusBadge status={order.paymentStatus as any} />
                {order.accountInfo && (
                  <>
                    <Button size="sm" variant="ghost" onClick={() => setShowScreenshot(true)}>
                      View Payment
                    </Button>
                    <Button
                      size="sm"
                      onClick={async () => {
                        try {
                          await verifyPayment.mutateAsync({ id: order.id, payload: { status: PaymentStatus.PAID } });
                        } catch {}
                      }}
                      disabled={verifyPayment.isPending}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" /> Verify
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-background rounded-xl border border-border p-6 mb-4">
        <h3 className="font-semibold mb-3">Items</h3>
        <div className="space-y-3">
          {order.orderItems.map((it) => (
            <div key={it.id} className="flex items-center gap-4 border border-border rounded p-3">
              <img src={it.product.mainProductImage} alt={it.product.name} className="w-16 h-16 object-cover rounded" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{it.product.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {it.product.p_id}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">BDT {it.price.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">x{it.quantity}</p>
                  </div>
                </div>
                {it.variationDetails && (
                  <p className="text-xs text-muted-foreground mt-2">
                    {`Size: ${it.variationDetails.depth} x ${it.variationDetails.width} x ${it.variationDetails.height}`}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Shipping */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-background rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-3">Pricing</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>BDT {order.totalAmount.toLocaleString()}</span></div>
            <div className="flex justify-between"><span>Payment Method</span><span>{order.paymentMethod}</span></div>
          </div>
        </div>

  <div className="bg-background rounded-xl border border-border p-6">
          <h3 className="font-semibold mb-3">Shipping Address</h3>
          <div className="text-sm space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-foreground">{order.shippingAddress.fullName}</p>
                <p className="text-muted-foreground text-xs">{order.shippingAddress.addressLine1}</p>
                {order.shippingAddress.addressLine2 && (
                  <p className="text-muted-foreground text-xs">{order.shippingAddress.addressLine2}</p>
                )}
                <p className="text-sm mt-1">
                  {order.shippingAddress.thana}, {order.shippingAddress.district}, {order.shippingAddress.division}
                </p>
                {order.shippingAddress.postalCode && (
                  <p className="text-sm text-muted-foreground">Postal: {order.shippingAddress.postalCode}</p>
                )}
              </div>

              <div className="text-right">
                {order.shippingAddress.phone && (
                  <a
                    href={`tel:${order.shippingAddress.phone}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                  >
                    <Phone className="w-4 h-4" />
                    <span className="font-medium text-foreground">{order.shippingAddress.phone}</span>
                  </a>
                )}

                {order.shippingAddress.email && (
                  <a
                    href={`mailto:${order.shippingAddress.email}`}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span className="font-medium text-foreground">{order.shippingAddress.email}</span>
                  </a>
                )}
              </div>
            </div>

            {order.shippingAddress.deliveryNote && (
              <div className="bg-muted/40 rounded-lg p-3 border border-border/60">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Delivery Note
                </p>
                <p className="text-sm text-muted-foreground">{order.shippingAddress.deliveryNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" size="icon"><Download className="w-4 h-4" /></Button>
        <Button onClick={() => navigate("/admin/orders")}>Back</Button>
      </div>

      {/* Payment screenshot/lightbox */}
      {showScreenshot && order.accountInfo?.transactionScreenshot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowScreenshot(false)} />
          <div className="relative bg-background border border-border rounded-xl p-4 z-10 max-w-3xl w-full max-h-[calc(100dvh-2rem)]">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Transaction Screenshot</h4>
              <button onClick={() => setShowScreenshot(false)} className="text-muted-foreground"><XIcon className="w-4 h-4" /></button>
            </div>
            <img src={order.accountInfo.transactionScreenshot} alt="txn" className="w-full object-contain rounded" />
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default OrderDetails;
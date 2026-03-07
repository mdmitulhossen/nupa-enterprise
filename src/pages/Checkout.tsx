import MainLayout from "@/components/layout/MainLayout";
import BkashPaymentModal from "@/components/modal/BkashPaymentModal";
import OrderSuccessModal from "@/components/modal/OrderSuccessModal";
import ShippingAddressModal from "@/components/orders/ShippingAddressModal";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import { Button } from "@/components/ui/button";
import {
  CreateOrderPayload,
  PaymentMethod,
  useCreateOrder,
} from "@/services/orderService";
import { useCartStore } from "@/store/cartStore";
import { useShippingStore } from "@/store/shippingStore";
import { Banknote, MapPin, Package, Pencil, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const paymentMethods = [
  { id: "bkash", label: "bKash", description: "Send Money via bKash" },
  { id: "cod", label: "Cash On Delivery", description: "Pay when you receive" },
];

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCartStore();
  const { address } = useShippingStore();
  const createOrderMutation = useCreateOrder();

  const [selectedPayment, setSelectedPayment] = useState("bkash");
  const [bkashModalOpen, setBkashModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [editAddressOpen, setEditAddressOpen] = useState(false);
  const [placedPaymentMethod, setPlacedPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.SEND_MONEY
  );

  const subtotal = totalPrice();
  const shipping = subtotal >= 50000 ? 0 : subtotal > 0 ? 500 : 0;
  const total = subtotal + shipping;

  const handlePlaceOrder = async () => {
    if (selectedPayment === "bkash") {
      setBkashModalOpen(true);
      return;
    }

    // ── COD flow ──────────────────────────────────────────────
    if (!address) {
      toast.error("Please add a shipping address");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const payload: CreateOrderPayload = {
      orderItems: items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: Number(item.price),
        variationDetails: {
          sku: item.sku,
          price: Number(item.price),
          stock: item.stock,
          depth: item.depth ?? 0,
          width: item.width ?? 0,
          height: item.height ?? 0,
        },
      })),
      totalAmount: total,
      paymentMethod: PaymentMethod.COD,
      shippingAddress: address,
      // accountInfo is null/undefined for COD
    };

    try {
      await createOrderMutation.mutateAsync(payload);
      clearCart();
      setPlacedPaymentMethod(PaymentMethod.COD);
      setSuccessModalOpen(true);
    } catch {
      // error toast already handled in useCreateOrder onError
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-6">
        <Breadcrumb
          items={[
            { label: "Cart", path: "/cart" },
            { label: "Checkout" },
          ]}
        />
      </div>

      <div className="container mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">

          {/* LEFT — Order Summary */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Cart Items */}
            <div className="border border-border rounded-xl overflow-hidden mb-6">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border-b border-border last:border-b-0"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-14 h-14 rounded-lg object-cover border border-border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">SKU: {item.sku}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-sm flex-shrink-0">
                    BDT {(Number(item.price) * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="border border-border rounded-xl p-5 space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">BDT {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? "Free" : `BDT ${shipping.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-base border-t border-border pt-3">
                <span>Total</span>
                <span>BDT {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Shipping Address */}
            {address && (
              <div className="border border-border rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-medium text-sm">Shipping Address</span>
                  </div>
                  <button
                    onClick={() => setEditAddressOpen(true)}
                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                  >
                    <Pencil className="w-3 h-3" /> Edit
                  </button>
                </div>
                <p className="text-sm font-medium">{address.fullName}</p>
                <p className="text-sm text-muted-foreground">{address.phone}</p>
                <p className="text-sm text-muted-foreground">
                  {[address.addressLine1, address.addressLine2, address.thana, address.district, address.division]
                    .filter(Boolean)
                    .join(", ")}
                </p>
                {address.deliveryNote && (
                  <p className="text-xs text-muted-foreground mt-1 italic">
                    Note: {address.deliveryNote}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* RIGHT — Payment */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Payment Method</h2>

            <div className="space-y-3 mb-8">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  onClick={() => setSelectedPayment(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    selectedPayment === method.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-muted-foreground/30"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      method.id === "bkash" ? "bg-[#E2136E]/10" : "bg-muted"
                    }`}
                  >
                    {method.id === "bkash" ? (
                      <Smartphone className="w-5 h-5 text-[#E2136E]" />
                    ) : (
                      <Banknote className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{method.label}</p>
                    <p className="text-xs text-muted-foreground">{method.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      selectedPayment === method.id
                        ? "border-primary"
                        : "border-muted-foreground/30"
                    }`}
                  >
                    {selectedPayment === method.id && (
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {selectedPayment === "cod" && (
              <div className="bg-muted rounded-xl p-4 mb-6 flex items-start gap-3">
                <Package className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Pay in cash when your order is delivered to your doorstep. No advance payment required.
                </p>
              </div>
            )}

            {selectedPayment === "bkash" && (
              <div className="bg-[#E2136E]/5 border border-[#E2136E]/20 rounded-xl p-4 mb-6 flex items-start gap-3">
                <Smartphone className="w-5 h-5 text-[#E2136E] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-muted-foreground">
                  You will be asked to enter your bKash transaction details after clicking the button below.
                </p>
              </div>
            )}

            <Button
              className={`w-full ${
                selectedPayment === "bkash"
                  ? "bg-[#E2136E] hover:bg-[#E2136E]/90 text-white"
                  : ""
              }`}
              size="lg"
              onClick={handlePlaceOrder}
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending
                ? "Placing Order..."
                : selectedPayment === "bkash"
                ? "Continue to bKash Payment"
                : "Confirm Order"}
            </Button>
          </div>
        </div>
      </div>

      <CTASection />

      <ShippingAddressModal
        isOpen={editAddressOpen}
        onClose={() => setEditAddressOpen(false)}
        // redirectOnSubmit={false}
      />

      <BkashPaymentModal
        isOpen={bkashModalOpen}
        onClose={() => setBkashModalOpen(false)}
        totalAmount={total}
        onSuccess={() => {
          setPlacedPaymentMethod(PaymentMethod.SEND_MONEY);
          setSuccessModalOpen(true);
        }}
      />

      <OrderSuccessModal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        paymentMethod={placedPaymentMethod}
      />
    </MainLayout>
  );
};

export default Checkout;
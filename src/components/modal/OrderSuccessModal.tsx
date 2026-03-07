import { Button } from "@/components/ui/button";
import { PaymentMethod } from "@/services/orderService";
import { CheckCircle2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod?: PaymentMethod;
}

const OrderSuccessModal = ({ isOpen, onClose, paymentMethod }: OrderSuccessModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const isBkash = paymentMethod === PaymentMethod.SEND_MONEY;
  const paymentLabel = isBkash ? "bKash (Send Money)" : "Cash on Delivery";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-background border border-border rounded-2xl w-full max-w-md shadow-xl z-10 overflow-hidden">
        {/* Top accent bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/80 to-primary/60" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8 text-center">
          {/* Animated checkmark */}
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9 text-primary" />
                </div>
              </div>
              <span className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Order Placed!</h2>
          <p className="text-muted-foreground text-sm mb-1">
            Thank you for your order.{" "}
            {isBkash
              ? "We have received your payment information."
              : "Your order has been confirmed."}
          </p>
          <p className="text-muted-foreground text-sm mb-8">
            {isBkash
              ? "Our team will verify your bKash transaction and confirm your order shortly."
              : "Please keep the payment ready when our delivery team arrives."}
          </p>

          {/* Order info card */}
          <div className="border border-dashed border-border rounded-xl p-4 mb-6 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`font-medium px-2 py-0.5 rounded-full text-xs ${
                  isBkash
                    ? "text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                    : "text-green-600 bg-green-50 dark:bg-green-900/20"
                }`}
              >
                {isBkash ? "Pending Verification" : "Confirmed"}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Method</span>
              <span className="font-medium">{paymentLabel}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onClose();
                navigate("/products");
              }}
            >
              Continue Shopping
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onClose();
                navigate("/track-order");
              }}
            >
              Track Order
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessModal;
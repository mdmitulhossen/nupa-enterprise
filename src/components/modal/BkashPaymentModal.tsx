import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

interface BkashFormData {
  senderNumber: string;
  senderName: string;
  transactionId: string;
}

interface BkashPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onSuccess: () => void;
}

const BKASH_NUMBER = "01XXXXXXXXX"; // replace with real bKash number
const inputClass =
  "w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
const errorClass = "text-xs text-destructive mt-1";
const labelClass = "block text-sm font-medium mb-1";

const BkashPaymentModal = ({
  isOpen,
  onClose,
  totalAmount,
  onSuccess,
}: BkashPaymentModalProps) => {
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BkashFormData>({
    defaultValues: { senderNumber: "", senderName: "", transactionId: "" },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = (_data: BkashFormData) => {
    // apatoto no API call — just show success
    reset();
    setScreenshot(null);
    setScreenshotPreview(null);
    onClose();
    onSuccess();
  };

  const handleClose = () => {
    reset();
    setScreenshot(null);
    setScreenshotPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      <div className="relative bg-background border border-border rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            {/* bKash brand color logo placeholder */}
            <div className="w-10 h-10 rounded-full bg-[#E2136E] flex items-center justify-center">
              <span className="text-white font-bold text-xs">bKash</span>
            </div>
            <div>
              <h2 className="font-semibold">bKash Payment</h2>
              <p className="text-xs text-muted-foreground">Send Money & submit details</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* bKash instruction card */}
        <div className="mx-5 mt-5 bg-[#E2136E]/5 border border-[#E2136E]/20 rounded-xl p-4">
          <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
            Payment Instructions
          </p>
          <ol className="text-sm space-y-1.5 text-foreground">
            <li className="flex gap-2">
              <span className="font-bold text-[#E2136E] flex-shrink-0">1.</span>
              Open your bKash app and tap <strong>Send Money</strong>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#E2136E] flex-shrink-0">2.</span>
              Send to bKash number:
              <span className="font-bold text-[#E2136E]">{BKASH_NUMBER}</span>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#E2136E] flex-shrink-0">3.</span>
              Amount: <strong>BDT {totalAmount.toLocaleString()}</strong>
            </li>
            <li className="flex gap-2">
              <span className="font-bold text-[#E2136E] flex-shrink-0">4.</span>
              Take a screenshot and fill the form below
            </li>
          </ol>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          {/* Sender bKash Number */}
          <div>
            <label className={labelClass}>
              Your bKash Number <span className="text-destructive">*</span>
            </label>
            <input
              {...register("senderNumber", {
                required: "bKash number is required",
                pattern: {
                  value: /^(\+?880|0)1[3-9]\d{8}$/,
                  message: "Enter a valid bKash number",
                },
              })}
              placeholder="01XXXXXXXXX"
              className={inputClass}
            />
            {errors.senderNumber && (
              <p className={errorClass}>{errors.senderNumber.message}</p>
            )}
          </div>

          {/* Sender Name */}
          <div>
            <label className={labelClass}>
              Account Holder Name <span className="text-destructive">*</span>
            </label>
            <input
              {...register("senderName", { required: "Name is required" })}
              placeholder="Your full name"
              className={inputClass}
            />
            {errors.senderName && (
              <p className={errorClass}>{errors.senderName.message}</p>
            )}
          </div>

          {/* Transaction ID */}
          <div>
            <label className={labelClass}>
              Transaction ID (TrxID) <span className="text-destructive">*</span>
            </label>
            <input
              {...register("transactionId", {
                required: "Transaction ID is required",
                minLength: { value: 8, message: "Enter a valid TrxID" },
              })}
              placeholder="e.g. ABC1234567"
              className={inputClass}
            />
            {errors.transactionId && (
              <p className={errorClass}>{errors.transactionId.message}</p>
            )}
          </div>

          {/* Transaction Screenshot */}
          <div>
            <label className={labelClass}>
              Transaction Screenshot <span className="text-destructive">*</span>
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {screenshotPreview ? (
              <div className="relative rounded-xl overflow-hidden border border-border">
                <img
                  src={screenshotPreview}
                  alt="Transaction screenshot"
                  className="w-full max-h-48 object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setScreenshot(null);
                    setScreenshotPreview(null);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black/80"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center gap-2 hover:border-primary/40 hover:bg-muted/50 transition-colors"
              >
                <Upload className="w-6 h-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload screenshot
                </span>
                <span className="text-xs text-muted-foreground">PNG, JPG up to 5MB</span>
              </button>
            )}
            {!screenshot && (
              <p className="text-xs text-muted-foreground mt-1">
                Screenshot is required to verify your payment
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" className="flex-1" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#E2136E] hover:bg-[#E2136E]/90 text-white"
              disabled={!screenshot}
            >
              Proceed
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BkashPaymentModal;
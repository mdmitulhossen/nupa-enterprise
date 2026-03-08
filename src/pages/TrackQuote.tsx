import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import EmptyState from "@/components/layout/EmptyState";
import MainLayout from "@/components/layout/MainLayout";
import CancelOrderModal from "@/components/modal/CancelOrderModal";
import Breadcrumb from "@/components/shared/Breadcrumb";
import CTASection from "@/components/shared/CTASection";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { useFetchCms } from "@/services/CMSService";
import { AccountInfo } from "@/services/orderService";
import {
  AcceptQuotePayload,
  Quote,
  QuoteStatus,
  useAcceptQuote,
  useCancelQuote,
  useFetchMyQuotes,
} from "@/services/quoteService";
import { ShippingAddress } from "@/types/product";
import { format } from "date-fns";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FileText,
  History,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  Upload,
  X,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";

// ─── helpers ──────────────────────────────────────────────────────────────────

const ACTIVE_STATUSES: QuoteStatus[] = [
  QuoteStatus.PENDING,
  QuoteStatus.RESPONDED,
  QuoteStatus.ACCEPTED,
  QuoteStatus.PROCESSING,
  QuoteStatus.SHIPPED,
];

const CANCELLABLE_STATUSES: QuoteStatus[] = [
  QuoteStatus.PENDING,
  QuoteStatus.RESPONDED,
];

const quoteStatusBadge: Record<QuoteStatus, { label: string; className: string }> = {
  [QuoteStatus.PENDING]:    { label: "⏳ Pending",    className: "bg-amber-100 text-amber-800 dark:bg-amber-900/30" },
  [QuoteStatus.RESPONDED]:  { label: "💬 Responded",  className: "bg-blue-100 text-blue-800 dark:bg-blue-900/30" },
  [QuoteStatus.ACCEPTED]:   { label: "✅ Accepted",   className: "bg-teal-100 text-teal-800 dark:bg-teal-900/30" },
  [QuoteStatus.REJECTED]:   { label: "✕ Rejected",    className: "bg-red-100 text-red-800 dark:bg-red-900/30" },
  [QuoteStatus.PROCESSING]: { label: "🔄 Processing", className: "bg-purple-100 text-purple-800 dark:bg-purple-900/30" },
  [QuoteStatus.SHIPPED]:    { label: "🚚 Shipped",    className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30" },
  [QuoteStatus.DELIVERED]:  { label: "✓ Delivered",   className: "bg-green-100 text-green-800 dark:bg-green-900/30" },
  [QuoteStatus.CANCELLED]:  { label: "✕ Cancelled",   className: "bg-red-100 text-red-800 dark:bg-red-900/30" },
};

type TabKey = "active" | "history";

// ─── shared input classes ─────────────────────────────────────────────────────

const inputClass =
  "w-full px-3 py-2.5 text-sm border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
const labelClass = "block text-sm font-medium mb-1.5";
const errorClass = "text-xs text-destructive mt-1";

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const QuoteSkeleton = () => (
  <div className="border border-border rounded-xl p-5 space-y-4">
    <div className="flex justify-between">
      <div className="space-y-2">
        <Skeleton className="h-5 w-28" />
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-36" />
      </div>
      <Skeleton className="h-7 w-24 rounded-full" />
    </div>
    <Skeleton className="h-14 w-full rounded-lg" />
    <div className="flex gap-2">
      <Skeleton className="h-8 w-28 rounded-lg" />
      <Skeleton className="h-8 w-28 rounded-lg" />
    </div>
  </div>
);

// ─── Cancel state ─────────────────────────────────────────────────────────────

interface CancelState {
  quote: Quote;
  reason: string;
}

// ─── Quote Details Modal ──────────────────────────────────────────────────────

const QuoteDetailsModal = ({
  quote,
  onClose,
}: {
  quote: Quote;
  onClose: () => void;
}) => {
  const badge = quoteStatusBadge[quote.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background rounded-t-2xl z-10">
          <div>
            <h2 className="text-base font-bold">{quote.quote_id}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {format(new Date(quote.createdAt), "dd MMM yyyy, hh:mm a")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${badge.className}`}>
              {badge.label}
            </span>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5">
          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-muted/40 rounded-xl p-3 border border-border/60">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Email</p>
              <p className="text-sm font-medium">{quote.email}</p>
            </div>
            <div className="bg-muted/40 rounded-xl p-3 border border-border/60">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide mb-1">Phone</p>
              <p className="text-sm font-medium">{quote.phoneNumber}</p>
            </div>
          </div>

          {/* Quote items */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Requested Items
            </p>
            <div className="space-y-2">
              {quote.quoteItems.map((item, i) => (
                <div key={i} className="border border-border rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground font-mono">{item.name || item.productId}</p>
                    <span className="text-xs font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {item.quantity} pcs
                    </span>
                  </div>
                  {Object.keys(item.specifications).length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {Object.entries(item.specifications).map(([k, v]) => (
                        <span
                          key={k}
                          className="text-[10px] bg-muted border border-border rounded-full px-2 py-0.5 text-muted-foreground"
                        >
                          <span className="text-foreground font-medium">{k}:</span> {v}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Message */}
          {quote.message && (
            <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
                Your Message
              </p>
              <p className="text-sm text-muted-foreground">{quote.message}</p>
            </div>
          )}

          {/* Admin response */}
          {quote.adminResponse && (
            <div className="bg-primary/5 rounded-xl p-4 border border-primary/20">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                  Admin Response
                </p>
                {quote.quotedPrice && (
                  <p className="text-sm font-bold text-foreground">
                    BDT {quote.quotedPrice.toLocaleString()}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{quote.adminResponse}</p>
            </div>
          )}

          {/* Shipping address */}
          {quote.shippingAddress && (
            <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                Shipping Address
              </p>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p className="font-medium text-foreground">{quote.shippingAddress.fullName}</p>
                <p>{quote.shippingAddress.addressLine1}</p>
                {quote.shippingAddress.addressLine2 && <p>{quote.shippingAddress.addressLine2}</p>}
                <p>
                  {quote.shippingAddress.thana}, {quote.shippingAddress.district},{" "}
                  {quote.shippingAddress.division}
                </p>
              </div>
            </div>
          )}

          {/* Cancel reason */}
          {quote.cancelReason && (
            <div className="bg-destructive/5 rounded-xl p-4 border border-destructive/20">
              <div className="flex items-center gap-1.5 mb-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                <p className="text-xs font-semibold text-destructive uppercase tracking-wide">
                  Cancel Reason
                </p>
              </div>
              <p className="text-sm text-muted-foreground">{quote.cancelReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Shipping Address Modal ───────────────────────────────────────────────────

const AcceptShippingModal = ({
  quote,
  onClose,
  onNext,
}: {
  quote: Quote;
  onClose: () => void;
  onNext: (address: ShippingAddress) => void;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ShippingAddress>({
    defaultValues: {
      fullName: "", phone: "", email: "",
      addressLine1: "", addressLine2: "",
      district: "", thana: "", division: "",
      postalCode: "", deliveryNote: "",
    },
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background rounded-t-2xl z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">1</div>
              <h2 className="text-base font-bold">Shipping Address</h2>
            </div>
            <p className="text-xs text-muted-foreground ml-7">Step 1 of 2 — Enter delivery details</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quoted price strip */}
        {quote.quotedPrice && (
          <div className="mx-5 mt-5 bg-primary/5 border border-primary/20 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Quoted Price</span>
            <span className="text-base font-bold text-primary">BDT {quote.quotedPrice.toLocaleString()}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onNext)} className="p-5 space-y-4">
          <div>
            <label className={labelClass}>Full Name <span className="text-destructive">*</span></label>
            <input {...register("fullName", { required: "Full name is required" })} placeholder="Md. Rahim Uddin" className={inputClass} />
            {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Phone <span className="text-destructive">*</span></label>
              <input
                {...register("phone", {
                  required: "Phone is required",
                  pattern: { value: /^(\+?880|0)1[3-9]\d{8}$/, message: "Enter valid BD phone" },
                })}
                placeholder="+8801XXXXXXXXX"
                className={inputClass}
              />
              {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                {...register("email", {
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                })}
                placeholder="you@example.com"
                className={inputClass}
              />
              {errors.email && <p className={errorClass}>{errors.email.message}</p>}
            </div>
          </div>
          <div>
            <label className={labelClass}>Address Line 1 <span className="text-destructive">*</span></label>
            <input {...register("addressLine1", { required: "Address is required" })} placeholder="House No, Road No" className={inputClass} />
            {errors.addressLine1 && <p className={errorClass}>{errors.addressLine1.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Address Line 2</label>
            <input {...register("addressLine2")} placeholder="Area, Block (optional)" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Thana <span className="text-destructive">*</span></label>
              <input {...register("thana", { required: "Required" })} placeholder="e.g. Gulshan" className={inputClass} />
              {errors.thana && <p className={errorClass}>{errors.thana.message}</p>}
            </div>
            <div>
              <label className={labelClass}>District <span className="text-destructive">*</span></label>
              <input {...register("district", { required: "Required" })} placeholder="e.g. Dhaka" className={inputClass} />
              {errors.district && <p className={errorClass}>{errors.district.message}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Division <span className="text-destructive">*</span></label>
              <input {...register("division", { required: "Required" })} placeholder="e.g. Dhaka" className={inputClass} />
              {errors.division && <p className={errorClass}>{errors.division.message}</p>}
            </div>
            <div>
              <label className={labelClass}>Postal Code</label>
              <input {...register("postalCode")} placeholder="e.g. 1212" className={inputClass} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Delivery Note</label>
            <textarea {...register("deliveryNote")} rows={2} placeholder="Special instructions..." className={`${inputClass} resize-none`} />
          </div>
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="flex-1">
              Next — Payment Info
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── Payment (bKash) Modal ────────────────────────────────────────────────────

const AcceptPaymentModal = ({
  quote,
  shippingAddress,
  onClose,
  onBack,
  onConfirm,
}: {
  quote: Quote;
  shippingAddress: ShippingAddress;
  onClose: () => void;
  onBack: () => void;
  onConfirm: (accountInfo: AccountInfo) => void;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AccountInfo>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setScreenshotPreview(result);
      setValue("transactionScreenshot", 'https://picsum.photos/id/1/200/300');
    //   setValue("transactionScreenshot", result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-background border border-border rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border sticky top-0 bg-background rounded-t-2xl z-10">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">2</div>
              <h2 className="text-base font-bold">Payment Details</h2>
            </div>
            <p className="text-xs text-muted-foreground ml-7">Step 2 of 2 — bKash Send Money</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* bKash instruction */}
          <div className="bg-pink-50 dark:bg-pink-950/20 border border-pink-200 dark:border-pink-800/40 rounded-xl p-4">
            <p className="text-xs font-semibold text-pink-700 dark:text-pink-400 mb-2">
              📱 bKash Send Money Instructions
            </p>
            <ol className="text-xs text-pink-700 dark:text-pink-400 space-y-1 list-decimal list-inside">
              <li>Open your bKash app</li>
              <li>Go to <strong>Send Money</strong></li>
              <li>Send <strong>BDT {quote.quotedPrice?.toLocaleString()}</strong> to our number</li>
              <li>Take a screenshot of the confirmation</li>
              <li>Fill in the details below</li>
            </ol>
          </div>

          {/* Shipping summary */}
          <div className="bg-muted/40 rounded-xl p-3 border border-border/60 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{shippingAddress.fullName}</span>
              {" · "}{shippingAddress.addressLine1}, {shippingAddress.thana}, {shippingAddress.district}
            </div>
          </div>

          <form onSubmit={handleSubmit(onConfirm)} className="space-y-4">
            <div>
              <label className={labelClass}>Transaction ID <span className="text-destructive">*</span></label>
              <input
                {...register("transactionId", { required: "Transaction ID is required" })}
                placeholder="e.g. TXN123456789"
                className={inputClass}
              />
              {errors.transactionId && <p className={errorClass}>{errors.transactionId.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>bKash Account No <span className="text-destructive">*</span></label>
                <input
                  {...register("accountNumber", { required: "Account number is required" })}
                  placeholder="01XXXXXXXXX"
                  className={inputClass}
                />
                {errors.accountNumber && <p className={errorClass}>{errors.accountNumber.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Account Name <span className="text-destructive">*</span></label>
                <input
                  {...register("accountName", { required: "Account name is required" })}
                  placeholder="Account holder name"
                  className={inputClass}
                />
                {errors.accountName && <p className={errorClass}>{errors.accountName.message}</p>}
              </div>
            </div>

            {/* Screenshot upload */}
            <div>
              <label className={labelClass}>Transaction Screenshot <span className="text-destructive">*</span></label>
              <input
                type="hidden"
                {...register("transactionScreenshot", { required: "Screenshot is required" })}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-4 cursor-pointer transition-colors text-center",
                  screenshotPreview
                    ? "border-primary/40 bg-primary/5"
                    : "border-border hover:border-primary/40 hover:bg-muted/40"
                )}
              >
                {screenshotPreview ? (
                  <div className="flex items-center gap-3">
                    <img src={screenshotPreview} alt="preview" className="w-14 h-14 rounded-lg object-cover border border-border" />
                    <div className="text-left">
                      <p className="text-sm font-medium text-primary">Screenshot uploaded</p>
                      <p className="text-xs text-muted-foreground">Click to change</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1.5 py-2">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload screenshot</p>
                    <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
                  </div>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              {errors.transactionScreenshot && (
                <p className={errorClass}>{errors.transactionScreenshot.message}</p>
              )}
            </div>

            <div className="flex gap-3 pt-1">
              <Button type="button" variant="outline" className="flex-1" onClick={onBack}>← Back</Button>
              <Button type="submit" className="flex-1">Review & Confirm</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

// ─── Final Confirm Modal ──────────────────────────────────────────────────────

const AcceptConfirmModal = ({
  quote,
  payload,
  onClose,
  onConfirm,
  isLoading,
}: {
  quote: Quote;
  payload: AcceptQuotePayload;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
    <div className="relative bg-background border border-border rounded-2xl w-full max-w-md shadow-xl z-10 p-6 space-y-5">
      <div className="flex flex-col items-center text-center gap-2">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-1">
          <CheckCircle2 className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-lg font-bold">Confirm Your Order</h2>
        <p className="text-sm text-muted-foreground">
          Please review the details before confirming your order for quote{" "}
          <span className="font-semibold text-foreground">{quote.quote_id}</span>
        </p>
      </div>

      {/* Summary */}
      <div className="bg-muted/40 rounded-xl border border-border/60 divide-y divide-border/60">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Quoted Price</span>
          <span className="text-sm font-bold text-primary">BDT {quote.quotedPrice?.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Ship To</span>
          <span className="text-sm font-medium">{payload.shippingAddress.fullName}</span>
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-sm text-muted-foreground">Payment Ref</span>
          <span className="text-sm font-medium font-mono">{payload.accountInfo.transactionId}</span>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
          Go Back
        </Button>
        <Button className="flex-1" onClick={onConfirm} disabled={isLoading}>
          {isLoading ? "Confirming…" : "✓ Confirm Order"}
        </Button>
      </div>
    </div>
  </div>
);

// ─── Accept flow state ────────────────────────────────────────────────────────

type AcceptStep = "shipping" | "payment" | "confirm";

interface AcceptFlowState {
  quote: Quote;
  step: AcceptStep;
  shippingAddress?: ShippingAddress;
  accountInfo?: AccountInfo;
}

// ─── Quote Row Card ───────────────────────────────────────────────────────────

const QuoteRow = ({
  quote,
  onCancelRequest,
  onViewDetails,
  onAcceptClick,
}: {
  quote: Quote;
  onCancelRequest: (quote: Quote) => void;
  onViewDetails: (quote: Quote) => void;
  onAcceptClick: (quote: Quote) => void;
}) => {
  const badge = quoteStatusBadge[quote.status];
  const isActive = ACTIVE_STATUSES.includes(quote.status);
  const isCancellable = CANCELLABLE_STATUSES.includes(quote.status);
  const hasResponse = !!quote.adminResponse;
  const canAccept = quote.status === QuoteStatus.RESPONDED && !!quote.quotedPrice;

  const { data: cmsResp } = useFetchCms(true);
const phone = cmsResp?.data?.contactInfo?.phone ?? "+8801739748268";
const email = cmsResp?.data?.contactInfo?.email ?? "sales@nupaenterprise.com";

  return (
    <div className="border border-border rounded-xl p-5 hover:border-primary/30 hover:shadow-sm transition-all space-y-4">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="space-y-1">
          <p className="font-semibold text-sm">{quote.quote_id}</p>
          <p className="text-sm text-muted-foreground">
            {quote.quoteItems.length} item{quote.quoteItems.length > 1 ? "s" : ""}
          </p>
          <p className="text-xs text-muted-foreground">
            {quote.email} · {quote.phoneNumber}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(quote.createdAt), "dd MMM yyyy, hh:mm a")}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {isCancellable && (
            <button
              onClick={() => onCancelRequest(quote)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-destructive border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 transition-colors"
            >
              <XCircle className="w-3.5 h-3.5" />
              Cancel
            </button>
          )}
          {canAccept && (
            <button
              onClick={() => onAcceptClick(quote)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-primary hover:bg-primary/90 transition-colors shadow-sm"
            >
              <Package className="w-3.5 h-3.5" />
              Accept Order
            </button>
          )}
          <span className={`text-xs font-medium px-3 py-1.5 rounded-full ${badge.className}`}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Message */}
      {quote.message && (
        <div className="bg-muted/50 rounded-lg px-3.5 py-2.5 text-sm text-muted-foreground border border-border/60">
          <div className="flex items-center gap-1.5 mb-1">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-foreground">Your Message</span>
          </div>
          <p className="line-clamp-2">{quote.message}</p>
        </div>
      )}

      {/* Admin response + quoted price */}
      {hasResponse && (
        <div className="bg-primary/5 rounded-lg px-3.5 py-2.5 text-sm border border-primary/20">
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-medium text-primary">Admin Response</span>
            {quote.quotedPrice && (
              <span className="ml-auto text-sm font-bold text-foreground">
                BDT {quote.quotedPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-muted-foreground line-clamp-2">{quote.adminResponse}</p>
          {canAccept && (
            <div className="mt-2.5 pt-2.5 border-t border-primary/10 flex items-center justify-between">
              <p className="text-xs text-muted-foreground">
                Review the offer and accept to place your order
              </p>
              <button
                onClick={() => onAcceptClick(quote)}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Accept →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Divider */}
      <div className="border-t border-border/60" />

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {isActive && (
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
          onClick={() => onViewDetails(quote)}
        >
          <FileText className="w-3.5 h-3.5" />
          View Details
        </Button>
      </div>
    </div>
  );
};

// ─── Tab item ─────────────────────────────────────────────────────────────────

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

const TrackQuote = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("active");
  const [detailsQuote, setDetailsQuote] = useState<Quote | null>(null);
  const [cancelModalQuote, setCancelModalQuote] = useState<Quote | null>(null);
  const [pendingCancel, setPendingCancel] = useState<CancelState | null>(null);
  const [acceptFlow, setAcceptFlow] = useState<AcceptFlowState | null>(null);

  const { data, isLoading } = useFetchMyQuotes({ page: 1, limit: 50 });
  const cancelMutation = useCancelQuote();
  const acceptMutation = useAcceptQuote();

  const quotes = data?.data ?? [];
  const activeQuotes = quotes.filter((q) => ACTIVE_STATUSES.includes(q.status));
  const historyQuotes = quotes.filter(
    (q) =>
      q.status === QuoteStatus.DELIVERED ||
      q.status === QuoteStatus.CANCELLED ||
      q.status === QuoteStatus.REJECTED
  );
  const visibleQuotes = activeTab === "active" ? activeQuotes : historyQuotes;

  // ── cancel flow ───────────────────────────────────────────────────────────

  const handleCancelRequest = (quote: Quote) => setCancelModalQuote(quote);

  const handleReasonSubmit = (reason: string) => {
    if (!cancelModalQuote) return;
    setPendingCancel({ quote: cancelModalQuote, reason });
    setCancelModalQuote(null);
  };

  const handleConfirmCancel = async () => {
    if (!pendingCancel) return;
    try {
      await cancelMutation.mutateAsync({
        id: pendingCancel.quote.id,
        payload: { reason: pendingCancel.reason },
      });
    } finally {
      setPendingCancel(null);
    }
  };

  // ── accept flow ───────────────────────────────────────────────────────────

  const handleAcceptClick = (quote: Quote) =>
    setAcceptFlow({ quote, step: "shipping" });

  const handleShippingNext = (address: ShippingAddress) =>
    setAcceptFlow((prev) => prev ? { ...prev, step: "payment", shippingAddress: address } : null);

  const handlePaymentNext = (accountInfo: AccountInfo) =>
    setAcceptFlow((prev) => prev ? { ...prev, step: "confirm", accountInfo } : null);

  const handleFinalConfirm = async () => {
    if (!acceptFlow?.shippingAddress || !acceptFlow.accountInfo) return;
    const payload: AcceptQuotePayload = {
      shippingAddress: acceptFlow.shippingAddress,
      accountInfo: acceptFlow.accountInfo,
    };
    try {
      await acceptMutation.mutateAsync({ id: acceptFlow.quote.id, payload });
      setAcceptFlow(null);
    } catch {
      // handled in service
    }
  };

  return (
    <MainLayout>
      <PageBanner title="My Quotes" subtitle="Track and manage your quote requests" />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "My Quotes" }]} />
      </div>

      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 max-w-6xl mx-auto">

            {/* ── Sidebar ── */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="border border-border rounded-2xl p-3 space-y-1.5 sticky top-20">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1">
                  My Quotes
                </p>
                <TabItem active={activeTab === "active"} onClick={() => setActiveTab("active")} icon={ClipboardList} label="Active Quotes" count={isLoading ? 0 : activeQuotes.length} />
                <TabItem active={activeTab === "history"} onClick={() => setActiveTab("history")} icon={History} label="Quote History" count={isLoading ? 0 : historyQuotes.length} />

                <div className="mt-3 pt-3 border-t border-border/60 px-2 space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Total Quotes</span>
                    <span className="font-semibold text-foreground">{quotes.length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Pending</span>
                    <span className="font-semibold text-amber-600">{quotes.filter((q) => q.status === QuoteStatus.PENDING).length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Responded</span>
                    <span className="font-semibold text-blue-600">{quotes.filter((q) => q.status === QuoteStatus.RESPONDED).length}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Delivered</span>
                    <span className="font-semibold text-green-600">{quotes.filter((q) => q.status === QuoteStatus.DELIVERED).length}</span>
                  </div>
                </div>
              </div>
            </aside>

            {/* ── Quote List ── */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  {activeTab === "active"
                    ? <ClipboardList className="w-4 h-4 text-primary" />
                    : <History className="w-4 h-4 text-primary" />
                  }
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">
                    {activeTab === "active" ? "Active Quotes" : "Quote History"}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {activeTab === "active"
                      ? "Track your pending and in-progress quote requests"
                      : "Your delivered, rejected and cancelled quotes"}
                  </p>
                </div>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <QuoteSkeleton /><QuoteSkeleton /><QuoteSkeleton />
                </div>
              ) : visibleQuotes.length === 0 ? (
                <div className="border border-border rounded-2xl">
                  <EmptyState
                    icon={ClipboardList}
                    title={activeTab === "active" ? "No Active Quotes" : "No Quote History"}
                    description={
                      activeTab === "active"
                        ? "You don't have any active quote requests. Submit a new quote to get started."
                        : "Your completed and cancelled quotes will appear here."
                    }
                    actionLabel={activeTab === "active" ? "Request a Quote" : undefined}
                    actionHref={activeTab === "active" ? "/request-quote" : undefined}
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleQuotes.map((quote) => (
                    <QuoteRow
                      key={quote.id}
                      quote={quote}
                      onCancelRequest={handleCancelRequest}
                      onViewDetails={setDetailsQuote}
                      onAcceptClick={handleAcceptClick}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CTASection />

      {/* ── Details Modal ── */}
      {detailsQuote && (
        <QuoteDetailsModal quote={detailsQuote} onClose={() => setDetailsQuote(null)} />
      )}

      {/* ── Accept Flow: Step 1 — Shipping ── */}
      {acceptFlow?.step === "shipping" && (
        <AcceptShippingModal
          quote={acceptFlow.quote}
          onClose={() => setAcceptFlow(null)}
          onNext={handleShippingNext}
        />
      )}

      {/* ── Accept Flow: Step 2 — Payment ── */}
      {acceptFlow?.step === "payment" && acceptFlow.shippingAddress && (
        <AcceptPaymentModal
          quote={acceptFlow.quote}
          shippingAddress={acceptFlow.shippingAddress}
          onClose={() => setAcceptFlow(null)}
          onBack={() => setAcceptFlow((prev) => prev ? { ...prev, step: "shipping" } : null)}
          onConfirm={handlePaymentNext}
        />
      )}

      {/* ── Accept Flow: Step 3 — Final Confirm ── */}
      {acceptFlow?.step === "confirm" && acceptFlow.shippingAddress && acceptFlow.accountInfo && (
        <AcceptConfirmModal
          quote={acceptFlow.quote}
          payload={{ shippingAddress: acceptFlow.shippingAddress, accountInfo: acceptFlow.accountInfo }}
          onClose={() => setAcceptFlow(null)}
          onConfirm={handleFinalConfirm}
          isLoading={acceptMutation.isPending}
        />
      )}

      {/* ── Cancel: Step 1 ── */}
      <CancelOrderModal
        isOpen={!!cancelModalQuote}
        onClose={() => setCancelModalQuote(null)}
        orderId={cancelModalQuote?.id ?? ""}
        orderDisplayId={cancelModalQuote?.quote_id ?? ""}
        onConfirmCancel={handleReasonSubmit}
      />

      {/* ── Cancel: Step 2 ── */}
      <DeleteConfirmationDialog
        isOpen={!!pendingCancel}
        onConfirm={handleConfirmCancel}
        onCancel={() => setPendingCancel(null)}
        title="Confirm Quote Cancellation"
        description={`Are you sure you want to cancel quote #${pendingCancel?.quote.quote_id}? This action cannot be undone.`}
        confirmText="Yes, Cancel Quote"
        cancelText="Go Back"
        isLoading={cancelMutation.isPending}
      />
    </MainLayout>
  );
};

export default TrackQuote;
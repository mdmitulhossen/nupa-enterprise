import { Button } from "@/components/ui/button";
import { AlertTriangle, X } from "lucide-react";
import { useForm } from "react-hook-form";

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
  orderDisplayId: string;
  onConfirmCancel: (reason: string) => void;
}

interface CancelFormData {
  reason: string;
}

const CANCEL_REASONS = [
  "Changed my mind",
  "Found a better price elsewhere",
  "Ordered by mistake",
  "Delivery time is too long",
  "Other",
];

const inputClass =
  "w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-destructive/40 transition resize-none";

const CancelOrderModal = ({
  isOpen,
  onClose,
  orderId,
  orderDisplayId,
  onConfirmCancel,
}: CancelOrderModalProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CancelFormData>({ defaultValues: { reason: "" } });

  const reasonValue = watch("reason");

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data: CancelFormData) => {
    onConfirmCancel(data.reason.trim());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div className="relative bg-background border border-border rounded-2xl w-full max-w-md max-h-[90vh] shadow-xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="font-semibold">Cancel Order</h2>
              <p className="text-xs text-muted-foreground">#{orderDisplayId}</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <p className="text-sm text-muted-foreground">
            Please select or describe the reason for cancellation. This helps us improve our service.
          </p>

          {/* Quick reason chips */}
          <div className="flex flex-wrap gap-2">
            {CANCEL_REASONS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setValue("reason", r, { shouldValidate: true })}
                className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                  reasonValue === r
                    ? "bg-destructive/10 border-destructive text-destructive"
                    : "border-border hover:border-muted-foreground/40 text-muted-foreground"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Custom reason textarea */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Reason <span className="text-destructive">*</span>
            </label>
            <textarea
              {...register("reason", {
                required: "Please provide a cancellation reason",
                minLength: { value: 5, message: "Reason must be at least 5 characters" },
              })}
              rows={3}
              placeholder="Describe your reason for cancellation..."
              className={inputClass}
            />
            {errors.reason && (
              <p className="text-xs text-destructive mt-1">{errors.reason.message}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={handleClose}
            >
              Keep Order
            </Button>
            <Button
              type="submit"
              variant="destructive"
              className="flex-1"
              disabled={!reasonValue.trim()}
            >
              Proceed to Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CancelOrderModal;
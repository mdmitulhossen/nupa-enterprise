import { Button } from "@/components/ui/button";
import { useShippingStore } from "@/store/shippingStore";
import { ShippingAddress } from "@/types/product";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ShippingAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const inputClass =
  "w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/40 transition";
const errorClass = "text-xs text-destructive mt-1";
const labelClass = "block text-sm font-medium mb-1";

const ShippingAddressModal = ({ isOpen, onClose }: ShippingAddressModalProps) => {
  const navigate = useNavigate();
  const { address, setAddress } = useShippingStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingAddress>({
    defaultValues: address ?? {
      fullName: "",
      phone: "",
      email: "",
      addressLine1: "",
      addressLine2: "",
      district: "",
      thana: "",
      division: "",
      postalCode: "",
      deliveryNote: "",
    },
  });

  // Pre-fill from saved address when modal opens
  useEffect(() => {
    if (isOpen && address) {
      reset(address);
    }
  }, [isOpen, address, reset]);

  const onSubmit = (data: ShippingAddress) => {
    setAddress(data);        // save to localStorage via zustand persist
    onClose();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-background border border-border rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background rounded-t-2xl z-10">
          <div>
            <h2 className="text-lg font-semibold">Confirm Shipping Address</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Please fill in your delivery details
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          {/* Full Name */}
          <div>
            <label className={labelClass}>
              Full Name <span className="text-destructive">*</span>
            </label>
            <input
              {...register("fullName", { required: "Full name is required" })}
              placeholder="John Doe"
              className={inputClass}
            />
            {errors.fullName && (
              <p className={errorClass}>{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className={labelClass}>
              Phone Number <span className="text-destructive">*</span>
            </label>
            <input
              {...register("phone", {
                required: "Phone number is required",
                pattern: {
                  value: /^(\+?880|0)1[3-9]\d{8}$/,
                  message: "Enter a valid Bangladeshi phone number",
                },
              })}
              placeholder="01XXXXXXXXX"
              className={inputClass}
            />
            {errors.phone && (
              <p className={errorClass}>{errors.phone.message}</p>
            )}
          </div>

           {/* Email */}
          <div>
            <label className={labelClass}>Email Address</label>
            <input
              {...register("email", {
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Enter a valid email address",
                },
              })}
              type="email"
              placeholder="john@example.com"
              className={inputClass}
            />
            {errors.email && (
              <p className={errorClass}>{errors.email.message}</p>
            )}
          </div>

          {/* Address Line 1 */}
          <div>
            <label className={labelClass}>
              Address Line 1 <span className="text-destructive">*</span>
            </label>
            <input
              {...register("addressLine1", { required: "Address line 1 is required" })}
              placeholder="House No, Road No"
              className={inputClass}
            />
            {errors.addressLine1 && (
              <p className={errorClass}>{errors.addressLine1.message}</p>
            )}
          </div>

          {/* Address Line 2 */}
          <div>
            <label className={labelClass}>Address Line 2</label>
            <input
              {...register("addressLine2")}
              placeholder="Area, Block (optional)"
              className={inputClass}
            />
          </div>

          {/* Thana & District */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Thana <span className="text-destructive">*</span>
              </label>
              <input
                {...register("thana", { required: "Thana is required" })}
                placeholder="e.g. Gulshan"
                className={inputClass}
              />
              {errors.thana && (
                <p className={errorClass}>{errors.thana.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>
                District <span className="text-destructive">*</span>
              </label>
              <input
                {...register("district", { required: "District is required" })}
                placeholder="e.g. Dhaka"
                className={inputClass}
              />
              {errors.district && (
                <p className={errorClass}>{errors.district.message}</p>
              )}
            </div>
          </div>

          {/* Division & Postal Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Division <span className="text-destructive">*</span>
              </label>
              <input
                {...register("division", { required: "Division is required" })}
                placeholder="e.g. Dhaka"
                className={inputClass}
              />
              {errors.division && (
                <p className={errorClass}>{errors.division.message}</p>
              )}
            </div>
            <div>
              <label className={labelClass}>Postal Code</label>
              <input
                {...register("postalCode")}
                placeholder="e.g. 1212"
                className={inputClass}
              />
            </div>
          </div>

          {/* Delivery Note */}
          <div>
            <label className={labelClass}>Delivery Note</label>
            <textarea
              {...register("deliveryNote")}
              placeholder="Any special instructions for delivery..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Continue to Checkout
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShippingAddressModal;
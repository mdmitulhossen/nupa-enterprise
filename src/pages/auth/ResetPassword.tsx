import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { useResetPassword } from "@/services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const reset = useResetPassword();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.newPassword) newErrors.newPassword = "Password is required";
    else if (formData.newPassword.length < 6) newErrors.newPassword = "Password must be at least 6 characters";
    if (!formData.confirmPassword) newErrors.confirmPassword = "Please confirm your password";
    else if (formData.newPassword !== formData.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await reset.mutateAsync({ password: formData.newPassword });
      sessionStorage.removeItem("resetEmail");
      navigate("/login");
    } catch {
      // mutation displays toast/errors; keep UI state as is
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Reset Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">Your new password must be different from your previous password.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={formData.newPassword}
            onChange={(e) => handleChange("newPassword", e.target.value)}
            error={errors.newPassword}
          />

          <AuthInput
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
          />

          <AuthButton type="submit" disabled={reset.isPending}>
            {reset.isPending ? "Resetting..." : "Reset Password"}
          </AuthButton>
        </form>
      </div>
    </AuthLayout>
  );
};

export default ResetPassword;
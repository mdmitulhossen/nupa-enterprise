/* eslint-disable @typescript-eslint/no-explicit-any */
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import { useForgotPassword } from "@/services/authService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const forgot = useForgotPassword();

  const validate = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await forgot.mutateAsync({ email });
      // persist email for verification flow
      sessionStorage.setItem("resetEmail", email);
      navigate("/verification");
    } catch {
      // error handled by hook (toasts); keep inline message if needed
      if (!error && (forgot as any).error) {
        setError(String((forgot as any).error?.message ?? "Failed to send OTP"));
      }
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Forgot Password</h1>
          <p className="mt-2 text-sm text-muted-foreground">We'll send a verification code to your email address</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="enter your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
            }}
            error={error}
          />

          <AuthButton type="submit" disabled={forgot.isPending}>
            {forgot.isPending ? "Sending..." : "Send Verification Code"}
          </AuthButton>

          {forgot.isError && !error && (
            <p className="text-xs text-destructive">{String((forgot as any).error?.message ?? "Failed to send OTP")}</p>
          )}
        </form>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
/* eslint-disable @typescript-eslint/no-explicit-any */

import AuthButton from "@/components/auth/AuthButton";
import AuthLayout from "@/components/auth/AuthLayout";
import OtpInput from "@/components/auth/OtpInput";
import { useForgotPassword, useVerifyOtp } from "@/services/authService";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const VerificationCode = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const email = sessionStorage.getItem("resetEmail") || "";
  const maskedEmail = email.includes("@")
    ? email.slice(0, 2) + "•••••" + email.slice(email.indexOf("@") - 1)
    : email;

  const verify = useVerifyOtp();
  const forgot = useForgotPassword();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
    setCanResend(true);
  }, [timer]);

  const handleResend = async () => {
    if (!email) {
      setError("Missing email to resend code.");
      return;
    }
    try {
      await forgot.mutateAsync({ email });
      setTimer(60);
      setCanResend(false);
      setError(null);
    } catch {
      // mutation shows toast; keep optional local message
      setError("Failed to resend code.");
    }
  };

  const handleComplete = (code: string) => setOtp(code);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email) {
      setError("Missing email.");
      return;
    }
    if (otp.length !== 6) {
      setError("Please enter the 6-digit code.");
      return;
    }

    try {
      await verify.mutateAsync({ email, otp });
      // on success verify hook stores token; navigate to reset-password
      navigate("/reset-password");
    } catch (err) {
      // mutation handles toast; set local message if available
      setError((err as any)?.message ?? "Verification failed");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Verification Code
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent you a verification code to {maskedEmail || "your email"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <OtpInput length={6} onComplete={handleComplete} />

          <div className="text-right">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-sm text-foreground font-medium hover:underline"
                disabled={forgot.isPending}
              >
                {forgot.isPending ? "Resending..." : "Resend Code"}
              </button>
            ) : (
              <span className="text-sm text-muted-foreground">
                Resend Code:{" "}
                <span className="text-foreground font-medium">{formatTime(timer)}</span>
              </span>
            )}
          </div>

          {error && <p className="text-xs text-destructive">{error}</p>}
          {verify.isError && !error && (
            <p className="text-xs text-destructive">{String((verify as any).error?.message ?? "Verification failed")}</p>
          )}

          <AuthButton type="submit" disabled={verify.isPending || otp.length !== 6}>
            {verify.isPending ? "Verifying..." : "Verify & Continue"}
          </AuthButton>
        </form>
      </div>
    </AuthLayout>
  );
};

export default VerificationCode;
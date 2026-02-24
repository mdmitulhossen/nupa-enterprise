/* eslint-disable @typescript-eslint/no-explicit-any */
import AuthButton from "@/components/auth/AuthButton";
import AuthInput from "@/components/auth/AuthInput";
import AuthLayout from "@/components/auth/AuthLayout";
import SocialButtons from "@/components/auth/SocialButtons";
import { Checkbox } from "@/components/ui/checkbox";
import { useLogin } from "@/services/authService";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const loginMutation = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = "You must agree to the terms";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const fromPath = (location.state as any)?.from?.pathname;
      loginMutation.mutate(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onSuccess: (data: any) => {
            const role = data?.data?.user?.role;
            const target = fromPath || (role === 'ADMIN' ? '/admin' : '/');
            navigate(target, { replace: true });
          },
        }
      );
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">Log in</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Don't Have an account?{" "}
            <Link
              to="/signup"
              className="text-foreground font-medium underline hover:no-underline"
            >
              Create an Account
            </Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthInput
            label="Email Address"
            type="email"
            placeholder="enter your email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            error={errors.email}
          />

          <div>
            <AuthInput
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              error={errors.password}
            />
            <div className="mt-1 text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-foreground underline hover:no-underline"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <AuthButton type="submit" disabled={loginMutation.isPending}>Log In</AuthButton>

          <div className="flex items-start gap-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) =>
                handleChange("agreeToTerms", checked as boolean)
              }
              className="mt-0.5 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="terms" className="text-sm text-foreground leading-tight">
              I agree to the{" "}
              <Link to="/terms" className="underline hover:no-underline font-medium">
                Terms & Conditions
              </Link>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="text-xs text-destructive -mt-3">{errors.agreeToTerms}</p>
          )}
        </form>

        <SocialButtons />
      </div>
    </AuthLayout>
  );
};

export default Login;
import MainLayout from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchProfile, useResetPassword } from "@/services/authService";
import { useUpdateUser } from "@/services/userService";
import { format } from "date-fns";
import { Calendar, Lock, Mail, MapPin, Phone, ShieldCheck, User } from "lucide-react";
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { data: profileResp, isLoading: loadingProfile } = useFetchProfile(true);
  const profile = profileResp?.data;
  const updateUser = useUpdateUser();
  const resetPassword = useResetPassword();

  const [tab, setTab] = useState<"profile" | "password">("profile");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });
  const [pw, setPw] = useState({ newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName ?? "",
        lastName: profile.lastName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        address: profile.address ?? "",
      });
    }
  }, [profile]);

  const handleChange = (k: string, v: string) => {
    setForm((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  const validateProfile = () => {
    const e: Record<string, string> = {};
    if (!form.firstName) e.firstName = "First name required";
    if (!form.lastName) e.lastName = "Last name required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSaveProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validateProfile()) return;
    try {
      await updateUser.mutateAsync({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phoneNumber: form.phoneNumber || null,
        address: form.address || null,
      });
    } catch {
      /* handled by hook */
    }
  };

  const validatePassword = () => {
    const e: Record<string, string> = {};
    if (!pw.newPassword) e.newPassword = "Password required";
    else if (pw.newPassword.length < 6) e.newPassword = "Minimum 6 characters";
    if (pw.newPassword !== pw.confirmPassword) e.confirmPassword = "Passwords do not match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChangePassword = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validatePassword()) return;
    try {
      await resetPassword.mutateAsync({ password: pw.newPassword });
      setPw({ newPassword: "", confirmPassword: "" });
    } catch {
      /* handled by hook */
    }
  };

  const initials = profile
    ? `${profile.firstName?.charAt(0) ?? ""}${profile.lastName?.charAt(0) ?? ""}`.toUpperCase()
    : "?";

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "password", label: "Change Password", icon: Lock },
  ] as const;

  return (
    <MainLayout>
      <PageBanner title="My Profile" subtitle="Manage your personal information and preferences" />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "My Profile" }]} />
      </div>

      <section className="py-8 lg:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-1 space-y-4">
              {/* Avatar card */}
              <div className="bg-background border border-border rounded-2xl p-6 flex flex-col items-center text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {loadingProfile ? "..." : initials}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {profile ? `${profile.firstName} ${profile.lastName}` : "—"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">{profile?.email}</p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-green-600 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {profile?.isVerified ? "Verified Account" : "Unverified"}
                </div>
              </div>

              {/* Meta info */}
              <div className="bg-background border border-border rounded-2xl p-4 space-y-3">
                {profile?.email && (
                  <div className="flex items-start gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium break-all">{profile.email}</p>
                    </div>
                  </div>
                )}
                {profile?.phoneNumber && (
                  <div className="flex items-start gap-2">
                    <Phone className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{profile.phoneNumber}</p>
                    </div>
                  </div>
                )}
                {profile?.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Address</p>
                      <p className="text-sm font-medium">{profile.address}</p>
                    </div>
                  </div>
                )}
                {profile?.createdAt && (
                  <div className="flex items-start gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Member since</p>
                      <p className="text-sm font-medium">{format(new Date(profile.createdAt), "dd MMM yyyy")}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Nav tabs */}
              <nav className="bg-background border border-border rounded-2xl p-2 flex flex-col gap-1">
                {tabs.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setTab(key)}
                    className={`flex items-center gap-2.5 text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      tab === key
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted/60"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    {label}
                  </button>
                ))}
              </nav>
            </aside>

            {/* ── Main content ── */}
            <main className="lg:col-span-3">

              {/* Profile tab */}
              {tab === "profile" && (
                <form onSubmit={handleSaveProfile} className="bg-background border border-border rounded-2xl p-6 space-y-6">
                  <div className="border-b border-border pb-4">
                    <h2 className="text-lg font-semibold">Personal Information</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">Update your personal details here.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">First name</label>
                      <Input
                        placeholder="Enter first name"
                        value={form.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                        className={errors.firstName ? "border-destructive" : ""}
                      />
                      {errors.firstName && <p className="text-xs text-destructive">{errors.firstName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Last name</label>
                      <Input
                        placeholder="Enter last name"
                        value={form.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                        className={errors.lastName ? "border-destructive" : ""}
                      />
                      {errors.lastName && <p className="text-xs text-destructive">{errors.lastName}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Email address</label>
                      <Input
                        value={profile?.email ?? ""}
                        disabled
                        className="bg-muted/40 cursor-not-allowed text-muted-foreground"
                      />
                      <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Phone number</label>
                      <Input
                        placeholder="+880..."
                        value={form.phoneNumber ?? ""}
                        onChange={(e) => handleChange("phoneNumber", e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Address</label>
                      <Input
                        placeholder="Enter your address"
                        value={form.address ?? ""}
                        onChange={(e) => handleChange("address", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (profile)
                          setForm({
                            firstName: profile.firstName ?? "",
                            lastName: profile.lastName ?? "",
                            phoneNumber: profile.phoneNumber ?? "",
                            address: profile.address ?? "",
                          });
                      }}
                    >
                      Discard
                    </Button>
                    <Button type="submit" disabled={updateUser.isPending}>
                      {updateUser.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              )}

              {/* Change Password tab */}
              {tab === "password" && (
                <form onSubmit={handleChangePassword} className="bg-background border border-border rounded-2xl p-6 space-y-6">
                  <div className="border-b border-border pb-4">
                    <h2 className="text-lg font-semibold">Change Password</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      Your new password must be at least 6 characters long.
                    </p>
                  </div>

                  <div className="max-w-md space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">New password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={pw.newPassword}
                        onChange={(e) => {
                          setPw((s) => ({ ...s, newPassword: e.target.value }));
                          if (errors.newPassword) setErrors((x) => ({ ...x, newPassword: "" }));
                        }}
                        className={errors.newPassword ? "border-destructive" : ""}
                      />
                      {errors.newPassword && <p className="text-xs text-destructive">{errors.newPassword}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-foreground">Confirm new password</label>
                      <Input
                        type="password"
                        placeholder="••••••••"
                        value={pw.confirmPassword}
                        onChange={(e) => {
                          setPw((s) => ({ ...s, confirmPassword: e.target.value }));
                          if (errors.confirmPassword) setErrors((x) => ({ ...x, confirmPassword: "" }));
                        }}
                        className={errors.confirmPassword ? "border-destructive" : ""}
                      />
                      {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setPw({ newPassword: "", confirmPassword: "" });
                        setErrors({});
                      }}
                    >
                      Discard
                    </Button>
                    <Button type="submit" disabled={resetPassword.isPending}>
                      {resetPassword.isPending ? "Updating..." : "Change Password"}
                    </Button>
                  </div>
                </form>
              )}
            </main>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ProfilePage;
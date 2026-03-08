import MainLayout from "@/components/layout/MainLayout";
import Breadcrumb from "@/components/shared/Breadcrumb";
import PageBanner from "@/components/shared/PageBanner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFetchProfile, useResetPassword } from "@/services/authService";
import { useUpdateUser } from "@/services/userService";
import { format } from "date-fns";
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

  return (
    <MainLayout>
              <PageBanner title="My Profile" subtitle="Manage your personal information and preferences" />

      <div className="container mx-auto px-4">
        <Breadcrumb items={[{ label: "My Profile" }]} />
      </div>

       <section className="py-8 lg:py-12"> 

     
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 container mx-auto px-4">
        <aside className="lg:col-span-1 bg-background border border-border rounded-xl p-4">
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Signed in as</p>
              <h3 className="font-medium">{profile ? `${profile.firstName} ${profile.lastName}` : "—"}</h3>
              <p className="text-xs text-muted-foreground">{profile?.email}</p>
              {profile?.createdAt && <p className="text-xs text-muted-foreground mt-1">Member since {format(new Date(profile.createdAt), "dd MMM yyyy")}</p>}
            </div>

            <nav className="flex flex-col gap-2">
              <button className={`text-left px-3 py-2 rounded ${tab === "profile" ? "bg-primary/10" : "hover:bg-muted/50"}`} onClick={() => setTab("profile")}>Profile</button>
              <button className={`text-left px-3 py-2 rounded ${tab === "password" ? "bg-primary/10" : "hover:bg-muted/50"}`} onClick={() => setTab("password")}>Change Password</button>
            </nav>
          </div>
        </aside>

        <main className="lg:col-span-3">
          {tab === "profile" && (
            <form onSubmit={handleSaveProfile} className="bg-background border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Profile</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">First name</label>
                  <Input value={form.firstName} onChange={(e) => handleChange("firstName", e.target.value)} />
                  {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Last name</label>
                  <Input value={form.lastName} onChange={(e) => handleChange("lastName", e.target.value)} />
                  {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">Phone</label>
                  <Input value={form.phoneNumber ?? ""} onChange={(e) => handleChange("phoneNumber", e.target.value)} />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-muted-foreground">Address</label>
                  <Input value={form.address ?? ""} onChange={(e) => handleChange("address", e.target.value)} />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => {
                  if (profile) setForm({ firstName: profile.firstName ?? "", lastName: profile.lastName ?? "", phoneNumber: profile.phoneNumber ?? "", address: profile.address ?? "" });
                }}>Reset</Button>
                <Button type="submit" disabled={updateUser.isPending}>{updateUser.isPending ? "Saving..." : "Save Changes"}</Button>
              </div>
            </form>
          )}

          {tab === "password" && (
            <form onSubmit={handleChangePassword} className="bg-background border border-border rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold">Change Password</h2>

              <div>
                <label className="text-sm text-muted-foreground">New password</label>
                <Input type="password" value={pw.newPassword} onChange={(e) => { setPw((s) => ({ ...s, newPassword: e.target.value })); if (errors.newPassword) setErrors((x) => ({ ...x, newPassword: "" })); }} />
                {errors.newPassword && <p className="text-xs text-destructive mt-1">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="text-sm text-muted-foreground">Confirm new password</label>
                <Input type="password" value={pw.confirmPassword} onChange={(e) => { setPw((s) => ({ ...s, confirmPassword: e.target.value })); if (errors.confirmPassword) setErrors((x) => ({ ...x, confirmPassword: "" })); }} />
                {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
              </div>

              <div className="flex justify-end gap-2">
                {/* <Button variant="outline" onClick={() => setPw({ newPassword: "", confirmPassword: "" })}>Reset</Button> */}
                <Button type="submit" disabled={resetPassword.isPending}>{resetPassword.isPending ? "Updating..." : "Change Password"}</Button>
              </div>
            </form>
          )}
        </main>
      </div>
        </section>
    </MainLayout>
  );
};

export default ProfilePage; 
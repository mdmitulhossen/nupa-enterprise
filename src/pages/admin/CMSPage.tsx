/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminLayout from "@/components/admin/AdminLayout";
import PageHeader from "@/components/admin/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CmsData, ContactInfo, Faq, SocialLink, useFetchCms, useUpdateCms } from "@/services/CMSService";
import { useEffect, useState } from "react";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";

export const SOCIAL_OPTIONS = [
  { name: "Facebook", key: "facebook" },
  { name: "Instagram", key: "instagram" },
  { name: "YouTube", key: "youtube" },
  { name: "Twitter", key: "twitter" },
  { name: "LinkedIn", key: "linkedin" },
  { name: "TikTok", key: "tiktok" },
  { name: "Snapchat", key: "snapchat" },
  { name: "Pinterest", key: "pinterest" },
  { name: "Reddit", key: "reddit" },
  { name: "WhatsApp", key: "whatsapp" },
];

const emptyCms: CmsData = {
  faqs: [],
  contactInfo: { email: "", phone: "", address: "", businessHours: "" },
  socialLinks: [],
  privacyPolicy: "",
  termsOfService: "",
  refundPolicy: "",
};

const TABS = [
  { id: "contact", label: "Contact Info" },
  { id: "policies", label: "Policies" },
  { id: "faqs", label: "FAQs" },
  { id: "social", label: "Social Links" },
];

const CMSPage = () => {
  const { data: cmsResp, isLoading } = useFetchCms(true);
  const updateCms = useUpdateCms();

  const [form, setForm] = useState<CmsData>(emptyCms);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<string>(TABS[0].id);

  useEffect(() => {
    if (cmsResp?.data) {
      const d = cmsResp.data;
      setForm({
        faqs: d.faqs ?? [],
        contactInfo: d.contactInfo ?? emptyCms.contactInfo,
        socialLinks: d.socialLinks ?? [],
        privacyPolicy: d.privacyPolicy ?? "",
        termsOfService: d.termsOfService ?? "",
        refundPolicy: d.refundPolicy ?? "",
        id: d.id,
      });
    }
  }, [cmsResp]);

  const setField = (k: keyof CmsData, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const updateFaq = (index: number, patch: Partial<Faq>) =>
    setForm((s) => {
      const faqs = [...(s.faqs ?? [])];
      faqs[index] = { ...(faqs[index] ?? { question: "", answer: "" }), ...patch };
      return { ...s, faqs };
    });

  const addFaq = () => setForm((s) => ({ ...s, faqs: [...(s.faqs ?? []), { question: "", answer: "" }] }));

  const removeFaq = (index: number) =>
    setForm((s) => ({ ...s, faqs: (s.faqs ?? []).filter((_, i) => i !== index) }));

  const updateSocial = (index: number, patch: Partial<SocialLink>) =>
    setForm((s) => {
      const socialLinks = [...(s.socialLinks ?? [])];
      socialLinks[index] = { ...(socialLinks[index] ?? { name: "", key: "", url: "" }), ...patch };
      return { ...s, socialLinks };
    });

  const addSocial = () =>
    setForm((s) => ({ ...s, socialLinks: [...(s.socialLinks ?? []), { name: "", key: "", url: "" }] }));

  const removeSocial = (index: number) =>
    setForm((s) => ({ ...s, socialLinks: (s.socialLinks ?? []).filter((_, i) => i !== index) }));

  const handleContactInfo = (patch: Partial<ContactInfo>) =>
    setForm((s) => ({ ...s, contactInfo: { ...(s.contactInfo ?? {}), ...patch } }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload: Partial<CmsData> = {
        faqs: form.faqs ?? [],
        contactInfo: form.contactInfo ?? {},
        socialLinks: form.socialLinks ?? [],
        privacyPolicy: form.privacyPolicy ?? "",
        termsOfService: form.termsOfService ?? "",
        refundPolicy: form.refundPolicy ?? "",
      };
      await updateCms.mutateAsync(payload);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="bg-transparent px-4">
        <div className="container mx-auto flex items-center justify-between gap-4">
          <PageHeader title="CMS" subtitle="Manage site content, policies, FAQs and social links" />
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} disabled={saving || updateCms.isPending}>
              {saving || updateCms.isPending ? "Saving..." : "Save CMS"}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-6">
        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-border mb-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 -mb-px font-medium ${
                activeTab === t.id ? "border-b-2 border-primary text-foreground" : "text-muted-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab panels */}
        <div className="space-y-6">
          {activeTab === "contact" && (
            <div className="bg-background rounded-xl border border-border p-4">
              <h3 className="font-semibold mb-3">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Email</Label>
                  <Input value={form.contactInfo?.email ?? ""} onChange={(e) => handleContactInfo({ email: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={form.contactInfo?.phone ?? ""} onChange={(e) => handleContactInfo({ phone: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Address</Label>
                  <Input value={form.contactInfo?.address ?? ""} onChange={(e) => handleContactInfo({ address: e.target.value })} />
                </div>
                <div className="md:col-span-2">
                  <Label>Business Hours</Label>
                  <Input value={form.contactInfo?.businessHours ?? ""} onChange={(e) => handleContactInfo({ businessHours: e.target.value })} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "policies" && (
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-background rounded-xl border border-border p-4 lg:col-span-1">
                <h3 className="font-semibold mb-3">Privacy Policy</h3>
                <SunEditor
                  setOptions={{ height: '220px', buttonList: [["formatBlock"], ["bold", "italic"], ["list"], ["link"]] }}
                  defaultValue={form.privacyPolicy ?? ""}
                  onChange={(content) => setField("privacyPolicy", content)}
                />
              </div>

              <div className="bg-background rounded-xl border border-border p-4 lg:col-span-1">
                <h3 className="font-semibold mb-3">Terms of Service</h3>
                <SunEditor
                  setOptions={{ height: '220px', buttonList: [["formatBlock"], ["bold", "italic"], ["list"], ["link"]] }}
                  defaultValue={form.termsOfService ?? ""}
                  onChange={(content) => setField("termsOfService", content)}
                />
              </div>

              <div className="bg-background rounded-xl border border-border p-4 lg:col-span-1">
                <h3 className="font-semibold mb-3">Refund Policy</h3>
                <SunEditor
                  setOptions={{ height: '220px', buttonList: [["formatBlock"], ["bold", "italic"], ["list"], ["link"]] }}
                  defaultValue={form.refundPolicy ?? ""}
                  onChange={(content) => setField("refundPolicy", content)}
                />
              </div>
            </div>
          )}

          {activeTab === "faqs" && (
            <div className="bg-background rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">FAQs</h3>
                <Button onClick={addFaq}>Add FAQ</Button>
              </div>

              <div className="space-y-4">
                {(form.faqs ?? []).map((f, i) => (
                  <div key={i} className="border border-border rounded p-3">
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <Label>Question</Label>
                        <Input value={f.question ?? ""} onChange={(e) => updateFaq(i, { question: e.target.value })} className="mt-1" />
                        <Label className="mt-2">Answer</Label>
                        <Textarea value={f.answer ?? ""} onChange={(e) => updateFaq(i, { answer: e.target.value })} className="mt-1" rows={4} />
                      </div>
                      <div>
                        <Button size="sm" variant="destructive" onClick={() => removeFaq(i)}>X</Button>
                      </div>
                    </div>
                  </div>
                ))}
                {(form.faqs ?? []).length === 0 && <div className="text-sm text-muted-foreground">No FAQs yet.</div>}
              </div>
            </div>
          )}

          {activeTab === "social" && (
            <div className="bg-background rounded-xl border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Social Links</h3>
                <Button onClick={addSocial}>Add Link</Button>
              </div>

              <div className="space-y-3">
                {(form.socialLinks ?? []).map((s, i) => (
                  <div key={i} className="flex gap-2 items-center flex-wrap">
                    <div className="flex-1 max-w-md">
                      <Label>Platform</Label>
                      <Select
                        value={s.key ?? ""}
                        onValueChange={(v) => updateSocial(i, { key: v, name: SOCIAL_OPTIONS.find(o => o.key === v)?.name ?? "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {SOCIAL_OPTIONS.map((opt) => (
                            <SelectItem key={opt.key} value={opt.key}>
                              {opt.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex-1">
                      <Label>URL</Label>
                      <Input value={s.url ?? ""} onChange={(e) => updateSocial(i, { url: e.target.value })} className="mt-1" />
                    </div>

                    <div className="flex items-center mt-6">
                      <Button size="sm" variant="destructive" onClick={() => removeSocial(i)}>X</Button>
                    </div>
                  </div>
                ))}
                {(form.socialLinks ?? []).length === 0 && <div className="text-sm text-muted-foreground">No social links yet.</div>}
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CMSPage;
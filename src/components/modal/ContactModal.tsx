/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Contact } from "@/services/contactService";
import { useEffect, useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  contact: Contact | null;
  mode: "view" | "edit";
  onSave: (id: string, payload: Partial<Contact>) => Promise<void>;
}

const ContactModal = ({ isOpen, onClose, contact, mode, onSave }: Props) => {
  const [form, setForm] = useState<Partial<Contact>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(contact ?? {});
  }, [contact]);

  const handleChange = (k: keyof Contact, v: any) => setForm((s) => ({ ...s, [k]: v }));

  const handleSave = async () => {
    if (!contact) return;
    setSaving(true);
    try {
      await onSave(contact.id, {
        name: form.name,
        phone: form.phone,
        status: form.status,
        adminResponse: form.adminResponse ?? null,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "view" ? "View Contact" : "Edit Contact"}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm text-muted-foreground">Name</label>
            <Input value={form.name ?? ""} onChange={(e) => handleChange("name", e.target.value)} disabled={mode === "view"} />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Email</label>
            <Input value={form.email ?? ""} disabled />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Phone</label>
            <Input value={form.phone ?? ""} onChange={(e) => handleChange("phone", e.target.value)} disabled={mode === "view"} />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Subject</label>
            <Input value={form.subject ?? ""} disabled />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Message</label>
            <Textarea value={form.message ?? ""} disabled rows={4} />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Admin Response</label>
            <Textarea value={form.adminResponse ?? ""} onChange={(e) => handleChange("adminResponse", e.target.value)} rows={3} disabled={mode === "view"} />
          </div>

          <div>
            <label className="text-sm text-muted-foreground">Status</label>
            <select value={form.status ?? "PENDING"} onChange={(e) => handleChange("status", e.target.value)} disabled={mode === "view"} className="w-full px-3 py-2 rounded border">
              <option value="PENDING">PENDING</option>
              <option value="RESOLVED">RESOLVED</option>
              <option value="REJECTED">REJECTED</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            {mode === "edit" && (
              <Button onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save"}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContactModal;
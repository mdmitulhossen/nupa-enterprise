import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import PageHeader from "@/components/admin/PageHeader";
import ContactModal from "@/components/modal/ContactModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Contact, useDeleteContact, useFetchContacts, useUpdateContact } from "@/services/contactService";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

const LIMIT = 10;

const STATUS_OPTIONS = [
  { label: "ALL", value: "ALL" },
  { label: "PENDING", value: "PENDING" },
  { label: "RESOLVED", value: "RESOLVED" },
];

const ContactManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"view" | "edit">("view");
  const [selected, setSelected] = useState<Contact | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [toDeleteId, setToDeleteId] = useState<string | null>(null);

  const { data: contactsResp, isLoading } = useFetchContacts(
    { page, limit: LIMIT, searchTerm: searchQuery, status: statusFilter },
    true
  );

  const updateContact = useUpdateContact();
  const deleteContact = useDeleteContact();

  const contacts = contactsResp?.data?.data || [];
  const meta = contactsResp?.data?.meta;
  const totalPages = Math.max(1, Math.ceil((meta?.total ?? 0) / (meta?.limit ?? LIMIT)));

  const openView = (c: Contact) => {
    setSelected(c);
    setModalMode("view");
    setIsModalOpen(true);
  };

  const openEdit = (c: Contact) => {
    setSelected(c);
    setModalMode("edit");
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateContact.mutateAsync({ id, payload: { status } });
    } catch {
      /* handled by hook */
    }
  };

  const handleSave = async (id: string, payload: Partial<Contact>) => {
    try {
      await updateContact.mutateAsync({ id, payload });
      setIsModalOpen(false);
    } catch {
      /* handled */
    }
  };

  const handleDeleteClick = (id: string) => {
    setToDeleteId(id);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!toDeleteId) return;
    try {
      await deleteContact.mutateAsync(toDeleteId);
      setIsDeleteOpen(false);
      setToDeleteId(null);
    } catch {
      /* handled */
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteOpen(false);
    setToDeleteId(null);
  };

  const columns: Column<Contact>[] = [
    { header: "Name", accessor: (r) => <div className="font-medium">{r.name}</div> },
    { header: "Email", accessor: (r) => <div className="text-sm text-muted-foreground">{r.email}</div> },
    { header: "Phone", accessor: (r) => r.phone ?? "—", className: "text-center" },
    { header: "Subject", accessor: (r) => <div className="text-sm line-clamp-1">{r.subject}</div> },
    {
      header: "Message",
      accessor: (r) => <div className="text-sm text-muted-foreground line-clamp-2">{r.message}</div>,
    },
    {
      header: "Status",
      accessor: (r) => (
        <select
          className="text-sm px-2 py-1 rounded border"
          value={r.status}
          onChange={(e) => handleStatusChange(r.id, e.target.value)}
          disabled={updateContact.isPending}
        >
          <option value="PENDING">PENDING</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>
      ),
      className: "text-center",
    },
    {
      header: "Created At",
      accessor: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleString() : "—"),
      className: "text-center",
    },
    {
      header: "Action",
      accessor: (r) => (
        <div className="flex items-center justify-center gap-2">
          <Button size="icon" variant="ghost" onClick={() => openView(r)} title="View">
            <Eye className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => openEdit(r)} title="Edit">
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={() => handleDeleteClick(r.id)}
            disabled={deleteContact.isPending}
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
      className: "text-center",
    },
  ];

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <PageHeader title="Contact Management" subtitle="User contact messages" />
      </div>
      <div className="bg-background rounded-xl border border-border p-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      {/* Search */}
                      <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 flex-1">
                        <Input placeholder="Search by name, email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="border-0 p-0 h-auto shadow-none focus-visible:ring-0 text-sm" />
                      </div>
            
                      {/* Status select */}
                      <div className="flex items-center gap-2">
                        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(String(v)==="ALL" ? "" : String(v))}>
                          <SelectTrigger className="w-[170px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUS_OPTIONS.map((o) => (
                              <SelectItem key={o.value} value={o.value}>
                                {o.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
            
                      </div>
                    </div>
      </div>
 
      <DataTable
        columns={columns}
        data={contacts}
        emptyMessage={isLoading ? "Loading..." : "No contacts found"}
      />

      {/* simple pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-4">
          <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
            Prev
          </Button>
          <div className="px-3 py-1 rounded border">{page} / {totalPages}</div>
          <Button variant="outline" size="icon" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
            Next
          </Button>
        </div>
      )}

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        contact={selected}
        mode={modalMode}
        onSave={handleSave}
      />

      <DeleteConfirmationDialog
        isOpen={isDeleteOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        title="Delete Contact"
        description="Are you sure you want to delete this contact? This action cannot be undone."
        isLoading={deleteContact.isPending}
      />
    </AdminLayout>
  );
};

export default ContactManagement;
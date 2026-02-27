import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import IndustryModal from "@/components/admin/IndustryModal";
import PageHeader from "@/components/admin/PageHeader";
import SearchFilter from "@/components/admin/SearchFilter";
import { Button } from "@/components/ui/button";
import { useDeleteIndustry, useFetchIndustries } from "@/services/industryService";
import { Industry } from "@/types/industry";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const Industries = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedIndustryId, setSelectedIndustryId] = useState<string | null>(null);
    const [isIndustryModalOpen, setIsIndustryModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selectedIndustry, setSelectedIndustry] = useState<Industry | null>(null);

    const { data: industriesResponse, isLoading } = useFetchIndustries({ searchTerm: searchQuery });
    const deleteIndustryMutation = useDeleteIndustry();

    const industries = industriesResponse?.data || [];

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedIndustry(null);
        setIsIndustryModalOpen(true);
    };

    const handleEditClick = (industry: Industry) => {
        setModalMode("edit");
        setSelectedIndustry(industry);
        setIsIndustryModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsIndustryModalOpen(false);
        setSelectedIndustry(null);
    };

    const handleDeleteClick = (id: string) => {
        setSelectedIndustryId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedIndustryId) return;
        try {
            await deleteIndustryMutation.mutateAsync(selectedIndustryId);
            setIsDeleteDialogOpen(false);
            setSelectedIndustryId(null);
        } catch (error) {
            // Error handled in mutation
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setSelectedIndustryId(null);
    };

    const columns: Column<Industry>[] = [
        {
            header: "Name",
            accessor: "name",
            className: "font-medium"
        },
        {
            header: "Image",
            accessor: (row) => row.image ? (
                <img src={row.image} alt={row.name} className="w-12 h-12 object-cover rounded" />
            ) : (
                <span className="text-muted-foreground">No image</span>
            ),
            className: "text-center"
        },
        {
            header: "Created At",
            accessor: (row) => row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
            className: "text-center"
        },
        {
            header: "Action",
            accessor: (row) => (
                <div className="flex items-center justify-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(row)}>
                        <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteClick(row.id)}
                        disabled={deleteIndustryMutation.isPending}
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
                <PageHeader
                    title="Industries Management"
                    subtitle="Manage your industries"
                />
                <Button className="gap-2" onClick={handleAddClick}>
                    <Plus className="w-4 h-4" />
                    Add Industry
                </Button>
            </div>

            {/* Filters */}
            <SearchFilter
                searchPlaceholder="Search industries..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Table */}
            <DataTable
                columns={columns}
                data={industries}
                emptyMessage={isLoading ? "Loading..." : "No industries found"}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete Industry"
                description="Are you sure you want to delete this industry? This action cannot be undone."
                isLoading={deleteIndustryMutation.isPending}
            />

            {/* Industry Modal */}
            <IndustryModal
                isOpen={isIndustryModalOpen}
                onClose={handleCloseModal}
                industry={selectedIndustry}
                mode={modalMode}
            />
        </AdminLayout>
    );
};

export default Industries;
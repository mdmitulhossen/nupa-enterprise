
import AdminLayout from "@/components/admin/AdminLayout";
import CategoryModal from "@/components/admin/CategoryModal";
import DataTable, { Column } from "@/components/admin/DataTable";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import PageHeader from "@/components/admin/PageHeader";
import SearchFilter from "@/components/admin/SearchFilter";
import { Button } from "@/components/ui/button";
import { useDeleteCategory, useFetchCategories } from "@/services/categoryService";
import { Category } from "@/types/category";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

const Categories = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"add" | "edit">("add");
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

    const { data: categoriesResponse, isLoading } = useFetchCategories({ searchTerm: searchQuery });
    const deleteCategoryMutation = useDeleteCategory();

    const categories = categoriesResponse?.data || [];

    const handleAddClick = () => {
        setModalMode("add");
        setSelectedCategory(null);
        setIsCategoryModalOpen(true);
    };

    const handleEditClick = (category: Category) => {
        setModalMode("edit");
        setSelectedCategory(category);
        setIsCategoryModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsCategoryModalOpen(false);
        setSelectedCategory(null);
    };

    const handleDeleteClick = (id: string) => {
        setSelectedCategoryId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedCategoryId) return;
        try {
            await deleteCategoryMutation.mutateAsync(selectedCategoryId);
            setIsDeleteDialogOpen(false);
            setSelectedCategoryId(null);
        } catch (error) {
            // Error handled in mutation
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setSelectedCategoryId(null);
    };

    const columns: Column<Category>[] = [
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
                        disabled={deleteCategoryMutation.isPending}
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
                    title="Categories Management"
                    subtitle="Manage your categories"
                />
                <Button className="gap-2" onClick={handleAddClick}>
                    <Plus className="w-4 h-4" />
                    Add Category
                </Button>
            </div>

            {/* Filters */}
            <SearchFilter
                searchPlaceholder="Search categories..."
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
            />

            {/* Table */}
            <DataTable
                columns={columns}
                data={categories}
                emptyMessage={isLoading ? "Loading..." : "No categories found"}
            />

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete Category"
                description="Are you sure you want to delete this category? This action cannot be undone."
                isLoading={deleteCategoryMutation.isPending}
            />

            {/* Category Modal */}
            <CategoryModal
                isOpen={isCategoryModalOpen}
                onClose={handleCloseModal}
                category={selectedCategory}
                mode={modalMode}
            />
        </AdminLayout>
    );
};

export default Categories;
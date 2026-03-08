// pages/admin/Ratings.tsx
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import PageHeader from "@/components/admin/PageHeader";
import SearchFilter from "@/components/admin/SearchFilter";
import RatingModal from "@/components/modal/RatingModal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Rating, useDeleteRating, useFetchRatings, useUpdateRating } from "@/services/ratingService";
import { Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";

const Ratings = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedRatingId, setSelectedRatingId] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedRating, setSelectedRating] = useState<Rating | null>(null);




    const { data: ratingsResponse, isLoading } = useFetchRatings({
        page,
        limit: 10,
    });

    const deleteRatingMutation = useDeleteRating();
    const updateRatingMutation = useUpdateRating();

    const ratings = ratingsResponse?.data || [];
    const meta = ratingsResponse?.meta;

    const handleDeleteClick = (id: string) => {
        setSelectedRatingId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedRatingId) return;
        try {
            await deleteRatingMutation.mutateAsync(selectedRatingId);
            setIsDeleteDialogOpen(false);
            setSelectedRatingId(null);
        } catch (error) {
            // Error handled in mutation
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setSelectedRatingId(null);
    };

    const handleToggleFeatured = (rating: Rating) => {
        updateRatingMutation.mutate({
            id: rating.id,
            payload: { isFeatured: !rating.isFeatured },
        });
    };

    const handleEditClick = (rating: Rating) => {
    setSelectedRating(rating);
    setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedRating(null);
    };

    const renderStars = (count: number) => (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <Star
                    key={i}
                    className={`w-4 h-4 ${i < count ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                />
            ))}
        </div>
    );

    const columns: Column<Rating>[] = [
        {
            header: "User",
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    {row.user?.image ? (
                        <img
                            src={row.user.image}
                            alt={`${row.user.firstName} ${row.user.lastName}`}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {row.user?.firstName?.charAt(0)}
                        </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-medium text-sm">
                            {row.user?.firstName} {row.user?.lastName}
                        </span>
                        <span className="text-xs text-muted-foreground">{row.user?.email}</span>
                    </div>
                </div>
            ),
        },
        {
            header: "Product",
            accessor: (row) => (
                <div className="flex flex-col">
                    <span className="font-medium text-sm">{row.product?.name}</span>
                    <span className="text-xs text-muted-foreground">#{row.product?.p_id}</span>
                </div>
            ),
        },
        {
            header: "Rating",
            accessor: (row) => renderStars(row.rating),
            className: "text-center",
        },
        {
            header: "Review",
            accessor: (row) => (
                <p className="text-sm text-muted-foreground max-w-xs truncate">
                    {row.description}
                </p>
            ),
        },
        {
            header: "Featured",
            accessor: (row) => (
                <div className="flex items-center justify-center">
                    <Switch
                        checked={row.isFeatured}
                        onCheckedChange={() => handleToggleFeatured(row)}
                        disabled={updateRatingMutation.isPending}
                    />
                </div>
            ),
            className: "text-center",
        },
        {
            header: "Date",
            accessor: (row) =>
                row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
            className: "text-center",
        },
       {
    header: "Action",
    accessor: (row) => (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => handleEditClick(row)}
            >
                <Pencil className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => handleDeleteClick(row.id)}
                disabled={deleteRatingMutation.isPending}
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
                    title="Ratings Management"
                    subtitle={`Total ${meta?.total ?? 0} ratings`}
                />
            </div>

            <SearchFilter
                searchPlaceholder="Search ratings..."
                searchValue={searchQuery}
                onSearchChange={(val) => {
                    setSearchQuery(val);
                    setPage(1);
                }}
            />

            <DataTable
                columns={columns}
                data={ratings}
                emptyMessage={isLoading ? "Loading..." : "No ratings found"}
            />

            {meta && meta.total > meta.limit && (
                <div className="flex items-center justify-end gap-2 mt-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((p) => p + 1)}
                        disabled={page >= Math.ceil(meta.total / meta.limit)}
                    >
                        Next
                    </Button>
                </div>
            )}

            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete Rating"
                description="Are you sure you want to delete this rating? This action cannot be undone."
                isLoading={deleteRatingMutation.isPending}
            />
           <RatingModal
            isOpen={isEditModalOpen}
            onClose={handleCloseModal}
            rating={selectedRating}
/>
        </AdminLayout>
    );
};

export default Ratings;
// pages/admin/Users.tsx
import AdminLayout from "@/components/admin/AdminLayout";
import DataTable, { Column } from "@/components/admin/DataTable";
import DeleteConfirmationDialog from "@/components/admin/DeleteConfirmationDialog";
import PageHeader from "@/components/admin/PageHeader";
import SearchFilter from "@/components/admin/SearchFilter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFetchUsers, User, UserRole, UserStatus } from "@/services/userService";
import { useState } from "react";

const Users = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { data: usersResponse, isLoading } = useFetchUsers({
        page,
        limit: 10,
        searchTerm: searchQuery,
    });

    const users = usersResponse?.data || [];
    const meta = usersResponse?.meta;

    const handleDeleteClick = (id: string) => {
        setSelectedUserId(id);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUserId) return;
        try {
            // await deleteUserMutation.mutateAsync(selectedUserId);
            setIsDeleteDialogOpen(false);
            setSelectedUserId(null);
        } catch (error) {
            // Error handled in mutation
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setSelectedUserId(null);
    };

    const columns: Column<User>[] = [
        {
            header: "Name",
            accessor: (row) => (
                <div className="flex items-center gap-3">
                    {row.image ? (
                        <img
                            src={row.image}
                            alt={`${row.firstName} ${row.lastName}`}
                            className="w-8 h-8 rounded-full object-cover"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                            {row.firstName?.charAt(0)}
                        </div>
                    )}
                    <span className="font-medium">{row.firstName} {row.lastName}</span>
                </div>
            ),
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Role",
            accessor: (row) => (
                <Badge variant={row.role === UserRole.ADMIN ? "default" : "secondary"}>
                    {row.role}
                </Badge>
            ),
            className: "text-center",
        },
        {
            header: "Status",
            accessor: (row) => (
                <Badge
                    variant={
                        row.status === UserStatus.ACTIVE
                            ? "default"
                            : row.status === UserStatus.SUSPENDED
                            ? "destructive"
                            : "secondary"
                    }
                >
                    {row.status}
                </Badge>
            ),
            className: "text-center",
        },
        {
            header: "Verified",
            accessor: (row) => (
                <Badge variant={row.isVerified ? "default" : "outline"}>
                    {row.isVerified ? "Verified" : "Unverified"}
                </Badge>
            ),
            className: "text-center",
        },
        {
            header: "Joined",
            accessor: (row) =>
                row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
            className: "text-center",
        },
        // {
        //     header: "Action",
        //     accessor: (row) => (
        //         <div className="flex items-center justify-center gap-2">
        //             <Button
        //                 variant="ghost"
        //                 size="icon"
        //                 className="h-8 w-8 text-destructive hover:text-destructive"
        //                 onClick={() => handleDeleteClick(row.id)}
        //             >
        //                 <Trash2 className="w-4 h-4" />
        //             </Button>
        //         </div>
        //     ),
        //     className: "text-center",
        // },
    ];

    return (
        <AdminLayout>
            <div className="flex items-center justify-between mb-6">
                <PageHeader
                    title="Users Management"
                    subtitle={`Total ${meta?.total ?? 0} users`}
                />
            </div>

            {/* Filters */}
            <SearchFilter
                searchPlaceholder="Search users..."
                searchValue={searchQuery}
                onSearchChange={(val) => {
                    setSearchQuery(val);
                    setPage(1); // reset page on new search
                }}
            />

            {/* Table */}
            <DataTable
                columns={columns}
                data={users}
                emptyMessage={isLoading ? "Loading..." : "No users found"}
            />

            {/* Pagination */}
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

            {/* Delete Confirmation Dialog */}
            <DeleteConfirmationDialog
                isOpen={isDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                title="Delete User"
                description="Are you sure you want to delete this user? This action cannot be undone."
                isLoading={false}
            />
        </AdminLayout>
    );
};

export default Users;